import type {
  FlatParticleSentence,
  ParticleCheckResult,
} from '../../types/particle'

interface ParticleResultsPageProps {
  sentences: FlatParticleSentence[]
  checkResults: Record<number, ParticleCheckResult>
  onRestart: () => void
  onHome: () => void
}

export function ParticleResultsPage({
  sentences,
  checkResults,
  onRestart,
  onHome,
}: ParticleResultsPageProps) {
  const allResults = sentences
    .map((s) => checkResults[s.globalIndex])
    .filter(Boolean)
  const totalBlanks = sentences.reduce((n, s) => n + s.blanks.length, 0)
  const correctBlanks = allResults.reduce(
    (sum, r) => sum + r.results.filter((f) => f.isCorrect).length,
    0,
  )
  const perfectSentences = allResults.filter((r) => r.allCorrect).length

  const wrongItems = allResults.flatMap((r) => {
    const sentence = sentences[r.globalIndex]
    return r.results
      .filter((f) => !f.isCorrect)
      .map((f) => ({
        meaning: sentence.meaning,
        blankIndex: f.blankIndex,
        userAnswer: f.userAnswer,
        correctAnswer: f.correctAnswer,
        explanation: f.explanation,
      }))
  })

  return (
    <div className="page">
      <header className="page-header">
        <h1>Kết quả — Trợ từ</h1>
      </header>

      <div className="results-summary">
        <div className="stat-card">
          <span className="stat-value">
            {correctBlanks}/{totalBlanks}
          </span>
          <span className="stat-label">chỗ đúng</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">
            {perfectSentences}/{sentences.length}
          </span>
          <span className="stat-label">câu hoàn hảo</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">
            {totalBlanks > 0
              ? Math.round((correctBlanks / totalBlanks) * 100)
              : 0}
            %
          </span>
          <span className="stat-label">điểm</span>
        </div>
      </div>

      {wrongItems.length > 0 ? (
        <section className="wrong-list">
          <h2>Các chỗ sai ({wrongItems.length})</h2>
          <ul>
            {wrongItems.map((item, i) => (
              <li key={`${item.meaning}-${item.blankIndex}-${i}`}>
                <strong>{item.meaning}</strong> — chỗ #{item.blankIndex + 1}
                <br />
                Bạn:{' '}
                <span className="wrong-answer">
                  {item.userAnswer || '(trống)'}
                </span>
                {' → '}
                Đúng:{' '}
                <span className="correct-answer">{item.correctAnswer}</span>
                <br />
                <span className="muted">{item.explanation}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <p className="perfect-message">Hoàn hảo! Tất cả trợ từ đều đúng.</p>
      )}

      <div className="preview-actions">
        <button type="button" className="btn btn-primary" onClick={onRestart}>
          Làm lại bộ đề
        </button>
        <button type="button" className="btn btn-secondary" onClick={onHome}>
          Về trang nạp đề
        </button>
      </div>
    </div>
  )
}
