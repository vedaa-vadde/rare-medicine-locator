import "./MedicineCard.css";

const getStockBadge = (stock, threshold) => {
  if (stock === 0) return { label: "Out of Stock", cls: "badge-danger" };
  if (stock < threshold) return { label: "Low Stock", cls: "badge-warning" };
  return { label: "In Stock", cls: "badge-success" };
};

const isExpiringSoon = (expiryDate) => {
  const diff = new Date(expiryDate) - new Date();
  return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000;
};

export default function MedicineCard({ medicine, onEdit, onDelete }) {
  const stock = getStockBadge(medicine.stock, medicine.lowStockThreshold);
  const expiringSoon = isExpiringSoon(medicine.expiryDate);

  return (
    <div className="medicine-card card">
      <div className="mc-header">
        <div>
          <h3 className="mc-name">{medicine.name}</h3>
          {medicine.genericName && <p className="mc-generic">{medicine.genericName}</p>}
        </div>
        <span className={`badge ${stock.cls}`}>{stock.label}</span>
      </div>

      <div className="mc-meta">
        <span className="badge badge-info">{medicine.category}</span>
        {medicine.requiresPrescription && <span className="badge badge-warning">Rx Required</span>}
        {expiringSoon && <span className="badge badge-danger">Expires Soon</span>}
      </div>

      <div className="mc-details">
        <div className="mc-detail">
          <span className="mc-label">Stock</span>
          <span className="mc-value">{medicine.stock} units</span>
        </div>
        <div className="mc-detail">
          <span className="mc-label">Price</span>
          <span className="mc-value">₹{medicine.price}</span>
        </div>
        <div className="mc-detail">
          <span className="mc-label">Expires</span>
          <span className={`mc-value ${expiringSoon ? "text-warning" : ""}`}>
            {new Date(medicine.expiryDate).toLocaleDateString("en-IN")}
          </span>
        </div>
      </div>

      {medicine.pharmacy && (
        <div className="mc-pharmacy">
          📍 {medicine.pharmacy.pharmacyName || "—"} · {medicine.pharmacy.address || ""}
        </div>
      )}

      {(onEdit || onDelete) && (
        <div className="mc-actions">
          {onEdit && <button className="btn btn-outline btn-sm" onClick={() => onEdit(medicine)}>Edit</button>}
          {onDelete && <button className="btn btn-danger btn-sm" onClick={() => onDelete(medicine._id)}>Delete</button>}
        </div>
      )}
    </div>
  );
}
