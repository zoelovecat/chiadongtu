import { useCallback, useEffect, useMemo, useState } from 'react'
import type { FormKey, SessionState } from '../types'
import { PromptPage } from './PromptPage'
import { UploadPage } from './UploadPage'
import { ExercisePage } from './ExercisePage'
import { ResultsPage } from './ResultsPage'
import { flattenDeck } from '../utils/validateJson'
import { checkVerbAnswers } from '../utils/checkAnswers'
import { loadSession, saveSession } from '../utils/storage'

type VerbView = 'prompt' | 'upload' | 'exercise' | 'results'

export function VerbTab() {
  const [view, setView] = useState<VerbView>('upload')
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

  function goUpload() {
    if (view === 'exercise') {
      if (confirm('Thoát bài làm? Tiến độ đã được lưu tự động.')) {
        setView('upload')
        setReviewed(false)
      }
    } else {
      setView('upload')
    }
  }

  return (
    <div className="module-tab">
      <div className="module-subnav">
        <button
          type="button"
          className={`module-subnav-link ${view === 'prompt' ? 'active' : ''}`}
          onClick={() => setView('prompt')}
        >
          Prompt mẫu
        </button>
        <button
          type="button"
          className={`module-subnav-link ${view === 'upload' || view === 'exercise' || view === 'results' ? 'active' : ''}`}
          onClick={goUpload}
        >
          Làm bài
        </button>
      </div>

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
          onQuit={() => {
            setView('upload')
            setReviewed(false)
          }}
        />
      )}

      {view === 'results' && session && (
        <ResultsPage
          verbs={verbs}
          checkResults={session.checkResults}
          onRestart={() => {
            setSession({
              ...session,
              currentVerbIndex: 0,
              userAnswers: {},
              checkResults: {},
              completed: false,
            })
            setReviewed(false)
            setView('exercise')
          }}
          onHome={() => {
            setView('upload')
            setReviewed(false)
          }}
        />
      )}
    </div>
  )
}
