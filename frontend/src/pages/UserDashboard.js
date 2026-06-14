import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function UserDashboard() {
  const { user } = useAuth();

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Welcome, {user.name}!</h1>

        <div className="grid-2">
          <Link to="/search" style={{ textDecoration: "none" }}>
            <div className="card user-action-card">
              <div className="ua-icon">🔍</div>
              <h3>Search Medicines</h3>
              <p>Find medicines by name or category across all pharmacies.</p>
            </div>
          </Link>

          <Link to="/nearby" style={{ textDecoration: "none" }}>
            <div className="card user-action-card">
              <div className="ua-icon">📍</div>
              <h3>Nearby Pharmacies</h3>
              <p>View pharmacies near you on a map and check their stock.</p>
            </div>
          </Link>
        </div>

        <div className="card mt-3" style={{ background: "linear-gradient(135deg, #e3f2fd, #f5f7fa)" }}>
          <h3 style={{ marginBottom: 8 }}>💡 Tips</h3>
          <ul style={{ paddingLeft: 20, color: "var(--muted)", fontSize: 14, lineHeight: 2 }}>
            <li>Use <strong>Search</strong> to look for a specific medicine across all pharmacies.</li>
            <li>Use <strong>Nearby</strong> to find pharmacies within 10km of your location.</li>
            <li>You'll get <strong>real-time notifications</strong> when stock changes for medicines you're viewing.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
