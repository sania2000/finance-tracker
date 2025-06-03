
import React, { useEffect, useState } from "react";
import API from "../utils/api";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", monthlyBudget: "" });
  const [editing, setEditing] = useState(null);

  const fetchCats = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Could not load categories:", err);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    try {
      await API.post("/categories", {
        name: form.name.trim(),
        monthlyBudget: parseFloat(form.monthlyBudget) || 0,
      });
      setForm({ name: "", monthlyBudget: "" });
      fetchCats();
    } catch (err) {
      alert(err.response?.data?.message || "Could not add category");
    }
  };

  const startEdit = (cat) => {
    setEditing(cat._id);
    setForm({ name: cat.name, monthlyBudget: cat.monthlyBudget.toString() });
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/categories/${editing}`, {
        name: form.name.trim(),
        monthlyBudget: parseFloat(form.monthlyBudget) || 0,
      });
      setEditing(null);
      setForm({ name: "", monthlyBudget: "" });
      fetchCats();
    } catch (err) {
      alert(err.response?.data?.message || "Could not update category");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await API.delete(`/categories/${id}`);
      fetchCats();
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete category");
    }
  };

  return (
    <div className="container">
      <h2 style={{ marginBottom: "var(--space-4)" }}>Manage Categories</h2>

      <div className="form-card" style={{ marginBottom: "var(--space-5)" }}>
        <h3>{editing ? "Edit Category" : "Add New Category"}</h3>
        <form onSubmit={editing ? handleEdit : handleAdd}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="e.g. Groceries"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="monthlyBudget">Monthly Budget (€)</label>
          <input
            id="monthlyBudget"
            type="number"
            name="monthlyBudget"
            placeholder="0.00"
            value={form.monthlyBudget}
            onChange={handleChange}
            step="0.01"
          />

          <button type="submit" className="btn btn-secondary">
            {editing ? "Update" : "Add"}
          </button>
          {editing && (
            <button
              type="button"
              className="btn"
              style={{ marginLeft: "var(--space-2)" }}
              onClick={() => {
                setEditing(null);
                setForm({ name: "", monthlyBudget: "" });
              }}
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Monthly Budget (€)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id}>
                <td>{cat.name}</td>
                <td>{cat.monthlyBudget.toFixed(2)}</td>
                <td>
                  <button
                    className="btn btn-secondary"
                    style={{ marginRight: "var(--space-2)" }}
                    onClick={() => startEdit(cat)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn"
                    style={{ backgroundColor: "#ef4444", color: "#fff" }}
                    onClick={() => handleDelete(cat._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={3} style={{ textAlign: "center", color: "var(--color-text-light)" }}>
                  No categories yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
