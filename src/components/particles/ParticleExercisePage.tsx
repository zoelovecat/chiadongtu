import type {
  FlatParticleSentence,
  ParticleCheckResult,
} from '../../types/particle'
import { parseTemplate } from '../../utils/particleJson'

interface ParticleExercisePageProps {
  sentence: FlatParticleSentence
  total: number
  userAnswers: string[]
  checkResult: ParticleCheckResult | null
  reviewed: boolean
  onChange: (blankIndex: number, value: string) => void
  onCheck: () => void
  onNext: () => void
  onQuit: () => void
}

export function ParticleExercisePage({
  sentence,
  total,
  userAnswers,
  checkResult,
  reviewed,
  onChange,
  onCheck,
  onNext,
  onQuit,
}: ParticleExercisePageProps) {
  const parts = parseTemplate(sentence.template)
  const blankCount = sentence.blanks.length
  const wrongCount = checkResult?.results.filter((r) => !r.isCorrect).length ?? 0

  return (
    <div className="page exercise-page">
      <header className="exercise-header">
        <div>
          <span className="badge">{sentence.pair}</span>
          <p className="progress-text">
            Câu {sentence.globalIndex + 1} / {total}
          </p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={onQuit}>
          Thoát
        </button>
      </header>

      <div className="verb-card">
        <p className="verb-meaning">{sentence.meaning}</p>
        <p className="verb-hint muted">Điền trợ từ bằng hiragana vào chỗ trống</p>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${((sentence.globalIndex + 1) / total) * 100}%`,
          }}
        />
      </div>

      <form
        className="particle-sentence-form"
        onSubmit={(e) => {
          e.preventDefault()
          if (reviewed) onNext()
          else onCheck()
        }}
      >
        <div className="particle-inline-sentence">
          {parts.map((part, i) => (
            <span key={i} className="particle-inline-chunk">
              <span className="particle-text">{part}</span>
              {i < blankCount && (
                <span className="particle-blank-wrap">
                  <input
                    type="text"
                    className={`particle-blank-input ${
                      reviewed && checkResult
                        ? checkResult.results[i]?.isCorrect
                          ? 'particle-blank-correct'
                          : 'particle-blank-wrong'
                        : ''
                    }`}
                    value={userAnswers[i] ?? ''}
                    onChange={(e) => onChange(i, e.target.value)}
                    disabled={reviewed}
                    placeholder="?"
                    autoComplete="off"
                    spellCheck={false}
                    lang="ja"
                  />
                  {reviewed && checkResult && !checkResult.results[i]?.isCorrect && (
                    <span className="particle-blank-feedback">
                      Sai — đáp án:{' '}
                      <strong>{checkResult.results[i].correctAnswer}</strong>
                      <br />
                      {checkResult.results[i].explanation}
                    </span>
                  )}
                  {reviewed &&
                    !(userAnswers[i] ?? '').trim() &&
                    !checkResult?.results[i]?.isCorrect && (
                      <span className="form-empty-note">(để trống)</span>
                    )}
                </span>
              )}
            </span>
          ))}
        </div>

        <div className="exercise-actions">
          {!reviewed ? (
            <button type="submit" className="btn btn-primary">
              Kiểm tra
            </button>
          ) : (
            <>
              {wrongCount > 0 && (
                <p className="review-summary wrong-summary">
                  {wrongCount} / {blankCount} chỗ sai
                </p>
              )}
              {wrongCount === 0 && (
                <p className="review-summary correct-summary">Tất cả đúng!</p>
              )}
              <button type="submit" className="btn btn-primary">
                {sentence.globalIndex + 1 >= total
                  ? 'Xem kết quả'
                  : 'Tiếp theo'}
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  )
}
