import { FORM_KEYS } from '../constants'
import type { FieldResult, FlatVerb, FormKey, VerbCheckResult } from '../types'
import { answersMatch } from './normalize'

export function checkVerbAnswers(
  verb: FlatVerb,
  userAnswers: Partial<Record<FormKey, string>>,
): VerbCheckResult {
  const results: FieldResult[] = FORM_KEYS.map((formKey) => {
    const userAnswer = userAnswers[formKey] ?? ''
    const correctAnswer = verb.answers[formKey] ?? ''
    return {
      formKey,
      userAnswer,
      correctAnswer,
      isCorrect: answersMatch(userAnswer, correctAnswer),
    }
  })

  return {
    globalIndex: verb.globalIndex,
    kanji: verb.kanji,
    results,
    allCorrect: results.every((r) => r.isCorrect),
  }
}
