"use client"

import { useState } from "react"
import { translations } from "../utils/translations"
import "./Profile.css"

const Profile = ({ currentLanguage }) => {
  const [profileData, setProfileData] = useState({
    name: "John Farmer",
    email: "john.farmer@email.com",
    password: "********",
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({ ...profileData })
  const t = translations[currentLanguage]

  const handleEdit = () => {
    setIsEditing(true)
    setEditData({ ...profileData })
  }

  const handleSave = () => {
    setProfileData({ ...editData })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData({ ...profileData })
    setIsEditing(false)
  }

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="profile-container">
      <h1>{t.accountInfo}</h1>

      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">👤</div>
          <h2>{profileData.name}</h2>
        </div>

        <div className="profile-form">
          <div className="form-group">
            <label>{t.name}</label>
            {isEditing ? (
              <input type="text" name="name" value={editData.name} onChange={handleChange} />
            ) : (
              <div className="form-value">{profileData.name}</div>
            )}
          </div>

          <div className="form-group">
            <label>{t.email}</label>
            {isEditing ? (
              <input type="email" name="email" value={editData.email} onChange={handleChange} />
            ) : (
              <div className="form-value">{profileData.email}</div>
            )}
          </div>

          <div className="form-group">
            <label>{t.password}</label>
            {isEditing ? (
              <input type="password" name="password" value={editData.password} onChange={handleChange} />
            ) : (
              <div className="form-value">{profileData.password}</div>
            )}
          </div>

          <div className="form-actions">
            {isEditing ? (
              <>
                <button className="save-btn" onClick={handleSave}>
                  {t.save}
                </button>
                <button className="cancel-btn" onClick={handleCancel}>
                  {t.cancel}
                </button>
              </>
            ) : (
              <button className="edit-btn" onClick={handleEdit}>
                {t.edit}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
