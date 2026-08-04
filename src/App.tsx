import { useCallback, useEffect, useMemo, useState } from 'react'
import type { AppView, FormKey, SessionState } from './types'
import { PromptPage } from './components/PromptPage'
import { UploadPage } from './components/UploadPage'
import { ExercisePage } from './components/ExercisePage'
import { ResultsPage } from './components/ResultsPage'
import { flattenDeck } from './utils/validateJson'
import { checkVerbAnswers } from './utils/checkAnswers'
import { clearSession, loadSession, saveSession } from './utils/storage'
import './index.css'

function App() {
  const [view, setView] = useState<AppView>('upload')
  const [session, setSession] = useState<SessionState | null>(() => loadSession())
  const [reviewed, setReviewed] = useState(false)

  const verbs = useMemo(
    () => (session ? flattenDeck(session.deck) : []),
    [session],
  )

  const currentVerb = verbs[session?.currentVerbIndex ?? 0]

  useEffect(() => {
    if (session) saveSession(session)
  }, [session])

  const startSession = useCallback((newSession: SessionState) => {
    setSession(newSession)
    setReviewed(false)
    setView('exercise')
  }, [])

  const handleChange = useCallback(
    (formKey: FormKey, value: string) => {
      if (!session || !currentVerb) return
      setSession({
        ...session,
        userAnswers: {
          ...session.userAnswers,
          [currentVerb.globalIndex]: {
            ...session.userAnswers[currentVerb.globalIndex],
            [formKey]: value,
          },
        },
      })
    },
    [session, currentVerb],
  )

  const handleCheck = useCallback(() => {
    if (!session || !currentVerb) return
    const userAnswers = session.userAnswers[currentVerb.globalIndex] ?? {}
    const result = checkVerbAnswers(currentVerb, userAnswers)
    setSession({
      ...session,
      checkResults: {
        ...session.checkResults,
        [currentVerb.globalIndex]: result,
      },
    })
    setReviewed(true)
  }, [session, currentVerb])

  const handleNext = useCallback(() => {
    if (!session) return
    const nextIndex = session.currentVerbIndex + 1

    if (nextIndex >= verbs.length) {
      setSession({ ...session, completed: true })
      setView('results')
      return
    }

    setSession({ ...session, currentVerbIndex: nextIndex })
    setReviewed(false)
  }, [session, verbs.length])

  const handleQuit = useCallback(() => {
    setView('upload')
    setReviewed(false)
  }, [])

  const handleRestart = useCallback(() => {
    if (!session) return
    const restarted: SessionState = {
      ...session,
      currentVerbIndex: 0,
      userAnswers: {},
      checkResults: {},
      completed: false,
    }
    setSession(restarted)
    setReviewed(false)
    setView('exercise')
  }, [session])

  const handleHome = useCallback(() => {
    clearSession()
    setSession(null)
    setReviewed(false)
    setView('upload')
  }, [])

  return (
    <div className="app">
      <nav className="nav">
        <button
          type="button"
          className={`nav-link ${view === 'prompt' ? 'active' : ''}`}
          onClick={() => setView('prompt')}
        >
          Prompt mẫu
        </button>
        <button
          type="button"
          className={`nav-link ${view === 'upload' || view === 'exercise' || view === 'results' ? 'active' : ''}`}
          onClick={() => {
            if (view === 'exercise') {
              if (confirm('Thoát bài làm? Tiến độ đã được lưu tự động.')) {
                setView('upload')
              }
            } else {
              setView('upload')
            }
          }}
        >
          Làm bài
        </button>
        <span className="nav-title">Chia thể động từ</span>
      </nav>

      <main className="main">
        {view === 'prompt' && <PromptPage />}

        {view === 'upload' && <UploadPage onStart={startSession} />}

        {view === 'exercise' && session && currentVerb && (
          <ExercisePage
            verb={currentVerb}
            totalVerbs={verbs.length}
            userAnswers={session.userAnswers[currentVerb.globalIndex] ?? {}}
            fieldResults={
              reviewed
                ? (session.checkResults[currentVerb.globalIndex]?.results ?? null)
                : null
            }
            reviewed={reviewed}
            onChange={handleChange}
            onCheck={handleCheck}
            onNext={handleNext}
            onQuit={handleQuit}
          />
        )}

        {view === 'results' && session && (
          <ResultsPage
            verbs={verbs}
            checkResults={session.checkResults}
            onRestart={handleRestart}
            onHome={handleHome}
          />
        )}
      </main>
    </div>
  )
}

export default App
