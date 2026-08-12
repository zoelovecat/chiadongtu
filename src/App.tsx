import { useState } from 'react'
import type { AppView } from './types'
import { VerbTab } from './components/VerbTab'
import { ParticleTab } from './components/particles/ParticleTab'
import './index.css'

function App() {
  const [view, setView] = useState<AppView>('verbs')

  return (
    <div className="app">
      <nav className="nav">
        <button
          type="button"
          className={`nav-link ${view === 'verbs' ? 'active' : ''}`}
          onClick={() => setView('verbs')}
        >
          Động từ
        </button>
        <button
          type="button"
          className={`nav-link ${view === 'particles' ? 'active' : ''}`}
          onClick={() => setView('particles')}
        >
          Trợ từ
        </button>
        <span className="nav-title">Luyện tiếng Nhật</span>
      </nav>

      <main className="main">
        {view === 'verbs' && <VerbTab />}
        {view === 'particles' && <ParticleTab />}
      </main>
    </div>
  )
}

export default App
