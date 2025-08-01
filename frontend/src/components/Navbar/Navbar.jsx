import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { FaUserCircle } from 'react-icons/fa'
import { useState } from 'react'
import './Navbar.css'

function Navbar() {
  const { token, logout } = useAuth()
  const [profileOpen, setProfileOpen] = useState(false)

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/">
          <img src="/Logo.png" alt="Logo" className="navbar-logo-image" />
          <span className="navbar-logo">LegalAI</span>
        </Link>
      </div>
      <div className="navbar-right">
        {token ? (
          <>
            <Link to="/chat" className="navbar-btn">Chat</Link>
            <Link to="/documents" className="navbar-btn">Documents</Link>
            <div className="navbar-profile">
              <button
                className="profile-icon-btn"
                onClick={() => setProfileOpen(v => !v)}
              >
                <FaUserCircle className="profile-icon" />
              </button>
              {profileOpen && (
                <div className="profile-dropdown" onMouseLeave={() => setProfileOpen(false)}>
                  
                  <Link to="/plans" className="profile-dropdown-item">Active Plan</Link>
                  <div className="profile-dropdown-divider" />
                  <button onClick={logout} className="profile-dropdown-item logout">
                    Log Out
                  </button>
                </div>

              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-btn">Login</Link>
            <Link to="/signup" className="navbar-btn">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar