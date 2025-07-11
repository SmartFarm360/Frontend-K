"use client"
import { useNavigate } from "react-router-dom"
import { translations } from "../utils/translations"
import "./Home.css"
import drone2 from "/src/assets/drone2.jpg"

const Home = ({ currentLanguage }) => {
  const navigate = useNavigate()
  const t = translations?.[currentLanguage] ?? translations["en"]

  const handleGetStarted = () => {
    navigate("/about")
  }

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-background-elements">
          <div className="floating-element element-1"></div>
          <div className="floating-element element-2"></div>
          <div className="floating-element element-3"></div>
        </div>

        <div className="hero-content">
          {/* <div className="hero-badge">
            <span className="badge-icon">🌱</span>
            <span className="badge-text">Next Generation Farming</span>
          </div> */}

          <h1 className="hero-title">
            <span className="smart">Smart</span>
            <span className="farm">Farm</span>
            <span className="number"> 360</span>
          </h1>

          <p className="hero-subtitle">{t.heroSubtitle ?? "Transforming agriculture with intelligence and care."}</p>
{/* 
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Farms Connected</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">98%</span>
              <span className="stat-label">Success Rate</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Monitoring</span>
            </div>
          </div> */}

          <div className="hero-actions">
            <button className="get-started-btn primary" onClick={handleGetStarted}>
              <span className="btn-text">{t.getStarted ?? "Get Started"}</span>
              <span className="btn-icon">→</span>
            </button>
            <button className="get-started-btn secondary">
              <span className="btn-icon">▶</span>
              <span className="btn-text">Watch Demo</span>
            </button>
          </div>
        </div>

        <div className="hero-image-container">
          <div className="image-decoration">
            <div className="decoration-circle circle-1"></div>
            <div className="decoration-circle circle-2"></div>
            <div className="decoration-circle circle-3"></div>
          </div>
          <div className="image-wrapper">
            <img src={drone2 || "/placeholder.svg"} alt="Smart farming illustration" className="hero-image" />
            <div className="image-overlay">
              {/* <div className="overlay-card">
                <div className="overlay-icon">📊</div>
                <div className="overlay-content">
                  <span className="overlay-title">Live Data</span>
                  <span className="overlay-subtitle">Real-time monitoring</span>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="features-header">
          <div className="section-badge">
            <span className="badge-icon">✨</span>
            <span className="badge-text">Our Features</span>
          </div>
          <h2 className="features-title">{t.whyChooseUs ?? "Why Choose Us?"}</h2>
          <p className="features-subtitle">
            Discover the powerful features that make Smart Farm 360 the perfect choice for modern agriculture
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-card-inner">
              <div className="feature-header">
                <div className="feature-icon-container">
                  <div className="feature-icon">📊</div>
                  <div className="icon-glow"></div>
                </div>
                <h3 className="feature-title">{t.realTimeMonitoring ?? "Real-Time Monitoring"}</h3>
              </div>
              <p className="feature-description">
                {t.monitoringDesc ?? "Stay updated with instant data from drones, sensors, and satellites."}
              </p>
              <div className="feature-footer">
                <span className="feature-link">Learn More →</span>
              </div>
            </div>
            <div className="card-glow"></div>
          </div>

          <div className="feature-card featured">
            <div className="featured-badge">
              <span>Most Popular</span>
            </div>
            <div className="feature-card-inner">
              <div className="feature-header">
                <div className="feature-icon-container">
                  <div className="feature-icon">🤖</div>
                  <div className="icon-glow"></div>
                </div>
                <h3 className="feature-title">{t.aiPowered ?? "AI-Powered Decisions"}</h3>
              </div>
              <p className="feature-description">
                {t.aiDesc ?? "Get smart suggestions on fertilizers, irrigation, and pest control."}
              </p>
              <div className="feature-footer">
                <span className="feature-link">Learn More →</span>
              </div>
            </div>
            <div className="card-glow featured-glow"></div>
          </div>

          <div className="feature-card">
            <div className="feature-card-inner">
              <div className="feature-header">
                <div className="feature-icon-container">
                  <div className="feature-icon">📱</div>
                  <div className="icon-glow"></div>
                </div>
                <h3 className="feature-title">{t.easyToUse ?? "Easy to Use"}</h3>
              </div>
              <p className="feature-description">
                {t.easyDesc ?? "Simple, intuitive interface that works on any device for every farmer."}
              </p>
              <div className="feature-footer">
                <span className="feature-link">Learn More →</span>
              </div>
            </div>
            <div className="card-glow"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
