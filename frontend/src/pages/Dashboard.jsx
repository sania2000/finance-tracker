
import React, { useEffect, useState } from "react";
import API from "../utils/api";
import { Link } from "react-router-dom";
import CategoryPieChart from "../components/CategoryPieChart";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ income: 0, expense: 0 });
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    type: "",
    from: "",
    to: "",
  });
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    return `${yyyy}-${mm}`;
  });

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Could not load categories:", err);
      setCategories([]);
    }
  };

  const fetchTransactions = async () => {
    try {
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.type) params.type = filters.type;
      if (filters.from) params.from = filters.from;
      if (filters.to) params.to = filters.to;

      const res = await API.get("/transactions", { params });
      setTransactions(res.data);

      let inc = 0,
        exp = 0;
      res.data.forEach((tx) => {
        if (tx.type === "income") inc += tx.amount;
        else exp += tx.amount;
      });
      setSummary({ income: inc, expense: exp });
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setTransactions([]);
      setSummary({ income: 0, expense: 0 });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    try {
      await API.delete(`/transactions/${id}`);
      fetchTransactions();
    } catch (err) {
      console.error(err);
    }
  };

  //  data load
  useEffect(() => {
    fetchCategories();
    fetchTransactions();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    fetchTransactions();
  };

  const clearFilters = () => {
    setFilters({ category: "", type: "", from: "", to: "" });
    setTimeout(fetchTransactions, 0);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("My Transactions", 14, 22);

    const tableColumn = ["Date", "Type", "Category", "Amount (€)", "Description"];
    const tableRows = [];

    transactions.forEach((tx) => {
      const row = [
        new Date(tx.date).toLocaleDateString(),
        tx.type,
        tx.type === "expense" ? tx.category?.name || "—" : "—",
        tx.amount.toFixed(2),
        tx.description || "–",
      ];
      tableRows.push(row);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [33, 150, 243] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    doc.save("transactions.pdf");
  };

  return (
    <div className="container">
      {/* Summary */}
      <div className="summary" style={{ marginBottom: "var(--space-4)" }}>
        <div className="summary-card">
          <h3>Total Income</h3>
          <p>€{summary.income.toFixed(2)}</p>
        </div>
        <div className="summary-card">
          <h3>Total Expense</h3>
          <p>€{summary.expense.toFixed(2)}</p>
        </div>
        <div className="summary-card">
          <h3>Balance</h3>
          <p>€{(summary.income - summary.expense).toFixed(2)}</p>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ marginBottom: "var(--space-4)" }}>
        <button className="btn btn-secondary" style={{ marginRight: "var(--space-2)" }} onClick={downloadPDF}>
          Export as PDF
        </button>
        <Link to="/add-transaction" className="btn btn-secondary" style={{ marginRight: "var(--space-2)" }}>
          Add Transaction
        </Link>
        <Link to="/categories" className="btn">
          Manage Categories
        </Link>
      </div>

      {/* Main grid  */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1.5fr",
          gap: "var(--space-5)",
        }}
      >
        {/*  & transaction table */}
        <div>
          <details style={{ marginBottom: "var(--space-4)" }}>
            <summary
              style={{
                fontWeight: 600,
                cursor: "pointer",
                padding: "var(--space-2) var(--space-3)",
                background: "var(--color-surface)",
                borderRadius: "var(--radius-sm)",
              }}
            >
              🔍 Filters
            </summary>
            <div
              style={{
                padding: "var(--space-3)",
                background: "var(--color-surface)",
                borderRadius: "var(--radius-sm)",
                marginTop: "var(--space-2)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "var(--space-3)",
                  marginBottom: "var(--space-3)",
                }}
              >
                <div style={{ flex: "1 1 140px" }}>
                  <label htmlFor="category-filter">Category</label>
                  <select
                    id="category-filter"
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ flex: "1 1 120px" }}>
                  <label htmlFor="type-filter">Type</label>
                  <select id="type-filter" name="type" value={filters.type} onChange={handleFilterChange}>
                    <option value="">All Types</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>

                <div style={{ flex: "1 1 140px" }}>
                  <label htmlFor="from-filter">From</label>
                  <input id="from-filter" type="date" name="from" value={filters.from} onChange={handleFilterChange} />
                </div>

                <div style={{ flex: "1 1 140px" }}>
                  <label htmlFor="to-filter">To</label>
                  <input id="to-filter" type="date" name="to" value={filters.to} onChange={handleFilterChange} />
                </div>
              </div>

              <div style={{ display: "flex", gap: "var(--space-2)" }}>
                <button className="btn btn-secondary" onClick={applyFilters}>
                  Apply
                </button>
                <button className="btn" onClick={clearFilters}>
                  Clear
                </button>
              </div>
            </div>
          </details>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Amount (€)</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx._id}>
                    <td>{new Date(tx.date).toLocaleDateString()}</td>
                    <td>{tx.type}</td>
                    <td>{tx.type === "expense" ? tx.category?.name || "—" : "—"}</td>
                    <td>{tx.amount.toFixed(2)}</td>
                    <td>{tx.description || "–"}</td>
                    <td>
                      <button
                        className="btn btn-secondary"
                        style={{ backgroundColor: "#ef4444", fontSize: "0.875rem" }}
                        onClick={() => handleDelete(tx._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", color: "var(--color-text-light)" }}>
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* pie chart */}
        <div>
          <div className="form-card">
            <label htmlFor="month-select">Month:</label>
            <input
              id="month-select"
              type="month"
              value={selectedMonth}
              onChange={handleMonthChange}
            />
            <CategoryPieChart month={selectedMonth} />
          </div>
        </div>
      </div>
    </div>
  );
}
