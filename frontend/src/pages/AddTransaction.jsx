
import React, { useState, useEffect } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function AddTransaction() {
  const [form, setForm] = useState({
    amount: "",
    type: "expense",
    category: "",
    date: "",
    description: "",
  });
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await API.get("/categories");
        setCategories(res.data);
        if (res.data.length) {
          setForm((f) => ({ ...f, category: res.data[0]._id }));
        }
      } catch (err) {
        console.error("Could not load categories:", err);
      }
    };
    fetchCats();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "type") {
      if (value === "income") {
        setForm({ ...form, type: "income", category: "" });
      } else {
        setForm((prev) => ({
          ...prev,
          type: "expense",
          category: categories[0]?._id || "",
        }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        amount: parseFloat(form.amount),
        type: form.type,
        ...(form.type === "expense" && { category: form.category }),
        date: form.date,
        description: form.description.trim(),
      };
      await API.post("/transactions", payload);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add transaction");
    }
  };

  return (
    <div className="container">
      <div className="form-card">
        <h2 style={{ textAlign: "center", marginBottom: "var(--space-4)" }}>
          Add Transaction
        </h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="amount">Amount (€)</label>
          <input
            id="amount"
            type="number"
            name="amount"
            placeholder="0.00"
            value={form.amount}
            onChange={handleChange}
            required
            step="0.01"
          />

          <label htmlFor="type">Type</label>
          <select id="type" name="type" value={form.type} onChange={handleChange} required>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          {form.type === "expense" && (
            <>
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </>
          )}

          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />

          <label htmlFor="description">Description (optional)</label>
          <input
            id="description"
            type="text"
            name="description"
            placeholder="Something about it"
            value={form.description}
            onChange={handleChange}
          />

          <button type="submit" className="btn btn-secondary" style={{ width: "100%" }}>
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
