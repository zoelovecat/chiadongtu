import { useRef, useState } from 'react'
import type { Deck, SessionState } from '../types'
import {
  deckFingerprint,
  getGroupSummary,
  parseDeckJson,
} from '../utils/validateJson'
import { loadSession } from '../utils/storage'

interface UploadPageProps {
  onStart: (session: SessionState) => void
}

export function UploadPage({ onStart }: UploadPageProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [preview, setPreview] = useState<Deck | null>(null)
  const [sourceLabel, setSourceLabel] = useState<string | null>(null)
  const [jsonInput, setJsonInput] = useState('')
  const savedSession = loadSession()

  function loadJsonText(text: string, label: string) {
    setErrors([])
    setPreview(null)
    setSourceLabel(label)

    const { deck, errors: validationErrors } = parseDeckJson(text)
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

  function handlePasteSubmit() {
    if (!jsonInput.trim()) {
      setErrors(['Dán JSON vào ô bên dưới trước'])
      return
    }
    loadJsonText(jsonInput, 'JSON dán trực tiếp')
  }

  function handleStart(resume = false) {
    if (!preview) return

    if (resume && savedSession?.deckFingerprint === deckFingerprint(preview)) {
      onStart(savedSession)
      return
    }

    const session: SessionState = {
      deck: preview,
      deckFingerprint: deckFingerprint(preview),
      currentVerbIndex: 0,
      userAnswers: {},
      checkResults: {},
      completed: false,
      uploadedAt: new Date().toISOString(),
    }
    onStart(session)
  }

  const canResume =
    savedSession &&
    preview &&
    savedSession.deckFingerprint === deckFingerprint(preview) &&
    !savedSession.completed

  return (
    <div className="page">
      <header className="page-header">
        <h1>Nạp bộ đề</h1>
        <p>
          Dán JSON từ AI hoặc upload file <code>.json</code> để bắt đầu luyện
          tập.
        </p>
      </header>

      <section className="paste-section">
        <h2 className="section-title">Dán JSON từ AI</h2>
        <textarea
          className="json-input"
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='Dán JSON vào đây, ví dụ: {"title":"...","groups":[...]}'
          spellCheck={false}
          rows={8}
        />
        <div className="paste-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handlePasteSubmit}
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
          <p>{getGroupSummary(preview.groups)}</p>
          <p className="muted">
            Tổng:{' '}
            {preview.groups.reduce((n, g) => n + g.verbs.length, 0)} động từ
          </p>

          <div className="preview-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => handleStart(false)}
            >
              Bắt đầu làm bài
            </button>
            {canResume && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => handleStart(true)}
              >
                Tiếp tục bài dở (
                {savedSession.currentVerbIndex + 1}/
                {preview.groups.reduce((n, g) => n + g.verbs.length, 0)})
              </button>
            )}
          </div>
        </div>
      )}

      {savedSession && !preview && (
        <div className="hint-box">
          <h3>Bài đang lưu</h3>
          <p>
            <strong>{savedSession.deck.title}</strong> — từ{' '}
            {savedSession.currentVerbIndex + 1}/
            {savedSession.deck.groups.reduce((n, g) => n + g.verbs.length, 0)}
            {savedSession.completed ? ' (đã hoàn thành)' : ''}
          </p>
          <p className="muted">
            Nạp lại cùng bộ đề để tiếp tục hoặc bắt đầu mới.
          </p>
        </div>
      )}
    </div>
  )
}
