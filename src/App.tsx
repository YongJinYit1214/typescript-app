import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [text, setText] = useState('')

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Mobile React App</h1>
      </header>

      <main className="app-content">
        <section className="counter-section">
          <h2>Counter Example</h2>
          <div className="counter">
            <button onClick={() => setCount(count - 1)}>-</button>
            <span>{count}</span>
            <button onClick={() => setCount(count + 1)}>+</button>
          </div>
        </section>

        <section className="input-section">
          <h2>Input Example</h2>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type something..."
          />
          {text && (
            <div className="text-output">
              <p>You typed: {text}</p>
            </div>
          )}
        </section>
      </main>

      <footer className="app-footer">
        <p>Mobile-friendly React TypeScript App</p>
      </footer>
    </div>
  )
}

export default App
