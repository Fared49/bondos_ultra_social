import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true)
        const response = await axios.get('/api/status')
        setStatus(response.data)
        setError(null)
      } catch (err) {
        setError(err.message)
        setStatus(null)
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()
  }, [])

  return (
    <div className="container">
      <header className="header">
        <h1>🚀 Bondos Ultra Social</h1>
        <p>Enterprise Social Platform</p>
      </header>

      <main className="main">
        <section className="status-box">
          <h2>Backend Status</h2>
          {loading && <p className="loading">Checking connection...</p>}
          {error && <p className="error">❌ Error: {error}</p>}
          {status && (
            <div className="status-success">
              <p>✅ Connected to backend</p>
              <p>{status.message}</p>
              <p>Version: {status.version}</p>
            </div>
          )}
        </section>

        <section className="features">
          <h2>Features</h2>
          <ul>
            <li>✨ Modern React Frontend</li>
            <li>🔧 FastAPI Backend</li>
            <li>🗄️ PostgreSQL Database</li>
            <li>⚡ Redis Cache</li>
            <li>🐳 Docker Compose Stack</li>
          </ul>
        </section>
      </main>

      <footer className="footer">
        <p>Built with ❤️ using modern tech stack</p>
      </footer>
    </div>
  )
}

export default App
