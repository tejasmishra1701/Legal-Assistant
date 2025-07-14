import { useNavigate } from 'react-router-dom'
import './Home.css'
import React from 'react'
import { useAuth } from '../../context/AuthContext'
function Home() {
  const navigate = useNavigate()

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Your AI Legal Assistant</h1>
          <p className="hero-subtitle">Advanced legal documentation and assistance powered by AI</p>
          <button className="cta-button" onClick={() => navigate('/chat')}>
            Try Now
          </button>
        </div>
      </section>

      <section className="features">
        <h2>Why Choose LegalAI?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Document Creation</h3>
            <p>Generate legal documents with AI assistance in minutes</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure & Confidential</h3>
            <p>Your data is encrypted and protected</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Fast & Efficient</h3>
            <p>Save hours of research and documentation time</p>
          </div>
        </div>
      </section>

      {/* <section className="pricing">
        <h2>Choose Your Plan</h2>
        <div className="pricing-grid">
          <div className="pricing-card">
            <h3>Basic</h3>
            <div className="price">$29<span>/month</span></div>
            <ul className="benefits">
              <li>✓ 100 AI Queries</li>
              <li>✓ Basic Document Templates</li>
              <li>✓ Email Support</li>
            </ul>
            <button className="pricing-btn" onClick={() => navigate('/signup')}>
              Get Started
            </button>
          </div>
          <div className="pricing-card featured">
            <div className="featured-tag">Popular</div>
            <h3>Professional</h3>
            <div className="price">$49<span>/month</span></div>
            <ul className="benefits">
              <li>✓ Unlimited AI Queries</li>
              <li>✓ All Document Templates</li>
              <li>✓ Priority Support</li>
              <li>✓ Custom Documents</li>
            </ul>
            <button className="pricing-btn" onClick={() => navigate('/signup')}>
              Get Started
            </button>
          </div>
          <div className="pricing-card">
            <h3>Enterprise</h3>
            <div className="price">$99<span>/month</span></div>
            <ul className="benefits">
              <li>✓ Everything in Professional</li>
              <li>✓ API Access</li>
              <li>✓ Dedicated Support</li>
              <li>✓ Custom Integration</li>
            </ul>
            <button className="pricing-btn" onClick={() => navigate('/signup')}>
              Contact Us
            </button>
          </div>
        </div>
      </section> */}
    </div>
  )
}

export default Home