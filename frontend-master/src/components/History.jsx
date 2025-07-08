"use client"
import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { BarChart3, MapPin, Calendar, Clock, CheckCircle, AlertCircle, Loader } from "lucide-react"
import "./History.css"

// Mock translations for demo
const translations = {
  en: {
    history: "Farm History Dashboard",
    solved: "Solved",
    pending: "Pending",
    inProgress: "In Progress",
    gridId: "Grid ID",
    problem: "Problem",
    status: "Status",
    createdDate: "Date",
    pendingDays: "Pending Days",
    days: "days",
    gridVisualization: "Grid Visualization",
    recentActivity: "Recent Activity",
    farmLocation: "Farm Location",
  },
}

const redIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const History = ({ currentLanguage = "en" }) => {
  const [historyData, setHistoryData] = useState([])
  const [farmLocation, setFarmLocation] = useState(null)
  const [gridData, setGridData] = useState([])
  const t = translations?.[currentLanguage] || translations["en"]

  useEffect(() => {
    // Simulated API call for history data
    const statuses = ["solved", "pending", "in-progress"]
    const problems = ["Leaf Blight", "Pest Infestation", "Nutrient Deficiency", "Water Stress"]
    const data = Array.from({ length: 15 }, (_, index) => ({
      gridId: `GRID-${Math.floor(Math.random() * 100)}`,
      problem: problems[Math.floor(Math.random() * problems.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createdDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    }))
    setHistoryData(data)

    // Generate grid visualization data
    const grids = Array.from({ length: 64 }, (_, index) => ({
      id: `GRID-${index + 1}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      row: Math.floor(index / 8),
      col: index % 8,
    }))
    setGridData(grids)
  }, [])

  useEffect(() => {
    // Simulated farm location
    setFarmLocation({
      lat: 23.8103,
      lng: 90.4125,
      name: "Demo Farm Location",
    })
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case "solved":
        return "#10b981"
      case "pending":
        return "#ef4444"
      case "in-progress":
        return "#f59e0b"
      default:
        return "#6b7280"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "solved":
        return <CheckCircle className="status-icon" />
      case "pending":
        return <AlertCircle className="status-icon" />
      case "in-progress":
        return <Loader className="status-icon" />
      default:
        return <Clock className="status-icon" />
    }
  }

  const formatDate = (date) => {
    try {
      return new Date(date).toLocaleDateString("en-IN")
    } catch {
      return "N/A"
    }
  }

  const getPendingDays = (createdDate) => {
    const today = new Date()
    const diffTime = Math.abs(today - new Date(createdDate))
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const solvedCount = historyData.filter((item) => item.status === "solved").length
  const pendingCount = historyData.filter((item) => item.status === "pending").length
  const inProgressCount = historyData.filter((item) => item.status === "in-progress").length

  return (
    <div className="history-container">
      <div className="history-wrapper">
        {/* Header */}
        <div className="header-section">
          <h1 className="main-title">
            <BarChart3 className="title-icon" />
            {t?.history || "History"}
          </h1>
          <p className="subtitle">Monitor your farm's health and track issue resolution</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card solved-card">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">{t?.solved || "Solved"}</p>
                <p className="stat-number">{solvedCount}</p>
              </div>
              <div className="stat-icon-container solved-icon">
                <CheckCircle className="stat-icon" />
              </div>
            </div>
            <div className="stat-footer">
              <span className="stat-description">Issues resolved</span>
            </div>
          </div>

          <div className="stat-card pending-card">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">{t?.pending || "Pending"}</p>
                <p className="stat-number">{pendingCount}</p>
              </div>
              <div className="stat-icon-container pending-icon">
                <AlertCircle className="stat-icon" />
              </div>
            </div>
            <div className="stat-footer">
              <span className="stat-description">Needs attention</span>
            </div>
          </div>

          <div className="stat-card progress-card">
            <div className="stat-content">
              <div className="stat-info">
                <p className="stat-label">{t?.inProgress || "In Progress"}</p>
                <p className="stat-number">{inProgressCount}</p>
              </div>
              <div className="stat-icon-container progress-icon">
                <Loader className="stat-icon" />
              </div>
            </div>
            <div className="stat-footer">
              <span className="stat-description">Being worked on</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="main-content-grid">
          {/* Grid Visualization */}
          <div className="grid-section">
            <div className="content-card">
              <h3 className="section-title">
                <div className="title-indicator"></div>
                {t?.gridVisualization || "Grid Visualization"}
              </h3>
              <div className="grid-container">
                <div className="grid-visualization">
                  {gridData.map((grid) => (
                    <div key={grid.id} className={`grid-cell ${grid.status}`} title={`${grid.id} - ${grid.status}`} />
                  ))}
                </div>
              </div>
              <div className="grid-legend">
                <div className="legend-item">
                  <div className="legend-color solved"></div>
                  <span className="legend-text">Solved</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color in-progress"></div>
                  <span className="legend-text">In Progress</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color pending"></div>
                  <span className="legend-text">Pending</span>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="map-section">
            <div className="content-card">
              <h3 className="section-title">
                <MapPin className="section-icon" />
                {t?.farmLocation || "Farm Location"}
              </h3>
              <div className="map-wrapper">
                <MapContainer
                  center={farmLocation ? [farmLocation.lat, farmLocation.lng] : [23.8103, 90.4125]}
                  zoom={10}
                  scrollWheelZoom={true}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {farmLocation && (
                    <Marker position={[farmLocation.lat, farmLocation.lng]} icon={redIcon}>
                      <Popup>{farmLocation.name}</Popup>
                    </Marker>
                  )}
                </MapContainer>
              </div>
            </div>
          </div>
        </div>

        {/* History Table */}
        <div className="table-section">
          <div className="table-header">
            <h3 className="section-title">
              <Calendar className="section-icon" />
              {t?.recentActivity || "Recent Activity"}
            </h3>
          </div>

          <div className="table-container">
            <table className="history-table">
              <thead className="table-head">
                <tr>
                  <th className="table-header-cell">{t?.gridId || "Grid ID"}</th>
                  <th className="table-header-cell">{t?.problem || "Problem"}</th>
                  <th className="table-header-cell">{t?.status || "Status"}</th>
                  <th className="table-header-cell">{t?.createdDate || "Date"}</th>
                  <th className="table-header-cell">{t?.pendingDays || "Pending Days"}</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {historyData.map((item, index) => (
                  <tr key={index} className="table-row">
                    <td className="table-cell">
                      <div className="cell-content font-medium">{item.gridId}</div>
                    </td>
                    <td className="table-cell">
                      <div className="cell-content">{item.problem}</div>
                    </td>
                    <td className="table-cell">
                      <span
                        className={`status-badge ${item.status}`}
                        style={{
                          backgroundColor: `${getStatusColor(item.status)}20`,
                          color: getStatusColor(item.status),
                        }}
                      >
                        {getStatusIcon(item.status)}
                        {t?.[item.status] || item.status}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="cell-content secondary">{formatDate(item.createdDate)}</div>
                    </td>
                    <td className="table-cell">
                      <div className="cell-content secondary">
                        {item.status === "pending" || item.status === "in-progress"
                          ? `${getPendingDays(item.createdDate)} ${t?.days || "days"}`
                          : "-"}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default History
