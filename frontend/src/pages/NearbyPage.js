import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getNearbyMedicines } from "../utils/api";
import toast from "react-hot-toast";
import "./NearbyPage.css";

// Fix leaflet default marker icon bug in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const userIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function NearbyPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userPos, setUserPos] = useState(null);

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

  const defaultCenter = [17.385, 78.4867];

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

        <div className="map-wrapper">
          <MapContainer
            center={userPos ? [userPos.lat, userPos.lng] : defaultCenter}
            zoom={userPos ? 13 : 11}
            style={{ width: "100%", height: "420px" }}
            key={userPos ? `${userPos.lat}-${userPos.lng}` : "default"}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {userPos && (
              <>
                <Marker position={[userPos.lat, userPos.lng]} icon={userIcon}>
                  <Popup>You are here</Popup>
                </Marker>
                <Circle
                  center={[userPos.lat, userPos.lng]}
                  radius={10000}
                  pathOptions={{ color: "#1a73e8", fillColor: "#1a73e8", fillOpacity: 0.05 }}
                />
              </>
            )}

            {Object.values(pharmacyMarkers).map((p) => {
              const [lng, lat] = p.location?.coordinates || [0, 0];
              if (!lat || !lng) return null;
              return (
                <Marker key={p._id} position={[lat, lng]}>
                  <Popup>
                    <div className="info-window">
                      <strong>{p.pharmacyName}</strong>
                      <p>{p.address}</p>
                      <p>{p.phone}</p>
                      <p className="info-count">{p.medicines.length} medicine(s) available</p>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

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
