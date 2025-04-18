import { useEffect } from 'react'
import './App.css'
import Calendar from './components/Calendar'

function App() {
  // We'll use uuid directly in our components
  useEffect(() => {
    // Initialize app
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Calendar App</h1>
      </header>

      <main className="app-content">
        <Calendar />
      </main>

      <footer className="app-footer">
        <p>Mobile-friendly Calendar App</p>
      </footer>
    </div>
  )
}

export default App
