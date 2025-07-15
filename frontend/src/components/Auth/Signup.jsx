import { useState, useEffect } from 'react'
import axios from 'axios'
import OtpInput from './OtpInput'
import ProfileForm from './ProfileForm'
import './Auth.css'

const SEND_OTP_URL = 'https://mishratejass01.app.n8n.cloud/webhook/send-verification'
const VERIFY_OTP_URL = 'https://mishratejass01.app.n8n.cloud/webhook/otp-verify'
const REGISTER_URL = 'http://localhost:5000/api/auth/register'

export default function Signup({ onSignupSuccess }) {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otpError, setOtpError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId] = useState(() => crypto.randomUUID()) // Create session ID

  // Step 1: Email/password form
  const handleEmailSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setOtpError('')
    try {
      const res = await axios.post(SEND_OTP_URL, { 
        email, 
        password,
        sessionId
      })
      
      console.log('Signup response:', res.data) // Debug log

      if (res.data.output === "OTP sent successfully") {
        setStep(2)
      } else if (res.data.output === "This email address is already in use. Please login using the password") {
        setOtpError('This email address is already registered. Please login instead.')
        // Optional: Add a button or link to navigate to login page
        setTimeout(() => {
          window.location.href = '/login'
        }, 3000) // Redirect to login after 3 seconds
      } else {
        setOtpError('Something went wrong. Please try again.')
      }
    } catch (err) {
      console.error('Signup error:', err)
      setOtpError('Failed to process signup. Please try again.')
    }
    setLoading(false)
  }

  // Step 2: OTP Verification using n8n webhook
  const handleOtpSubmit = async otp => {
    setLoading(true)
    setOtpError('')
    try {
      const res = await axios.post(VERIFY_OTP_URL, {
        email: String(email),
        otp: String(otp),
        sessionId
      })

      // Check the output property in the response
      if (res.data.output === true) {
        setStep(3)
      } else {
        setOtpError('Incorrect OTP. Please try again.')
      }
    } catch (err) {
      console.error('OTP verification error:', err)
      setOtpError('Failed to verify OTP. Please try again.')
    }
    setLoading(false)
  }

  const handleResendOtp = async () => {
    setLoading(true)
    setOtpError('')
    try {
      await axios.post(SEND_OTP_URL, { 
        email, 
        password,
        sessionId // Include session ID
      })
    } catch {
      setOtpError('Failed to resend OTP.')
    }
    setLoading(false)
  }

  // Step 3: Profile form
  const handleProfileSubmit = async profileData => {
    setLoading(true)
    try {
      const res = await axios.post(REGISTER_URL, { 
        email, 
        password, 
        ...profileData,
        sessionId
      })
      
      console.log('Registration response:', res.data) // Debug log
      
      if (res.data.success) {
        onSignupSuccess()
      } else {
        setOtpError('Registration failed: ' + (res.data.msg || 'Unknown error'))
      }
    } catch (err) {
      console.error('Registration error:', err.response?.data || err)
      setOtpError(err.response?.data?.msg || 'Registration failed. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      {step === 1 && (
        <form className="auth-form" onSubmit={handleEmailSubmit}>
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
          <button type="submit" disabled={loading}>Send OTP</button>
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
        <ProfileForm
          onSubmit={handleProfileSubmit}
          loading={loading}
        />
      )}
    </div>
  )
}