import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Auth.css'
import axios from 'axios'

export default function ProfileForm({ onSubmit, loading }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    emailAddress: '',
    password: '',
    age: '',
    gender: '',
    occupation: '',
    city: '',
    state: '',
    phone: ''
  })

  const [errors, setErrors] = useState({})

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/
    return phoneRegex.test(phone)
  }

  const handleChange = e => {
    const { name, value } = e.target
    
    // Validation rules
    if (name === 'age' && (isNaN(value) || value < 0)) {
      return
    }
    
    if (name === 'phone' && !/^\d*$/.test(value)) {
      return
    }

    setForm(prev => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form
    const newErrors = {}
    if (!validatePhone(form.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number'
    }
    if (form.age < 13 || form.age > 120) {
      newErrors.age = 'Please enter a valid age between 13 and 120'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      // Send to n8n webhook and wait for response
      const response = await axios.post('https://tejasworking.app.n8n.cloud/webhook/user-profile', form)
      
      // Check for successful profile setup
      if (response.data.output === "Profile Setup Successfully") {
        // Call the original onSubmit (if needed)
        await onSubmit(form)
        // Navigate to chat interface
        navigate('/chat')
      } else {
        setErrors({ submit: 'Profile setup failed. Please try again.' })
      }
    } catch (err) {
      console.error('Profile submission error:', err)
      setErrors({ submit: 'Failed to submit profile. Please try again.' })
    }
  }

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <input
        name="firstName"
        placeholder="First Name"
        value={form.firstName}
        onChange={handleChange}
        required
      />
      <input
        name="lastName"
        placeholder="Last Name"
        value={form.lastName}
        onChange={handleChange}
        required
      />
        <input
            name="emailAddress"
            type="email"
            placeholder="Email Address"
            value={form.emailAddress}
            onChange={handleChange}
            required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
      />
      <input
        name="age"
        type="number"
        placeholder="Age"
        min="13"
        max="120"
        value={form.age}
        onChange={handleChange}
        required
      />
      {errors.age && <div className="auth-error">{errors.age}</div>}
      
      <select
        name="gender"
        value={form.gender}
        onChange={handleChange}
        required
        className="profile-select"
      >
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>

      <input
        name="occupation"
        placeholder="Occupation"
        value={form.occupation}
        onChange={handleChange}
        required
      />
      <input
        name="city"
        placeholder="City"
        value={form.city}
        onChange={handleChange}
        required
      />
      <input
        name="state"
        placeholder="State"
        value={form.state}
        onChange={handleChange}
        required
      />
      <input
        name="phone"
        type="tel"
        placeholder="Phone Number (10 digits)"
        value={form.phone}
        onChange={handleChange}
        pattern="\d{10}"
        required
      />
      {errors.phone && <div className="auth-error">{errors.phone}</div>}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Setting up...' : 'Finish Signup'}
      </button>
      
      {errors.submit && <div className="auth-error">{errors.submit}</div>}
    </form>
  )
}