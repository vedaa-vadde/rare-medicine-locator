import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="nav-brand">
          💊 MediLocate
        </Link>
        <div className="nav-links">
          <Link to="/search">Search</Link>
          <Link to="/nearby">Nearby</Link>
          {user ? (
            <>
              <Link to={user.role === "pharmacy" ? "/dashboard/pharmacy" : "/dashboard/user"}>
                Dashboard
              </Link>
              <span className="nav-user">Hi, {user.name.split(" ")[0]}</span>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
