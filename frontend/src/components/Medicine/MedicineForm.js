import { useState, useEffect } from "react";
import "./MedicineForm.css";

const CATEGORIES = ["Tablet", "Capsule", "Syrup", "Injection", "Cream", "Drops", "Inhaler", "Other"];

const defaultForm = {
  name: "", genericName: "", category: "Tablet", description: "",
  manufacturer: "", stock: "", lowStockThreshold: 10,
  price: "", expiryDate: "", requiresPrescription: false, isAvailable: true,
};

export default function MedicineForm({ onSubmit, onCancel, initial }) {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (initial) {
      setForm({
        ...initial,
        expiryDate: initial.expiryDate ? initial.expiryDate.split("T")[0] : "",
      });
    }
  }, [initial]);

  const set = (field) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [field]: val });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box card">
        <h2 className="modal-title">{initial ? "Edit Medicine" : "Add Medicine"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div className="form-group">
              <label>Medicine Name *</label>
              <input value={form.name} onChange={set("name")} required placeholder="e.g. Paracetamol" />
            </div>
            <div className="form-group">
              <label>Generic Name</label>
              <input value={form.genericName} onChange={set("genericName")} placeholder="e.g. Acetaminophen" />
            </div>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label>Category *</label>
              <select value={form.category} onChange={set("category")}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Manufacturer</label>
              <input value={form.manufacturer} onChange={set("manufacturer")} placeholder="Company name" />
            </div>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label>Stock (units) *</label>
              <input type="number" value={form.stock} onChange={set("stock")} required min="0" />
            </div>
            <div className="form-group">
              <label>Low Stock Alert At</label>
              <input type="number" value={form.lowStockThreshold} onChange={set("lowStockThreshold")} min="1" />
            </div>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label>Price (₹) *</label>
              <input type="number" value={form.price} onChange={set("price")} required min="0" step="0.01" />
            </div>
            <div className="form-group">
              <label>Expiry Date *</label>
              <input type="date" value={form.expiryDate} onChange={set("expiryDate")} required />
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea value={form.description} onChange={set("description")} rows={2} placeholder="Optional notes..." style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border)", resize: "vertical" }} />
          </div>
          <div className="flex gap-2 mb-2">
            <label className="checkbox-label">
              <input type="checkbox" checked={form.requiresPrescription} onChange={set("requiresPrescription")} />
              Requires Prescription
            </label>
            <label className="checkbox-label">
              <input type="checkbox" checked={form.isAvailable} onChange={set("isAvailable")} />
              Available
            </label>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn btn-primary">{initial ? "Update" : "Add Medicine"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
