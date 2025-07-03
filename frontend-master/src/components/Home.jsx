"use client";
import { useNavigate } from "react-router-dom";
import { translations } from "../utils/translations";
import "./Home.css";

const Home = ({ currentLanguage }) => {
  const navigate = useNavigate();
  const t = translations?.[currentLanguage] ?? translations["en"];

  const handleGetStarted = () => {
    navigate("/about");
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="smart">Smart</span>
            <span className="farm">Farm</span>
            <span className="number"> 360</span>
          </h1>
          <p className="hero-subtitle">
            {t.heroSubtitle ?? "Transforming agriculture with intelligence and care."}
          </p>
          <button className="get-started-btn" onClick={handleGetStarted}>
            {t.getStarted ?? "Get Started"}
          </button>
        </div>

        <div className="hero-animation">
          <div className="floating-icon">🌾</div>
          <div className="floating-icon">🚜</div>
          <div className="floating-icon">🌱</div>
          <div className="floating-icon">💧</div>
        </div>
      </div>

      <div className="features-section">
        <h2>{t.whyChooseUs ?? "Why Choose Us?"}</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>{t.realTimeMonitoring ?? "Real-Time Monitoring"}</h3>
            <p>
              {t.monitoringDesc ??
                "Stay updated with instant data from drones, sensors, and satellites."}
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>{t.aiPowered ?? "AI-Powered Decisions"}</h3>
            <p>
              {t.aiDesc ??
                "Get smart suggestions on fertilizers, irrigation, and pest control."}
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>{t.easyToUse ?? "Easy to Use"}</h3>
            <p>
              {t.easyDesc ??
                "Simple, intuitive interface that works on any device for every farmer."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
