import { useState } from "react";
import { searchMedicines } from "../utils/api";
import MedicineCard from "../components/Medicine/MedicineCard";
import toast from "react-hot-toast";
import "./SearchPage.css";

const CATEGORIES = ["All", "Tablet", "Capsule", "Syrup", "Injection", "Cream", "Drops", "Inhaler", "Other"];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim() && category === "All") return toast.error("Enter a medicine name to search");
    setLoading(true);
    try {
      const params = {};
      if (query.trim()) params.q = query.trim();
      if (category !== "All") params.category = category;
      params.available = "true";
      const { data } = await searchMedicines(params);
      setResults(data);
      setSearched(true);
    } catch {
      toast.error("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Find Medicines</h1>
        <div className="card search-card">
          <form onSubmit={handleSearch} className="search-form">
            <input
              className="search-input"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by medicine name (e.g. Paracetamol, Insulin)..."
            />
            <select value={category} onChange={e => setCategory(e.target.value)} className="category-select">
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Searching..." : "🔍 Search"}
            </button>
          </form>
        </div>

        {searched && (
          <div className="mt-3">
            <p className="text-muted mb-2">
              {results.length === 0 ? "No medicines found." : `${results.length} result(s) found`}
            </p>
            <div className="grid-2">
              {results.map(med => <MedicineCard key={med._id} medicine={med} />)}
            </div>
          </div>
        )}

        {!searched && (
          <div className="empty-state">
            <div className="empty-icon">💊</div>
            <h3>Search for rare medicines</h3>
            <p>Find which pharmacies near you have the medicines you need.</p>
          </div>
        )}
      </div>
    </div>
  );
}
