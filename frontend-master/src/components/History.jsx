"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { translations } from "../utils/translations";
import "./History.css";

const History = ({ currentLanguage }) => {
  const [historyData, setHistoryData] = useState([]);
  const t = translations?.[currentLanguage] || translations["en"];

  useEffect(() => {
    const statuses = ["solved", "pending", "in-progress"];
    const problems = [
      "Leaf Blight",
      "Pest Infestation",
      "Nutrient Deficiency",
      "Water Stress",
    ];

    const data = Array.from({ length: 15 }, (_, index) => ({
      gridId: `GRID-${Math.floor(Math.random() * 100)}`,
      problem: problems[Math.floor(Math.random() * problems.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createdDate: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ),
    }));

    setHistoryData(data);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "solved":
        return "#2ed573";
      case "pending":
        return "#ff4757";
      case "in-progress":
        return "#ffa502";
      default:
        return "#747d8c";
    }
  };

  const formatDate = (date) => {
    try {
      return date.toLocaleDateString("en-IN");
    } catch {
      return "N/A";
    }
  };

  const getPendingDays = (createdDate) => {
    const today = new Date();
    const diffTime = Math.abs(today - new Date(createdDate));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="history-container">
      <h1>{t?.history || "History"}</h1>

      {/* === Stats & Map Section === */}
      <div className="top-section">
        {/* === Status Cards === */}
        <div className="history-stats-vertical">
          <div className="stat-card" id="solved">
            <div className="stat-number">
              {historyData.filter((item) => item.status === "solved").length}
            </div>
            <div className="stat-label">{t?.solved || "Solved"}</div>
          </div>
          <div className="stat-card" id="pending">
            <div className="stat-number">
              {historyData.filter((item) => item.status === "pending").length}
            </div>
            <div className="stat-label">{t?.pending || "Pending"}</div>
          </div>
          <div className="stat-card" id="in-progress">
            <div className="stat-number">
              {historyData.filter((item) => item.status === "in-progress").length}
            </div>
            <div className="stat-label">{t?.inProgress || "In Progress"}</div>
          </div>
        </div>

        {/* === Simple Map === */}
        <div className="map-placeholder">
          <MapContainer
            center={[23.8103, 90.4125]} // You can set this to your farm's location
            zoom={10}
            style={{ height: "300px", width: "100%", borderRadius: "12px" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
          </MapContainer>
        </div>
      </div>

      {/* === History Table === */}
      <div className="history-table">
        <div className="table-header">
          <div className="table-cell">{t?.gridId || "Grid ID"}</div>
          <div className="table-cell">{t?.problem || "Problem"}</div>
          <div className="table-cell">{t?.status || "Status"}</div>
          <div className="table-cell">{t?.createdDate || "Date"}</div>
          <div className="table-cell">{t?.pendingDays || "Pending (Days)"}</div>
        </div>

        {historyData.map((item, index) => (
          <div key={index} className="table-row">
            <div className="table-cell">{item.gridId}</div>
            <div className="table-cell">{item.problem}</div>
            <div className="table-cell">
              <span
                className="status-badge"
                style={{ backgroundColor: getStatusColor(item.status) }}
              >
                {t?.[item.status] || item.status}
              </span>
            </div>
            <div className="table-cell">{formatDate(item.createdDate)}</div>
            <div className="table-cell">
              {item.status === "pending" || item.status === "in-progress"
                ? `${getPendingDays(item.createdDate)} ${t?.days || "days"}`
                : "-"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
