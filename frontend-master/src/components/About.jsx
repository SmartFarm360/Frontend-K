import { translations } from "../utils/translations";
import "./About.css";

const About = ({ currentLanguage }) => {
  const t = translations?.[currentLanguage] ?? translations["en"];

  return (
    
    <div className="about-container">
      {/* Top Section: Quotes + Hero Image */}
      <div className="about-hero">
        <div className="about-content">
          <h1>{t.aboutUs}</h1>
          <div className="inspiring-text">
            <p className="quote">"{t.inspiringQuote1 ?? "Empowering agriculture."}"</p>
            <p className="quote">"{t.inspiringQuote2 ?? "Technology meets tradition."}"</p>
            <p className="quote">"{t.inspiringQuote3 ?? "Farm smarter, not harder."}"</p>
          </div>
        </div>
        <div className="about-image">
          <img
            src="Farmer's Drone.jpg"
            alt="Farmers holding crops"
            className="farmer-image"
          />
        </div>
      </div>

      {/* New Product Info Section */}
      <div className="product-section">
        <div className="product-text">
          <h2>
            What is <span className="green-highlight">Smart Farm 360</span>?
          </h2>
          <p>
            <strong>Smart Farm 360</strong> is an AI-driven smart farming platform
            designed to empower farmers with real-time insights, crop health
            monitoring, and precision farming tools. It transforms data from drones,
            soil sensors, and satellite imagery into actionable guidance.
          </p>
          <p>
            The platform offers recommendations for fertilizers, pest control, and
            irrigation tailored to each farm’s unique conditions—reducing waste,
            improving yields, and supporting sustainable agriculture.
          </p>
          <p>
            <em>Smart Farm 360 isn’t just a tool—it’s your farm’s co-pilot.</em>
          </p>
        </div>
        <div className="product-image">
          <img src="/smartfarm_product.png" alt="Smart Farm Dashboard" />
        </div>
      </div>

      {/* Mission Section */}
      <div className="mission-section">
        <h2>{t.ourMission ?? "Our Mission"}</h2>
        <p>
          {t.missionDescription ??
            "To bring innovation and sustainability to every farm, big or small."}
        </p>
      </div>

      {/* Values Section */}
      <div className="values-section">
        <h2>{t.ourValues ?? "Our Core Values"}</h2>
        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon">🌱</div>
            <h3>{t.sustainability ?? "Sustainability"}</h3>
            <p>
              {t.sustainabilityDesc ??
                "We believe in farming practices that nurture the planet and the future."}
            </p>
          </div>
          <div className="value-card">
            <div className="value-icon">💡</div>
            <h3>{t.innovation ?? "Innovation"}</h3>
            <p>
              {t.innovationDesc ??
                "We bring cutting-edge tech to traditional farming challenges."}
            </p>
          </div>
          <div className="value-card">
            <div className="value-icon">🤝</div>
            <h3>{t.community ?? "Community"}</h3>
            <p>
              {t.communityDesc ??
                "We grow together—with our farmers, our team, and the planet."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
