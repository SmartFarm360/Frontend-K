"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { translations } from "../utils/translations";
import "./Register.css";

const Register = ({ currentLanguage, onRegister }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    role: "",
    farm_location: "",
    land_size: "",
    crop_type: "",
    experience: "",
    license_id: "",
    base_location: "",
    available_drones: "",
    flight_experience: "",
  });

  const [landDocument, setLandDocument] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Fallback to "en" if currentLanguage is undefined
  const t = translations[currentLanguage] || translations["en"];

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  

  const validateForm = () => {
    const validationErrors = {};
    if (!formData.firstName?.trim()) validationErrors.firstName = t.requiredField || "This field is required.";
    if (!formData.email.includes("@")) validationErrors.email = t.invalidEmail || "Invalid email format.";
    if (!formData.mobile?.trim()) validationErrors.mobile = t.requiredField || "This field is required.";
    if (formData.password.length < 8) validationErrors.password = t.passwordError || "Password must be at least 8 characters.";
    if (formData.password !== formData.confirmPassword) validationErrors.confirmPassword = t.passwordMismatch || "Passwords do not match.";
    if (formData.role === "farmer" && !landDocument) validationErrors.landDocument = "Land document is required.";

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const submissionData = new FormData();
      submissionData.append("name", formData.firstName);
      submissionData.append("email", formData.email);
      submissionData.append("mobile", formData.mobile);
      submissionData.append("password", formData.password);
      submissionData.append("confirmPassword", formData.confirmPassword);
      submissionData.append("role", formData.role);

      if (formData.role === "farmer") {
        submissionData.append("landSize", formData.land_size);
        submissionData.append("location", formData.farm_location);
        submissionData.append("experience", formData.experience);
        submissionData.append("cropType", formData.crop_type);
        submissionData.append("landDocument", landDocument);
      } else if (formData.role === "drone controller") {
        submissionData.append("licenseId", formData.license_id);
        submissionData.append("baseLocation", formData.base_location);
        submissionData.append("availableDrones", formData.available_drones);
        submissionData.append("flightExperience", formData.flight_experience);
      }

      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        body: submissionData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      alert("Registration successful!");
      navigate("/login");
    } catch (registerError) {
      console.error("Registration error:", registerError);
      setErrors({ submit: registerError.message || "Registration failed. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderRoleFields = () => {
    switch (formData.role) {
      case "farmer":
        return (
          <>
            <div className="form-group">
              <label>{t.farmLocation || "Farm Location"}</label>
              <input type="text" name="farm_location" value={formData.farm_location} onChange={handleChange} required placeholder="Enter Farm Location" />
            </div>
            <div className="form-group">
              <label>{t.landSize || "Land Size"}</label>
              <input type="text" name="land_size" value={formData.land_size} onChange={handleChange} required placeholder="Enter Land Size" />
            </div>
            <div className="form-group">
              <label>{t.cropType || "Crop Type"}</label>
              <input type="text" name="crop_type" value={formData.crop_type} onChange={handleChange} required placeholder="Enter Crop Type" />
            </div>
            <div className="form-group">
              <label>{t.experienceYears || "Experience (Years)"}</label>
              <input type="number" name="experience" value={formData.experience} onChange={handleChange} placeholder="Enter Experience in Years" />
            </div>
            <div className="form-group">
              <label>Land Document (PDF or Image)</label>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setLandDocument(e.target.files[0])} required />
              {errors.landDocument && <span className="error">{errors.landDocument}</span>}
            </div>
          </>
        );

      case "drone controller":
        return (
          <>
            <div className="form-group">
              <label>{t.licenseId || "License ID"}</label>
              <input type="text" name="license_id" value={formData.license_id} onChange={handleChange} required placeholder="Enter License ID" />
            </div>
            <div className="form-group">
              <label>{t.baseLocation || "Base Location"}</label>
              <input type="text" name="base_location" value={formData.base_location} onChange={handleChange} required placeholder="Enter Base Location" />
            </div>
            <div className="form-group">
              <label>{t.availableDrones || "Available Drones"}</label>
              <input type="number" name="available_drones" value={formData.available_drones} onChange={handleChange} required placeholder="Enter Number of Available Drones" />
            </div>
            <div className="form-group">
              <label>{t.flightExperienceYears || "Flight Experience (Years)"}</label>
              <input type="number" name="flight_experience" value={formData.flight_experience} onChange={handleChange} placeholder="Enter Flight Experience in Years" />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <div className="logo-section">
            <div className="logo">🌱</div>
            <h1>Smart Farm 360</h1>
          </div>
          <p className="tagline">{t.registerTagline || "Create your account"}</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="firstName">{t.firstName || "First Name"}</label>
            <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} placeholder={t.enterFirstName || "Enter First Name"} required />
            {errors.firstName && <span className="error">{errors.firstName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">{t.email || "Email"}</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder={t.enterEmail || "Enter Email"} required />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="mobile">{t.mobile || "Mobile Number"}</label>
            <input type="tel" id="mobile" name="mobile" value={formData.mobile} onChange={handleChange} placeholder={t.enterMobile || "Enter Mobile Number"} required />
            {errors.mobile && <span className="error">{errors.mobile}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">{t.createPassword || "Create Password"}</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} placeholder={t.enterPassword || "Enter Password"} required />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">{t.confirmPassword || "Confirm Password"}</label>
            <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder={t.reEnterPassword || "Re-enter Password"} required />
            {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
          </div>

          <div className="form-group">
            <label>{t.role || "Role"}</label>
            <select name="role" value={formData.role} onChange={handleChange} required>
              <option value="farmer">{t.farmer || "Farmer"}</option>
              <option value="admin">{t.admin || "Admin"}</option>
              <option value="drone controller">{t.droneController || "Drone Controller"}</option>
            </select>
          </div>

          {renderRoleFields()}

          {errors.submit && <span className="error">{errors.submit}</span>}

          <button type="submit" className="register-btn" disabled={isSubmitting}>
            {isSubmitting ? t.registering || "Registering..." : t.register || "Register"}
          </button>
        </form>

        <div className="register-footer">
          <p>
            {t.haveAccount || "Already have an account?"}{" "}
            <Link to="/login" className="login-link">
              {t.login || "Login"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
