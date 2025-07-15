import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import OtpInput from './OtpInput'
import './Auth.css'

const LOGIN_URL = 'https://mishratejass01.app.n8n.cloud/webhook/login'
const RESET_PASSWORD_URL = 'https://mishratejass01.app.n8n.cloud/webhook/reset-password'
const VERIFY_RESET_OTP_URL = 'https://mishratejass01.app.n8n.cloud/webhook/reset-otp-verify'
const SET_NEW_PASSWORD_URL = 'https://mishratejass01.app.n8n.cloud/webhook/set-password'

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otpError, setOtpError] = useState('')
  const [loading, setLoading] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [sessionId] = useState(() => crypto.randomUUID()) // Add session ID

  // Step 1: Login form
  const handleLogin = async e => {
    e.preventDefault()
    setLoading(true)
    setOtpError('')
    try {
      const res = await axios.post(LOGIN_URL, { 
        email: String(email), 
        password: String(password),
        sessionId 
      })
      
      console.log('Login response:', res.data) // Debug log

      // Access first element of array and check output property
      if (res.data === "Login successful") {
        // Store user info in sessionStorage
        sessionStorage.setItem('userEmail', email)
        sessionStorage.setItem('sessionId', sessionId)
        // Create a token (you can use sessionId as token)
        sessionStorage.setItem('token', sessionId)
        // Call onLoginSuccess to update Auth context
        onLoginSuccess(sessionId)
        // Then navigate
        navigate('/chat')
      } else if (res.data === "User does not exist. Sign up instead.") {
        setOtpError('Account not found. Redirecting to signup...')
        setTimeout(() => {
          navigate('/signup', { state: { email } })
        }, 3000)
      } else {
        setOtpError('Invalid credentials. Please try again.')
      }
    } catch (err) {
      console.error('Login error:', err.response?.data || err)
      setOtpError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Send reset password OTP
  const handleForgot = async () => {
    setLoading(true)
    setOtpError('')
    try {
      const res = await axios.post(RESET_PASSWORD_URL, { 
        email,
        sessionId 
      })
      
      if (res.data.output === "Reset OTP sent successfully") {
        setStep(2)
      } else {
        setOtpError('Failed to send reset OTP. Please try again.')
      }
    } catch (err) {
      console.error('Reset password error:', err)
      setOtpError('Failed to initiate password reset.')
    }
    setLoading(false)
  }

  // Step 3: Verify reset OTP
  const handleOtpSubmit = async otp => {
    setLoading(true)
    setOtpError('')
    try {
      const res = await axios.post(VERIFY_RESET_OTP_URL, { 
        email: String(email), 
        otp: String(otp),
        sessionId
      })
      
      if (res.data.output === true) {
        setStep(3)
      } else {
        setOtpError('Incorrect OTP. Please try again.')
      }
    } catch (err) {
      console.error('OTP verification error:', err)
      setOtpError('Failed to verify OTP.')
    }
    setLoading(false)
  }

  // Step 4: Set new password
  const handleResetPassword = async e => {
    e.preventDefault()
    setLoading(true)
    setOtpError('')
    try {
      const res = await axios.post(SET_NEW_PASSWORD_URL, { 
        email,
        newPassword,
        sessionId
      })

      if (res.data.output === "Password reset successful") {
        setStep(1)
        setOtpError('Password reset successful. Please login with your new password.')
      } else {
        setOtpError('Failed to reset password. Please try again.')
      }
    } catch (err) {
      console.error('Set new password error:', err)
      setOtpError('Failed to set new password.')
    }
    setLoading(false)
  }

  const handleResendOtp = async () => {
    setLoading(true)
    setOtpError('')
    try {
      const res = await axios.post(RESET_PASSWORD_URL, { 
        email,
        sessionId 
      })
      
      if (res.data.output === "Reset OTP sent successfully") {
        setOtpError('New OTP sent successfully.')
      } else {
        setOtpError('Failed to send new OTP.')
      }
    } catch (err) {
      setOtpError('Failed to resend OTP.')
    }
    setLoading(false)
  }

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {step === 1 && (
        <form className="auth-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={e => setPassword(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <button 
            type="button" 
            onClick={() => setStep(2)} 
            disabled={loading}
            className="forgot-btn"
          >
            Forgot Password?
          </button>
          {otpError && <div className="auth-error">{otpError}</div>}
        </form>
      )}
      {step === 2 && (
        <OtpInput
          onSubmit={handleOtpSubmit}
          loading={loading}
          error={otpError}
          onResend={handleResendOtp}
        />
      )}
      {step === 3 && (
        <form className="auth-form" onSubmit={handleResetPassword}>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            required
            onChange={e => setNewPassword(e.target.value)}
          />
          <button type="submit" disabled={loading}>Reset Password</button>
          {otpError && <div className="auth-error">{otpError}</div>}
        </form>
      )}
    </div>
  )
}