import { useState } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { getNearbyMedicines } from "../utils/api";
import toast from "react-hot-toast";
import "./NearbyPage.css";

const MAP_STYLE = { width: "100%", height: "420px", borderRadius: 10 };

export default function NearbyPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userPos, setUserPos] = useState(null);
  const [selected, setSelected] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "",
  });

  const handleSearch = async () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      setUserPos({ lat: latitude, lng: longitude });
      setLoading(true);
      try {
        const { data } = await getNearbyMedicines({
          lat: latitude, lng: longitude, radius: 10000, q: query || undefined,
        });
        setResults(data);
        if (data.length === 0) toast("No medicines found nearby", { icon: "ℹ️" });
      } catch {
        toast.error("Failed to fetch nearby medicines");
      } finally {
        setLoading(false);
      }
    }, () => toast.error("Please allow location access"));
  };

  const pharmacyMarkers = results.reduce((acc, med) => {
    const id = med.pharmacy._id;
    if (!acc[id]) acc[id] = { ...med.pharmacy, medicines: [] };
    acc[id].medicines.push(med);
    return acc;
  }, {});

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Nearby Pharmacies</h1>

        <div className="card mb-2">
          <div className="nearby-search">
            <input
              className="search-input"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Filter by medicine (optional)..."
            />
            <button className="btn btn-primary" onClick={handleSearch} disabled={loading}>
              {loading ? "Locating..." : "📍 Search Near Me"}
            </button>
          </div>
        </div>

        {isLoaded && (
          <div className="map-wrapper">
            <GoogleMap
              mapContainerStyle={MAP_STYLE}
              center={userPos || { lat: 17.385, lng: 78.4867 }}
              zoom={userPos ? 13 : 11}
            >
              {userPos && (
                <Marker position={userPos} label="You" icon={{ url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }} />
              )}
              {Object.values(pharmacyMarkers).map((p) => {
                const [lng, lat] = p.location?.coordinates || [0, 0];
                if (!lat || !lng) return null;
                return (
                  <Marker key={p._id} position={{ lat, lng }} onClick={() => setSelected(p)}>
                    {selected?._id === p._id && (
                      <InfoWindow onCloseClick={() => setSelected(null)}>
                        <div className="info-window">
                          <strong>{p.pharmacyName}</strong>
                          <p>{p.address}</p>
                          <p>{p.phone}</p>
                          <p className="info-count">{p.medicines.length} medicine(s) available</p>
                        </div>
                      </InfoWindow>
                    )}
                  </Marker>
                );
              })}
            </GoogleMap>
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-3">
            <p className="text-muted mb-2">{results.length} medicines found at nearby pharmacies</p>
            <div className="grid-2">
              {Object.values(pharmacyMarkers).map(p => (
                <div key={p._id} className="card pharmacy-result">
                  <h3>🏥 {p.pharmacyName}</h3>
                  <p className="text-muted">{p.address} · {p.phone}</p>
                  <ul className="medicine-list">
                    {p.medicines.map(m => (
                      <li key={m._id}>
                        <span>{m.name}</span>
                        <span className="med-stock">{m.stock} units · ₹{m.price}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
