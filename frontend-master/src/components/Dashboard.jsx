"use client"

import { useState, useEffect } from "react"
import "./Dashboard.css"

// You'll need to install lucide-react: npm install lucide-react
import { Thermometer, Droplets, Sprout, AlertTriangle, MapPin, Clock } from "lucide-react"

// Mock translations for demo - replace with your actual translations
const translations = {
  en: {
    dashboard: "Agricultural Dashboard",
    temperature: "Temperature",
    humidity: "Humidity",
    moisture: "Soil Moisture",
    high: "High",
    moderate: "Moderate",
    low: "Low",
    risk: "Risk",
    activeCases: "Active Cases",
    caseId: "Case ID",
    gridId: "Grid ID",
    problem: "Problem",
    recommendations: "Recommendations",
    gridLocation: "Grid Location",
  },
}

const Dashboard = ({ currentLanguage = "en", translatedText }) => {
  const [dashboardData, setDashboardData] = useState({
    temperature: 0,
    humidity: 0,
    moisture: 0,
    cases: [],
  })

  // Fallback to translations["en"] if translatedText is missing
  const fallbackText = translations[currentLanguage] || translations["en"]
  const t = new Proxy(translatedText || fallbackText, {
    get: (target, prop) => target[prop] || prop,
  })

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
      }
      setDashboardData(newData)
    }

    generateData()
    const interval = setInterval(generateData, 10000)
    return () => clearInterval(interval)
  }, [])

  const getRiskLevel = (value, type) => {
    if (type === "temperature") {
      if (value > 30) return "high"
      if (value < 25) return "low"
      return "moderate"
    }
    if (type === "humidity") {
      if (value > 70) return "high"
      if (value < 50) return "low"
      return "moderate"
    }
    if (type === "moisture") {
      if (value < 40) return "high"
      if (value > 70) return "low"
      return "moderate"
    }
  }

  const getMetricIcon = (type) => {
    switch (type) {
      case "temperature":
        return <Thermometer className="metric-icon" />
      case "humidity":
        return <Droplets className="metric-icon" />
      case "moisture":
        return <Sprout className="metric-icon" />
      default:
        return null
    }
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        {/* Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">{t.dashboard}</h1>
          <div className="title-underline"></div>
        </div>

        {/* Metrics Grid */}
        <div className="metrics-grid">
          {["temperature", "humidity", "moisture"].map((type) => {
            const value = dashboardData[type]
            const risk = getRiskLevel(value, type)
            const percentage = type === "temperature" ? (value / 40) * 100 : value

            return (
              <div key={type} className={`metric-card ${risk}-risk`}>
                <div className="card-background"></div>

                <div className="card-content">
                  {/* Header */}
                  <div className="metric-header">
                    <div className="metric-title-section">
                      <div className={`metric-icon-container ${risk}-gradient`}>{getMetricIcon(type)}</div>
                      <h3 className="metric-title">{t[type]}</h3>
                    </div>
                    <div className={`risk-badge ${risk}-gradient`}>{t[risk]}</div>
                  </div>

                  {/* Value */}
                  <div className="metric-value-section">
                    <span className="metric-value">{value}</span>
                    <span className="metric-unit">{type === "temperature" ? "°C" : "%"}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="progress-container">
                    <div className="progress-track">
                      <div
                        className={`progress-bar ${risk}-gradient`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                    <div className="progress-labels">
                      <span>0</span>
                      <span>{type === "temperature" ? "40°C" : "100%"}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Cases Section */}
        <div className="cases-section">
          <div className="section-header">
            <h2 className="section-title">{t.activeCases}</h2>
            <div className="section-underline"></div>
          </div>

          <div className="cases-grid">
            {dashboardData.cases.map((case_, index) => (
              <div key={index} className={`case-card ${case_.urgency}-risk`}>
                {/* Case Header */}
                <div className="case-header">
                  <div className="case-info">
                    <div className={`case-icon-container ${case_.urgency}-gradient`}>
                      <AlertTriangle className="case-icon" />
                    </div>
                    <div className="case-details">
                      <div className="case-id">
                        {t.caseId}: {case_.caseId}
                      </div>
                      <div className="case-timestamp">
                        <Clock className="timestamp-icon" />
                        Just now
                      </div>
                    </div>
                  </div>
                  <div className={`urgency-badge ${case_.urgency}-gradient`}>
                    {t[case_.urgency]} {t.risk}
                  </div>
                </div>

                {/* Case Details */}
                <div className="case-content">
                  <div className="case-grid-info">
                    <div className="info-item">
                      <p className="info-label">{t.gridId}</p>
                      <p className="info-value">{case_.gridId}</p>
                    </div>
                  </div>

                  <div className="problem-section">
                    <p className="problem-label">{t.problem}</p>
                    <p className="problem-value">{case_.problem}</p>
                  </div>

                  <div className="recommendations-section">
                    <p className="recommendations-label">{t.recommendations}</p>
                    <p className="recommendations-value">{case_.recommendations}</p>
                  </div>
                </div>

                {/* Location */}
                <div className="location-section">
                  <div className="location-content">
                    <MapPin className="location-icon" />
                    <span className="location-text">{t.gridLocation}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
