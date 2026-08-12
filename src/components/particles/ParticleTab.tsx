import { useEffect, useMemo, useRef, useState } from 'react'
import type {
  ParticleDeck,
  ParticleSessionState,
  ParticleView,
} from '../../types/particle'
import {
  checkParticleSentence,
  flattenParticleDeck,
  getOrderedSentences,
  parseParticleJson,
  particleDeckFingerprint,
  shuffledOrder,
} from '../../utils/particleJson'
import {
  loadParticleSession,
  saveParticleSession,
} from '../../utils/particleStorage'
import { ParticleExercisePage } from './ParticleExercisePage'
import { ParticlePromptSection } from './ParticlePromptSection'
import { ParticleResultsPage } from './ParticleResultsPage'

export function ParticleTab() {
  const [view, setView] = useState<ParticleView>('upload')
  const [session, setSession] = useState<ParticleSessionState | null>(() =>
    loadParticleSession(),
  )
  const [reviewed, setReviewed] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [preview, setPreview] = useState<ParticleDeck | null>(null)
  const [sourceLabel, setSourceLabel] = useState<string | null>(null)
  const [jsonInput, setJsonInput] = useState('')
  const savedSession = loadParticleSession()

  const sentences = useMemo(
    () =>
      session
        ? getOrderedSentences(session.deck, session.sentenceOrder)
        : [],
    [session],
  )
  const current = sentences[session?.currentIndex ?? 0]

  useEffect(() => {
    if (session) saveParticleSession(session)
  }, [session])

  function loadJsonText(text: string, label: string) {
    setErrors([])
    setPreview(null)
    setSourceLabel(label)
    const { deck, errors: validationErrors } = parseParticleJson(text)
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }
    if (deck) setPreview(deck)
  }

  function handleFile(file: File) {
    const reader = new FileReader()
    reader.onload = () => {
      const text = reader.result
      if (typeof text !== 'string') {
        setErrors(['Không đọc được file'])
        return
      }
      setJsonInput(text)
      loadJsonText(text, file.name)
    }
    reader.readAsText(file, 'utf-8')
  }

  function startSession(resume = false) {
    if (!preview) return
    if (
      resume &&
      savedSession?.deckFingerprint === particleDeckFingerprint(preview)
    ) {
      const flat = flattenParticleDeck(preview)
      setSession({
        ...savedSession,
        sentenceOrder:
          savedSession.sentenceOrder ??
          Array.from({ length: flat.length }, (_, i) => i),
      })
      setReviewed(false)
      setView('exercise')
      return
    }
    const flat = flattenParticleDeck(preview)
    setSession({
      deck: preview,
      deckFingerprint: particleDeckFingerprint(preview),
      sentenceOrder: shuffledOrder(flat.length),
      currentIndex: 0,
      userAnswers: {},
      checkResults: {},
      completed: false,
      uploadedAt: new Date().toISOString(),
    })
    setReviewed(false)
    setView('exercise')
  }

  function handleChange(blankIndex: number, value: string) {
    if (!session || !current) return
    const prev = session.userAnswers[current.globalIndex] ?? []
    const next = [...prev]
    next[blankIndex] = value
    setSession({
      ...session,
      userAnswers: {
        ...session.userAnswers,
        [current.globalIndex]: next,
      },
    })
  }

  function handleCheck() {
    if (!session || !current) return
    const userAnswers = session.userAnswers[current.globalIndex] ?? []
    const result = checkParticleSentence(current, userAnswers)
    setSession({
      ...session,
      checkResults: {
        ...session.checkResults,
        [current.globalIndex]: result,
      },
    })
    setReviewed(true)
  }

  function handleNext() {
    if (!session) return
    const nextIndex = session.currentIndex + 1
    if (nextIndex >= sentences.length) {
      setSession({ ...session, completed: true })
      setView('results')
      return
    }
    setSession({ ...session, currentIndex: nextIndex })
    setReviewed(false)
  }

  const canResume =
    savedSession &&
    preview &&
    savedSession.deckFingerprint === particleDeckFingerprint(preview) &&
    !savedSession.completed

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
      </div>

      {view === 'prompt' && <ParticlePromptSection />}

      {view === 'upload' && (
        <div className="page">
          <header className="page-header">
            <h1>Trợ từ — Nạp bộ đề</h1>
            <p>
              Dán JSON từ AI hoặc upload file. Bài tập tập trung các cặp trợ
              từ dễ nhầm (は/が, に/で…).
            </p>
          </header>

          <section className="paste-section">
            <h2 className="section-title">Dán JSON từ AI</h2>
            <textarea
              className="json-input"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='{"title":"...","focus_pairs":[...],"groups":[...]}'
              spellCheck={false}
              rows={8}
            />
            <div className="paste-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  if (!jsonInput.trim()) {
                    setErrors(['Dán JSON vào ô trước'])
                    return
                  }
                  loadJsonText(jsonInput, 'JSON dán trực tiếp')
                }}
              >
                Nạp bộ đề
              </button>
              {jsonInput && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setJsonInput('')
                    setPreview(null)
                    setSourceLabel(null)
                    setErrors([])
                  }}
                >
                  Xóa
                </button>
              )}
            </div>
          </section>

          <p className="upload-divider">hoặc</p>

          <div
            className="drop-zone"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault()
              e.currentTarget.classList.add('drag-over')
            }}
            onDragLeave={(e) => e.currentTarget.classList.remove('drag-over')}
            onDrop={(e) => {
              e.preventDefault()
              e.currentTarget.classList.remove('drag-over')
              const file = e.dataTransfer.files[0]
              if (file) handleFile(file)
            }}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".json,application/json"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFile(file)
              }}
            />
            <p className="drop-title">Kéo thả file JSON vào đây</p>
            <p className="muted">hoặc bấm để chọn file</p>
            {sourceLabel && sourceLabel !== 'JSON dán trực tiếp' && (
              <p className="file-name">{sourceLabel}</p>
            )}
          </div>

          {errors.length > 0 && (
            <div className="error-box">
              <h3>Lỗi validate JSON</h3>
              <ul>
                {errors.map((err) => (
                  <li key={err}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {preview && (
            <div className="preview-box">
              <h2>{preview.title}</h2>
              <p className="muted">
                {flattenParticleDeck(preview).length} câu
              </p>
              <div className="preview-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => startSession(false)}
                >
                  Bắt đầu làm bài
                </button>
                {canResume && savedSession && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => startSession(true)}
                  >
                    Tiếp tục bài dở ({savedSession.currentIndex + 1}/
                    {flattenParticleDeck(preview).length})
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {view === 'exercise' && session && current && (
        <ParticleExercisePage
          sentence={current}
          total={sentences.length}
          userAnswers={session.userAnswers[current.globalIndex] ?? []}
          checkResult={
            reviewed ? session.checkResults[current.globalIndex] ?? null : null
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
        <ParticleResultsPage
          sentences={sentences}
          checkResults={session.checkResults}
          onRestart={() => {
            setSession({
              ...session,
              currentIndex: 0,
              sentenceOrder: shuffledOrder(
                flattenParticleDeck(session.deck).length,
              ),
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
