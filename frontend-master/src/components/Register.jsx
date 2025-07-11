"use client"
import { useState, useCallback } from "react"
import { Link, useNavigate } from "react-router-dom"
import { translations } from "../utils/translations"
import "./Register.css"

const Register = ({ currentLanguage, onRegister }) => {
  const [formData, setFormData] = useState({
    firstName: "",
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
    employeeId: "",
    adminArea: "",
    accessLevel: "",
  })
  const [locationSuggestions, setLocationSuggestions] = useState([])
  const [landDocument, setLandDocument] = useState(null)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // OTP related states
  const [showOtpSection, setShowOtpSection] = useState(false)
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isOtpVerified, setIsOtpVerified] = useState(false)
  const [isGeneratingOtp, setIsGeneratingOtp] = useState(false)
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)
  const [otpTimer, setOtpTimer] = useState(0)

  // Success modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const t = translations[currentLanguage] || translations["en"]
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    // Prevent email changes if OTP section is shown or verified
    if (name === "email" && (showOtpSection || isOtpVerified)) {
      return
    }
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Reset OTP verification if email changes
    if (name === "email") {
      setIsOtpVerified(false)
      setShowOtpSection(false)
      setOtp(["", "", "", "", "", ""])
      setErrors((prev) => ({ ...prev, email: null, otp: null }))
    }

    if (name === "farm_location" && value.length >= 3) {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}`)
        .then((res) => res.json())
        .then((data) => {
          setLocationSuggestions(data.slice(0, 5))
        })
        .catch((err) => console.error("Location fetch error:", err))
    } else if (name === "farm_location" && value.length < 3) {
      setLocationSuggestions([])
    }
  }

  const handleLocationSelect = (location) => {
    setFormData((prev) => ({
      ...prev,
      farm_location: location.display_name,
      latitude: location.lat,
      longitude: location.lon,
    }))
    setLocationSuggestions([])
  }

  // Debounced Generate OTP
  const generateOtp = useCallback(async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const trimmedEmail = formData.email.trim()
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setErrors({ email: t.invalidEmail || "Please enter a valid email address." })
      return
    }

    setIsGeneratingOtp(true)
    try {
      console.log("Email before OTP request:", formData.email, "Trimmed:", trimmedEmail)
      const response = await fetch("http://localhost:5000/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      })

      const data = await response.json()
      console.log("Generate OTP response:", data)
      if (!response.ok) {
        throw new Error(data.message || "Failed to generate OTP")
      }

      setShowOtpSection(true)
      setOtpTimer(600) // 10 minutes to match backend

      // Start countdown timer
      const timer = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)

    } catch (error) {
      console.error("OTP generation error:", error.message)
      setErrors({ otp: error.message || "Failed to generate OTP. Please try again." })
    } finally {
      setIsGeneratingOtp(false)
    }
  }, [formData.email, t])

  // Handle OTP input
  const handleOtpChange = (index, value) => {
    if (value.length > 1 || !/^[0-9]*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
  }

  // Handle OTP backspace
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }

  // Verify OTP
  const verifyOtp = async () => {
    const enteredOtp = otp.join("")
    if (enteredOtp.length !== 6) {
      setErrors({ otp: "Please enter a complete 6-digit OTP" })
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const trimmedEmail = formData.email.trim()
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setErrors({ email: t.invalidEmail || "Please enter a valid email address." })
      return
    }

    setIsVerifyingOtp(true)
    try {
      console.log("Sending OTP verification request:", { email: trimmedEmail, otp: enteredOtp })
      const response = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, otp: enteredOtp }),
      })

      const data = await response.json()
      console.log("Verify OTP response:", data)
      if (!response.ok) {
        throw new Error(data.message || "Invalid OTP")
      }

      setIsOtpVerified(true)
      setShowOtpSection(false) // Hide OTP section after verification
      setErrors({})
    } catch (error) {
      console.error("OTP verification error:", error.message)
      setErrors({ otp: error.message || "Invalid OTP. Please try again." })
    } finally {
      setIsVerifyingOtp(false)
    }
  }

  const validateForm = () => {
    const validationErrors = {}
    if (!formData.firstName?.trim()) validationErrors.firstName = t.requiredField || "This field is required."
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()))
      validationErrors.email = t.invalidEmail || "Invalid email format."
    if (!isOtpVerified) validationErrors.otp = "Please verify your email with OTP first."
    if (!formData.mobile?.trim()) validationErrors.mobile = t.requiredField || "This field is required."
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/.test(formData.password))
      validationErrors.password = t.passwordError || "Password must include uppercase, lowercase, number, and special character."
    if (formData.password !== formData.confirmPassword)
      validationErrors.confirmPassword = t.passwordMismatch || "Passwords do not match."
    if (formData.role === "farmer" && !landDocument) validationErrors.landDocument = "Land document is required."
    if (formData.role === "admin" && (!formData.employeeId || !formData.adminArea || !formData.accessLevel))
      validationErrors.adminFields = "All admin fields are required."
    return Object.keys(validationErrors).length === 0 ? (setErrors({}), true) : (setErrors(validationErrors), false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    const trimmedEmail = formData.email.trim()
    if (!trimmedEmail) {
      setErrors({ email: "Email cannot be empty." })
      return
    }

    setIsSubmitting(true)
    try {
      const submissionData = new FormData()
      submissionData.append("name", formData.firstName)
      submissionData.append("email", trimmedEmail)
      submissionData.append("mobile", formData.mobile)
      submissionData.append("password", formData.password)
      submissionData.append("confirmPassword", formData.confirmPassword)
      submissionData.append("role", formData.role)

      if (formData.role === "farmer") {
        submissionData.append("landSize", formData.land_size)
        submissionData.append("location", formData.farm_location)
        submissionData.append("latitude", formData.latitude || "")
        submissionData.append("longitude", formData.longitude || "")
        submissionData.append("experience", formData.experience)
        submissionData.append("cropType", formData.crop_type)
        submissionData.append("landDocument", landDocument)
      } else if (formData.role === "drone controller") {
        submissionData.append("licenseId", formData.license_id)
        submissionData.append("baseLocation", formData.base_location)
        submissionData.append("availableDrones", formData.available_drones)
        submissionData.append("flightExperience", formData.flight_experience)
      } else if (formData.role === "admin") {
        submissionData.append("employeeId", formData.employeeId)
        submissionData.append("adminArea", formData.adminArea)
        submissionData.append("accessLevel", formData.accessLevel)
      }

      // Log FormData contents
      const formDataEntries = Object.fromEntries(submissionData)
      console.log("FormData before submission:", formDataEntries)

      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        body: submissionData,
      })

      const data = await response.json()
      console.log("Registration response:", data)
      if (!response.ok) {
        throw new Error(data.message || "Registration failed")
      }

      setShowSuccessModal(true)

      setTimeout(() => {
        setShowSuccessModal(false)
        navigate("/login")
      }, 3000)
    } catch (registerError) {
      console.error("Registration error:", registerError.message)
      setErrors({ submit: registerError.message || "Registration failed. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const renderRoleFields = () => {
    if (!formData.role) return null
    switch (formData.role) {
      case "farmer":
        return (
          <div className="role-section">
            <div className="role-header">
              <div className="role-icon farmer-icon">🌱</div>
              <h3 className="role-title">Farmer Details</h3>
            </div>
            <div className="form-group location-group">
              <label className="form-label">
                <span className="label-icon">📍</span>
                {t.farmLocation || "Farm Location"}
              </label>
              <input
                type="text"
                name="farm_location"
                value={formData.farm_location}
                onChange={handleChange}
                placeholder="Start typing farm location..."
                autoComplete="off"
                className="form-input"
              />
              {locationSuggestions.length > 0 && (
                <ul className="location-dropdown">
                  {locationSuggestions.map((location, index) => (
                    <li key={index} onClick={() => handleLocationSelect(location)}>
                      {location.display_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{t.landSize || "Land Size"}</label>
                <input
                  type="text"
                  name="land_size"
                  value={formData.land_size}
                  onChange={handleChange}
                  placeholder="e.g., 5 acres"
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">{t.cropType || "Crop Type"}</label>
                <input
                  type="text"
                  name="crop_type"
                  value={formData.crop_type}
                  onChange={handleChange}
                  placeholder="e.g., Rice, Wheat"
                  className="form-input"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">{t.experienceYears || "Experience (Years)"}</label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Years of farming experience"
                className="form-input"
                min="0"
              />
            </div>
            <div className="form-group file-group">
              <label className="form-label">
                <span className="label-icon">📄</span>
                Land Document (PDF or Image)
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setLandDocument(e.target.files[0])}
                className="file-input"
                required
              />
              {errors.landDocument && <span className="error">{errors.landDocument}</span>}
            </div>
          </div>
        )
      case "drone controller":
        return (
          <div className="role-section">
            <div className="role-header">
              <div className="role-icon drone-icon">🚁</div>
              <h3 className="role-title">Drone Controller Details</h3>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{t.licenseId || "License ID"}</label>
                <input
                  type="text"
                  name="license_id"
                  value={formData.license_id}
                  onChange={handleChange}
                  placeholder="Enter License ID"
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">{t.baseLocation || "Base Location"}</label>
                <input
                  type="text"
                  name="base_location"
                  value={formData.base_location}
                  onChange={handleChange}
                  placeholder="Enter Base Location"
                  className="form-input"
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{t.availableDrones || "Available Drones"}</label>
                <input
                  type="number"
                  name="available_drones"
                  value={formData.available_drones}
                  onChange={handleChange}
                  placeholder="Number of drones"
                  className="form-input"
                  min="1"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">{t.flightExperienceYears || "Flight Experience (Years)"}</label>
                <input
                  type="number"
                  name="flight_experience"
                  value={formData.flight_experience}
                  onChange={handleChange}
                  placeholder="Years of experience"
                  className="form-input"
                  min="0"
                />
              </div>
            </div>
          </div>
        )
      case "admin":
        return (
          <div className="role-section">
            <div className="role-header">
              <div className="role-icon admin-icon">🛡️</div>
              <h3 className="role-title">Admin Access</h3>
            </div>
            <div className="form-group">
              <label className="form-label">{t.employeeId || "Employee ID"}</label>
              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                placeholder="Enter Employee ID"
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">{t.adminArea || "Admin Area"}</label>
              <input
                type="text"
                name="adminArea"
                value={formData.adminArea}
                onChange={handleChange}
                placeholder="Enter Admin Area"
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">{t.accessLevel || "Access Level"}</label>
              <input
                type="text"
                name="accessLevel"
                value={formData.accessLevel}
                onChange={handleChange}
                placeholder="Enter Access Level"
                className="form-input"
                required
              />
            </div>
            <div className="admin-note">
              <p>Admin privileges will be granted after verification.</p>
            </div>
            {errors.adminFields && <span className="error">{errors.adminFields}</span>}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <div className="logo-section">
            <div className="logo">🌱</div>
            <h1>Smart Farm 360</h1>
          </div>
          <p className="tagline">
            {t.registerTagline || "Join Smart Farm 360 and revolutionize your farming experience"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {/* Basic Information Section */}
          <div className="form-section">
            <h3 className="section-title">
              <span className="section-icon">👤</span>
              Basic Information
            </h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName" className="form-label">
                  <span className="label-icon">👤</span>
                  {t.firstName || "First Name"}
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder={t.enterFirstName || "Enter First Name"}
                  className={`form-input ${errors.firstName ? "error-input" : ""}`}
                  required
                />
                {errors.firstName && <span className="error">{errors.firstName}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  <span className="label-icon">📧</span>
                  {t.email || "Email"}
                </label>
                <div className="email-input-group">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t.enterEmail || "Enter Email"}
                    className={`form-input ${errors.email ? "error-input" : ""} ${isOtpVerified ? "verified-input" : ""}`}
                    required
                  />
                  {!isOtpVerified && !showOtpSection && formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()) && (
                    <button type="button" onClick={generateOtp} disabled={isGeneratingOtp} className="generate-otp-btn">
                      {isGeneratingOtp ? (
                        <>
                          <span className="loading-spinner-small"></span>
                          Sending...
                        </>
                      ) : (
                        <>
                          <span className="otp-icon">🔐</span>
                          Generate OTP
                        </>
                      )}
                    </button>
                  )}
                  {isOtpVerified && (
                    <div className="verified-badge">
                      <span className="verified-icon">✅</span>
                      Verified
                    </div>
                  )}
                </div>
                {errors.email && <span className="error">{errors.email}</span>}
              </div>
            </div>

            {/* OTP Verification Section */}
            {showOtpSection && !isOtpVerified && (
              <div className="otp-section">
                <div className="otp-header">
                  <div className="otp-icon-container">
                    <span className="otp-main-icon">📧</span>
                  </div>
                  <div className="otp-info">
                    <h4 className="otp-title">Verify Your Email</h4>
                    <p className="otp-description">
                      We've sent a 6-digit code to <strong>{formData.email}</strong>
                    </p>
                  </div>
                </div>

                <div className="otp-input-container">
                  <div className="otp-inputs">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className={`otp-input ${errors.otp ? "error-input" : ""}`}
                        placeholder="0"
                      />
                    ))}
                  </div>

                  <div className="otp-actions">
                    <button
                      type="button"
                      onClick={verifyOtp}
                      disabled={isVerifyingOtp || otp.join("").length !== 6}
                      className="verify-otp-btn"
                    >
                      {isVerifyingOtp ? (
                        <>
                          <span className="loading-spinner-small"></span>
                          Verifying...
                        </>
                      ) : (
                        <>
                          <span className="verify-icon">🔍</span>
                          Verify OTP
                        </>
                      )}
                    </button>

                    {otpTimer > 0 ? (
                      <div className="otp-timer">
                        <span className="timer-icon">⏱️</span>
                        Resend in {formatTime(otpTimer)}
                      </div>
                    ) : (
                      <button type="button" onClick={generateOtp} disabled={isGeneratingOtp || isOtpVerified} className="resend-otp-btn">
                        <span className="resend-icon">🔄</span>
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>

                {errors.otp && (
                  <div className="otp-error">
                    <span className="error-icon">⚠️</span>
                    {errors.otp}
                  </div>
                )}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="mobile" className="form-label">
                <span className="label-icon">📱</span>
                {t.mobile || "Mobile Number"}
              </label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder={t.enterMobile || "Enter Mobile Number"}
                className={`form-input ${errors.mobile ? "error-input" : ""}`}
                required
              />
              {errors.mobile && <span className="error">{errors.mobile}</span>}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  <span className="label-icon">🔒</span>
                  {t.createPassword || "Create Password"}
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={t.enterPassword || "Enter Password"}
                  className={`form-input ${errors.password ? "error-input" : ""}`}
                  required
                />
                {errors.password && <span className="error">{errors.password}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  <span className="label-icon">🔒</span>
                  {t.confirmPassword || "Confirm Password"}
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder={t.reEnterPassword || "Re-enter Password"}
                  className={`form-input ${errors.confirmPassword ? "error-input" : ""}`}
                  required
                />
                {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
              </div>
            </div>
          </div>

          <div className="section-divider"></div>

          {/* Role Selection */}
          <div className="form-section">
            <h3 className="section-title">Select Your Role</h3>
            <div className="form-group">
              <label className="form-label">{t.role || "Role"}</label>
              <select name="role" value={formData.role} onChange={handleChange} className="form-select" required>
                <option value="">-- Select Role --</option>
                <option value="farmer">🌱 {t.farmer || "Farmer"}</option>
                <option value="admin">🛡️ {t.admin || "Admin"}</option>
                <option value="drone controller">🚁 {t.droneController || "Drone Controller"}</option>
              </select>
            </div>
            {formData.role && (
              <div className={`role-badge ${formData.role.replace(" ", "-")}-badge`}>
                <span className="badge-icon">
                  {formData.role === "farmer" ? "🌱" : formData.role === "admin" ? "🛡️" : "🚁"}
                </span>
                {formData.role === "farmer" ? t.farmer : formData.role === "admin" ? t.admin : t.droneController}
              </div>
            )}
          </div>

          {/* Role-specific fields */}
          {formData.role && (
            <>
              <div className="section-divider"></div>
              {renderRoleFields()}
            </>
          )}

          {errors.submit && (
            <div className="error-alert">
              <span className="error-icon">⚠️</span>
              {errors.submit}
            </div>
          )}

          <button type="submit" className="register-btn" disabled={isSubmitting || !isOtpVerified}>
            {isSubmitting ? (
              <>
                <span className="loading-spinner"></span>
                {t.registering || "Creating Account..."}
              </>
            ) : (
              <>
                <span className="btn-icon">✅</span>
                {t.register || "Create Account"}
              </>
            )}
          </button>
        </form>

        <div className="register-footer">
          <p>
            {t.haveAccount || "Already have an account?"}{" "}
            <Link to="/login" className="login-link">
              {t.login || "Sign In"}
            </Link>
          </p>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="success-modal-overlay">
          <div className="success-modal">
            <div className="success-animation">
              <div className="success-checkmark">
                <div className="check-icon">
                  <span className="icon-line line-tip"></span>
                  <span className="icon-line line-long"></span>
                  <div className="icon-circle"></div>
                  <div className="icon-fix"></div>
                </div>
              </div>
            </div>
            <div className="success-content">
              <h2 className="success-title">Registration Successful! 🎉</h2>
              <p className="success-message">Welcome to Smart Farm 360! Your account has been created successfully.</p>
              <div className="success-details">
                <div className="detail-item">
                  <span className="detail-icon">📧</span>
                  <span>Email: {formData.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">👤</span>
                  <span>Role: {formData.role}</span>
                </div>
              </div>
              <p className="redirect-message">Redirecting to login page in a few seconds...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Register