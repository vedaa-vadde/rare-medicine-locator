import { useState, useEffect } from "react";
import { getDashboardStats, getMyMedicines, addMedicine, updateMedicine, deleteMedicine } from "../utils/api";
import MedicineCard from "../components/Medicine/MedicineCard";
import MedicineForm from "../components/Medicine/MedicineForm";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import "./PharmacyDashboard.css";

export default function PharmacyDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    try {
      const [statsRes, medsRes] = await Promise.all([getDashboardStats(), getMyMedicines()]);
      setStats(statsRes.data);
      setMedicines(medsRes.data);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleAdd = async (form) => {
    try {
      await addMedicine(form);
      toast.success("Medicine added!");
      setShowForm(false);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add medicine");
    }
  };

  const handleEdit = async (form) => {
    try {
      await updateMedicine(editTarget._id, form);
      toast.success("Medicine updated!");
      setEditTarget(null);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this medicine?")) return;
    try {
      await deleteMedicine(id);
      toast.success("Deleted");
      fetchAll();
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading) return <div className="page"><div className="container"><p>Loading...</p></div></div>;

  return (
    <div className="page">
      <div className="container">
        <div className="flex-between mb-2">
          <div>
            <h1 className="page-title" style={{ marginBottom: 4 }}>Pharmacy Dashboard</h1>
            <p className="text-muted">{user.pharmacyName}</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Add Medicine</button>
        </div>

        {stats && (
          <div className="stats-grid mb-2">
            <div className="stat-card">
              <div className="stat-value">{stats.totalMedicines}</div>
              <div className="stat-label">Total Medicines</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.totalStock}</div>
              <div className="stat-label">Total Units</div>
            </div>
            <div className={`stat-card ${stats.lowStockCount > 0 ? "stat-warning" : ""}`}>
              <div className="stat-value">{stats.lowStockCount}</div>
              <div className="stat-label">Low Stock</div>
            </div>
            <div className={`stat-card ${stats.outOfStockCount > 0 ? "stat-danger" : ""}`}>
              <div className="stat-value">{stats.outOfStockCount}</div>
              <div className="stat-label">Out of Stock</div>
            </div>
            <div className={`stat-card ${stats.expiringSoonCount > 0 ? "stat-warning" : ""}`}>
              <div className="stat-value">{stats.expiringSoonCount}</div>
              <div className="stat-label">Expiring Soon</div>
            </div>
          </div>
        )}

        {stats?.lowStockItems?.length > 0 && (
          <div className="alert alert-warning mb-2">
            ⚠️ <strong>{stats.lowStockItems.length} medicine(s)</strong> are running low:&nbsp;
            {stats.lowStockItems.map(m => m.name).join(", ")}
          </div>
        )}

        {stats?.expiringSoonItems?.length > 0 && (
          <div className="alert alert-danger mb-2">
            🗓️ <strong>{stats.expiringSoonItems.length} medicine(s)</strong> expiring within 30 days:&nbsp;
            {stats.expiringSoonItems.map(m => m.name).join(", ")}
          </div>
        )}

        <h2 className="section-title">Your Inventory ({medicines.length})</h2>
        {medicines.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: 48, color: "var(--muted)" }}>
            <p style={{ fontSize: 40 }}>📦</p>
            <p>No medicines added yet. Click "Add Medicine" to start.</p>
          </div>
        ) : (
          <div className="grid-2">
            {medicines.map(med => (
              <MedicineCard
                key={med._id}
                medicine={med}
                onEdit={(m) => setEditTarget(m)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {showForm && <MedicineForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />}
        {editTarget && <MedicineForm initial={editTarget} onSubmit={handleEdit} onCancel={() => setEditTarget(null)} />}
      </div>
    </div>
  );
}
