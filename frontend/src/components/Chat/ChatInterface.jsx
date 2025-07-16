import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { FaCopy } from 'react-icons/fa'
import './ChatInterface.css'

function ChatInterface() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [sessionId] = useState(() => crypto.randomUUID())
  const [touchStart, setTouchStart] = useState(null)
  const inputRef = useRef(null)
  const messagesEndRef = useRef(null)

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    if (!isExpanded) {
      setIsExpanded(true)
    }

    setMessages((msgs) => [...msgs, { role: 'user', content: input }])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('https://mishratejass01.app.n8n.cloud/webhook/legal-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input, sessionId }),
      })
      const data = await res.json()
      
      let responseText = 'No response'
      
      if (data.output) {
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
    const [dots, setDots] = useState('')
    useEffect(() => {
      const interval = setInterval(() => {
        setDots(d => (d.length >= 3 ? '' : d + '.'))
      }, 400)
      return () => clearInterval(interval)
    }, [])
    return <span>{dots}</span>
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleTouchStart = (e) => {
    if (window.innerWidth <= 768) {
      const touch = e.touches[0];
      setTouchStart(touch.clientY);
    }
  };

  const handleTouchMove = (e) => {
    if (touchStart && window.innerWidth <= 768) {
      const touch = e.touches[0];
      const diff = touchStart - touch.clientY;
      
      if (Math.abs(diff) > 50) {
        // Prevent default scroll when interacting with chat
        e.preventDefault();
      }
    }
  };

  return (
    <>
      <div className="chat-header">
        <h2 className="header-text">Hello Your Honour! How may I help you?</h2>
      </div>
      <div className={`chat-container ${isExpanded ? 'expanded' : 'compact'}`} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove}>
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
          <div ref={messagesEndRef} />
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

export default ChatInterface