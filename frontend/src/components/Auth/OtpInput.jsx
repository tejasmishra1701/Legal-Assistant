import { useState } from 'react'
import './Auth.css'

export default function OtpInput({ onSubmit, loading, error, onResend }) {
    const [otp, setOtp] = useState('')

    return (
        <form className="auth-form" onSubmit={e => { e.preventDefault(); onSubmit(otp) }}>
            <input
                type="text"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                placeholder="Enter OTP"
                maxLength={6}
                required
            />
            
            <button type="submit" disabled={loading}>
                Verify OTP
            </button>
            
            <button type="button" className="resend-btn" onClick={onResend} disabled={loading}>
                Send OTP
            </button>
            
            {error && <div className="auth-error">{error}</div>}
        </form>
    )
}