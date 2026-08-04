import { CONJUGATION_FORMS } from '../constants'
import type { FlatVerb, VerbCheckResult } from '../types'

interface ResultsPageProps {
  verbs: FlatVerb[]
  checkResults: Record<number, VerbCheckResult>
  onRestart: () => void
  onHome: () => void
}

export function ResultsPage({
  verbs,
  checkResults,
  onRestart,
  onHome,
}: ResultsPageProps) {
  const allResults = verbs.map((v) => checkResults[v.globalIndex]).filter(Boolean)
  const totalFields = verbs.length * CONJUGATION_FORMS.length
  const correctFields = allResults.reduce(
    (sum, r) => sum + r.results.filter((f) => f.isCorrect).length,
    0,
  )
  const perfectVerbs = allResults.filter((r) => r.allCorrect).length
  const wrongItems = allResults.flatMap((r) =>
    r.results
      .filter((f) => !f.isCorrect)
      .map((f) => ({
        kanji: r.kanji,
        formKey: f.formKey,
        userAnswer: f.userAnswer,
        correctAnswer: f.correctAnswer,
      })),
  )

  const formLabel = (key: string) =>
    CONJUGATION_FORMS.find((f) => f.key === key)?.label ?? key

  return (
    <div className="page">
      <header className="page-header">
        <h1>Kết quả</h1>
      </header>

      <div className="results-summary">
        <div className="stat-card">
          <span className="stat-value">
            {correctFields}/{totalFields}
          </span>
          <span className="stat-label">thể đúng</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">
            {perfectVerbs}/{verbs.length}
          </span>
          <span className="stat-label">từ hoàn hảo</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">
            {Math.round((correctFields / totalFields) * 100)}%
          </span>
          <span className="stat-label">điểm</span>
        </div>
      </div>

      {wrongItems.length > 0 ? (
        <section className="wrong-list">
          <h2>Các câu sai ({wrongItems.length})</h2>
          <ul>
            {wrongItems.map((item, i) => (
              <li key={`${item.kanji}-${item.formKey}-${i}`}>
                <strong>{item.kanji}</strong> — {formLabel(item.formKey)}
                <br />
                Bạn: <span className="wrong-answer">{item.userAnswer || '(trống)'}</span>
                {' → '}
                Đúng: <span className="correct-answer">{item.correctAnswer}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <p className="perfect-message">Hoàn hảo! Tất cả đáp án đều đúng.</p>
      )}

      <div className="preview-actions">
        <button type="button" className="btn btn-primary" onClick={onRestart}>
          Làm lại bộ đề
        </button>
        <button type="button" className="btn btn-secondary" onClick={onHome}>
          Về trang chủ
        </button>
      </div>
    </div>
  )
}
