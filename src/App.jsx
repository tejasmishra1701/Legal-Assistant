import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import './App.css'

function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [sessionId] = useState(() => crypto.randomUUID()) // Generate session ID once

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    // Expand the chat container on first message
    if (!isExpanded) {
      setIsExpanded(true)
    }

    // Add user message
    setMessages((msgs) => [...msgs, { role: 'user', content: input }])
    setInput('') // <-- Clear input immediately
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

  return (
    <div className={`chat-container ${isExpanded ? 'expanded' : 'compact'}`}>
      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.role === 'user' ? 'user-msg' : 'assistant-msg'}>
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
      </div>
      <form className="chat-input" onSubmit={handleSend}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your question..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()}>Send</button>
      </form>
    </div>
  )
}

export default App