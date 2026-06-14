import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import "./AuthPages.css";

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", password: "", role: "user",
    pharmacyName: "", address: "", phone: "", latitude: "", longitude: "",
  });

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await register(form);
      toast.success("Account created!");
      navigate(user.role === "pharmacy" ? "/dashboard/pharmacy" : "/dashboard/user");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setForm({ ...form, latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      () => toast.error("Could not get location")
    );
  };

  return (
    <div className="auth-page">
      <div className="auth-card card" style={{ maxWidth: 520 }}>
        <div className="auth-header">
          <h1>💊 MediLocate</h1>
          <p>Create your account</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Account Type</label>
            <select value={form.role} onChange={set("role")}>
              <option value="user">User (Find medicines)</option>
              <option value="pharmacy">Pharmacy (Manage inventory)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Full Name</label>
            <input value={form.name} onChange={set("name")} required placeholder="John Doe" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={form.email} onChange={set("email")} required placeholder="your@email.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={form.password} onChange={set("password")} required placeholder="Min. 6 characters" minLength={6} />
          </div>

          {form.role === "pharmacy" && (
            <>
              <hr style={{ margin: "16px 0", borderColor: "var(--border)" }} />
              <p className="text-muted mb-2">Pharmacy Details</p>
              <div className="form-group">
                <label>Pharmacy Name</label>
                <input value={form.pharmacyName} onChange={set("pharmacyName")} required={form.role === "pharmacy"} placeholder="City Pharmacy" />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input value={form.address} onChange={set("address")} required={form.role === "pharmacy"} placeholder="123 Main St, City" />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input value={form.phone} onChange={set("phone")} required={form.role === "pharmacy"} placeholder="+91 9999999999" />
              </div>
              <div className="flex gap-2 mb-2">
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Latitude</label>
                  <input value={form.latitude} onChange={set("latitude")} placeholder="17.3850" />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Longitude</label>
                  <input value={form.longitude} onChange={set("longitude")} placeholder="78.4867" />
                </div>
              </div>
              <button type="button" className="btn btn-outline" style={{ width: "100%", marginBottom: 16 }} onClick={getLocation}>
                📍 Use My Current Location
              </button>
            </>
          )}

          <button className="btn btn-primary w-full" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
