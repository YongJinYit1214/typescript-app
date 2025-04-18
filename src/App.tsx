import { useEffect, useState } from 'react'
import './App.css'
import Calendar from './components/Calendar'
import About from './components/About'

function App() {
  // We'll use uuid directly in our components
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    // Initialize app
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>My Calendar App</h1>
        <button
          className="about-toggle"
          onClick={() => setShowAbout(!showAbout)}
        >
          {showAbout ? 'Show Calendar' : 'About'}
        </button>
      </header>

      <main className="app-content">
        {showAbout ? <About /> : <Calendar />}
      </main>

      <footer className="app-footer">
        <p>Mobile-friendly Calendar App - v1.0.0</p>
      </footer>
    </div>
  )
}

export default App
