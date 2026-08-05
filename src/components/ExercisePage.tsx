import { CONJUGATION_FORMS } from '../constants'
import { FORM_HINTS } from '../formHints'
import { FormHintIcon } from './FormHintIcon'
import type { FieldResult, FlatVerb, FormKey } from '../types'

interface ExercisePageProps {
  verb: FlatVerb
  totalVerbs: number
  userAnswers: Partial<Record<FormKey, string>>
  fieldResults: FieldResult[] | null
  reviewed: boolean
  onChange: (formKey: FormKey, value: string) => void
  onCheck: () => void
  onNext: () => void
  onQuit: () => void
}

export function ExercisePage({
  verb,
  totalVerbs,
  userAnswers,
  fieldResults,
  reviewed,
  onChange,
  onCheck,
  onNext,
  onQuit,
}: ExercisePageProps) {
  const resultMap = new Map(fieldResults?.map((r) => [r.formKey, r]) ?? [])
  const wrongCount = fieldResults?.filter((r) => !r.isCorrect).length ?? 0

  return (
    <div className="page exercise-page">
      <header className="exercise-header">
        <div>
          <span className="badge">{verb.groupName}</span>
          <p className="progress-text">
            Từ {verb.globalIndex + 1} / {totalVerbs}
          </p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={onQuit}>
          Thoát
        </button>
      </header>

      <div className="verb-card">
        <p className="verb-kanji">{verb.kanji}</p>
        <p className="verb-reading">{verb.reading}</p>
        <p className="verb-meaning">{verb.meaning}</p>
        <p className="verb-hint muted">Viết đáp án bằng hiragana</p>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${((verb.globalIndex + 1) / totalVerbs) * 100}%` }}
        />
      </div>

      <form
        className="forms-grid"
        onSubmit={(e) => {
          e.preventDefault()
          if (reviewed) onNext()
          else onCheck()
        }}
      >
        {CONJUGATION_FORMS.map(({ key, label }) => {
          const result = resultMap.get(key)
          const isWrong = reviewed && result && !result.isCorrect

          return (
            <label
              key={key}
              className={`form-field ${isWrong ? 'form-field-wrong' : ''} ${reviewed && result?.isCorrect ? 'form-field-correct' : ''}`}
            >
              <div className="form-label-row">
                <span className="form-label">{label}</span>
                <FormHintIcon hint={FORM_HINTS[key]} />
              </div>
              <input
                type="text"
                value={userAnswers[key] ?? ''}
                onChange={(e) => onChange(key, e.target.value)}
                disabled={reviewed}
                placeholder={reviewed ? '' : 'ひらがな'}
                autoComplete="off"
                spellCheck={false}
                lang="ja"
              />
              {reviewed && !(userAnswers[key] ?? '').trim() && (
                <span className="form-empty-note">(để trống)</span>
              )}
              {reviewed && verb.examples[key] && (
                <span className="form-example">
                  Ví dụ: {verb.examples[key]}
                </span>
              )}
              {isWrong && (
                <span className="form-feedback">
                  Sai — đáp án: <strong>{result.correctAnswer}</strong>
                </span>
              )}
            </label>
          )
        })}

        <div className="exercise-actions">
          {!reviewed ? (
            <button type="submit" className="btn btn-primary">
              Kiểm tra
            </button>
          ) : (
            <>
              {wrongCount > 0 && (
                <p className="review-summary wrong-summary">
                  {wrongCount} / {CONJUGATION_FORMS.length} thể sai
                </p>
              )}
              {wrongCount === 0 && (
                <p className="review-summary correct-summary">Tất cả đúng!</p>
              )}
              <button type="submit" className="btn btn-primary">
                {verb.globalIndex + 1 >= totalVerbs ? 'Xem kết quả' : 'Tiếp theo'}
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  )
}
