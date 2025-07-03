"use client";

import { useState, useEffect } from "react";
import "./Dashboard.css";
import { translations } from "../utils/translations"; // ✅ Needed if fallback is used

const Dashboard = ({ currentLanguage = "en", translatedText }) => {
  const [dashboardData, setDashboardData] = useState({
    temperature: 0,
    humidity: 0,
    moisture: 0,
    cases: [],
  });

  // ✅ Fallback to translations["en"] if translatedText is missing
  const fallbackText = translations[currentLanguage] || translations["en"];

  const t = new Proxy(translatedText || fallbackText, {
    get: (target, prop) => target[prop] || prop,
  });

  useEffect(() => {
    const generateData = () => {
      const newData = {
        temperature: Math.floor(Math.random() * 15) + 20,
        humidity: Math.floor(Math.random() * 40) + 40,
        moisture: Math.floor(Math.random() * 50) + 30,
        cases: [
          {
            caseId: `CASE-${Math.floor(Math.random() * 10000)}`,
            gridId: `GRID-${Math.floor(Math.random() * 100)}`,
            urgency: Math.random() > 0.7 ? "high" : Math.random() > 0.4 ? "moderate" : "low",
            problem: "Leaf Blight Detected",
            recommendations: "Apply fungicide spray, improve drainage",
            location: { lat: 12.9716, lng: 77.5946 },
          },
          {
            caseId: `CASE-${Math.floor(Math.random() * 10000)}`,
            gridId: `GRID-${Math.floor(Math.random() * 100)}`,
            urgency: Math.random() > 0.7 ? "high" : Math.random() > 0.4 ? "moderate" : "low",
            problem: "Pest Infestation",
            recommendations: "Use organic pesticide, monitor closely",
            location: { lat: 12.9716, lng: 77.5946 },
          },
        ],
      };
      setDashboardData(newData);
    };

    generateData();
    const interval = setInterval(generateData, 10000);
    return () => clearInterval(interval);
  }, []);

  const getRiskLevel = (value, type) => {
    if (type === "temperature") {
      if (value > 30) return "high";
      if (value < 25) return "low";
      return "moderate";
    }
    if (type === "humidity") {
      if (value > 70) return "high";
      if (value < 50) return "low";
      return "moderate";
    }
    if (type === "moisture") {
      if (value < 40) return "high";
      if (value > 70) return "low";
      return "moderate";
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case "high":
        return "#ff4757";
      case "moderate":
        return "#ffa502";
      case "low":
        return "#2ed573";
      default:
        return "#747d8c";
    }
  };

  return (
    <div className="dashboard-container">
      <h1>{t.dashboard}</h1>

      <div className="metrics-grid">
        {["temperature", "humidity", "moisture"].map((type) => {
          const value = dashboardData[type];
          const risk = getRiskLevel(value, type);
          return (
            <div className="metric-card" key={type}>
              <div className="metric-header">
                <h3>{t[type]}</h3>
                <div
                  className={`risk-indicator ${risk}`}
                  style={{ backgroundColor: getRiskColor(risk) }}
                >
                  {t[risk]}
                </div>
              </div>
              <div className="metric-value">
                <span className="value">{value}</span>
                <span className="unit">{type === "temperature" ? "°C" : "%"}</span>
              </div>
              <div className="metric-chart">
                <div
                  className="chart-bar"
                  style={{
                    width: `${type === "temperature" ? (value / 40) * 100 : value}%`,
                    backgroundColor: getRiskColor(risk),
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="cases-section">
        <h2>{t.activeCases}</h2>
        <div className="cases-grid">
          {dashboardData.cases.map((case_, index) => (
            <div key={index} className="case-card">
              <div className="case-header">
                <div className="case-id">
                  {t.caseId}: {case_.caseId}
                </div>
                <div
                  className={`urgency-badge ${case_.urgency}`}
                  style={{ backgroundColor: getRiskColor(case_.urgency) }}
                >
                  {t[case_.urgency]} {t.risk}
                </div>
              </div>
              <div className="case-details">
                <p>
                  <strong>{t.gridId}:</strong> {case_.gridId}
                </p>
                <p>
                  <strong>{t.problem}:</strong> {case_.problem}
                </p>
                <p>
                  <strong>{t.recommendations}:</strong> {case_.recommendations}
                </p>
              </div>
              <div className="case-map">
                <div className="map-placeholder">🗺️ {t.gridLocation}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
