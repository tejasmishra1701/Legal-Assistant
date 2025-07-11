import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { FaUserCircle, FaCopy } from 'react-icons/fa' // Add FaCopy import
import './App.css'

function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [sessionId] = useState(() => crypto.randomUUID()) // Generate session ID once
  const [profileOpen, setProfileOpen] = useState(false);
  const inputRef = useRef(null) // Add ref for input element
  const messagesEndRef = useRef(null) // Add this ref

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    // Expand the chat container on first message
    if (!isExpanded) {
      setIsExpanded(true)
    }

    // Add user message
    setMessages((msgs) => [...msgs, { role: 'user', content: input }])
    setInput('') // Clear input immediately
    setLoading(true)

    try {
      const res = await fetch('https://tejasworking.app.n8n.cloud/webhook/legal-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input, sessionId }), // Include sessionId here
      })
      const data = await res.json()
      
      // Handle different response formats
      let responseText = 'No response'
      
      if (data.output) {
        // If output is an array, extract the content
        if (Array.isArray(data.output)) {
          responseText = data.output.map(item => item.content || item.text || item.message || JSON.stringify(item)).join('\n')
        } else if (typeof data.output === 'string') {
          responseText = data.output
        } else if (typeof data.output === 'object') {
          responseText = data.output.content || data.output.text || data.output.message || JSON.stringify(data.output)
        }
      } else if (data.response) {
        responseText = data.response
      } else if (data.message) {
        responseText = data.message
      }
      
      setMessages((msgs) => [...msgs, { role: 'assistant', content: responseText }])
    } catch (err) {
      console.error('Error fetching response:', err)
      setMessages((msgs) => [...msgs, { role: 'assistant', content: 'Error fetching response.' }])
    }
    setLoading(false)
  }

  const TypingDots = () => {
    const [dots, setDots] = useState('');
    useEffect(() => {
      const interval = setInterval(() => {
        setDots(d => (d.length >= 3 ? '' : d + '.'));
      }, 400);
      return () => clearInterval(interval);
    }, []);
    return <span>{dots}</span>;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages]) // Scroll when messages update

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <>
    
      <nav className="navbar">
        <div className="navbar-left">
          <img src="/Logo.png" alt="Logo" className="navbar-logo-image" />
          <span className="navbar-logo">LegalAI</span>
        </div>
        <div className="navbar-right">
          <button className="navbar-btn" tabIndex={0}>Contact Us</button>
          <button className="navbar-btn" tabIndex={0}>Feedback</button>
          <div className="navbar-profile">
            <button
              className="profile-icon-btn"
              onClick={() => setProfileOpen(v => !v)}
              tabIndex={0}
              aria-label="Profile"
            >
              <FaUserCircle size={30} />
            </button>
            {profileOpen && (
              <div className="profile-dropdown" onMouseLeave={() => setProfileOpen(false)}>
                <div className="profile-dropdown-item">Profile</div>
                <div className="profile-dropdown-item">Active Plan</div>
                <div className="profile-dropdown-item">My Documents</div>
                <div className="profile-dropdown-divider" />
                <div className="profile-dropdown-item logout">Log Out</div>
              </div>
            )}
          </div>
        </div>
      </nav>
      <div className="chat-header">
        <h2 className="header-text">Hello Your Honour! How may I help you?</h2>
      </div>
      <div className={`chat-container ${isExpanded ? 'expanded' : 'compact'}`}>
        <div className="messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={msg.role === 'user' ? 'user-msg' : 'assistant-msg'}>
              {msg.role === 'assistant' && (
                <button 
                  className="copy-button"
                  onClick={() => handleCopy(msg.content)}
                  title="Copy to clipboard"
                >
                  <FaCopy />
                </button>
              )}
              {msg.role === 'assistant'
                ? <ReactMarkdown>{msg.content}</ReactMarkdown>
                : msg.content}
            </div>
          ))}
          {loading && (
            <div className="assistant-msg">
              Thinking
              <TypingDots />
            </div>
          )}
          <div ref={messagesEndRef} /> {/* Add this invisible element */}
        </div>
        <form className="chat-input" onSubmit={handleSend}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your question..."
            disabled={loading}
          />
          <button type="submit" disabled={loading || !input.trim()}>Send</button>
        </form>
      </div>
    </>
  )
}

export default App