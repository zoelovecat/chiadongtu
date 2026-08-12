import type {
  FlatParticleSentence,
  ParticleCheckResult,
  ParticleDeck,
} from '../types/particle'
import { answersMatch } from './normalize'

export function parseTemplate(template: string): string[] {
  return template.split('___')
}

export function countBlanks(template: string): number {
  return (template.match(/___/g) ?? []).length
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function validateSentence(
  sentence: unknown,
  groupLabel: string,
  index: number,
): string[] {
  const errors: string[] = []
  const label = `${groupLabel}, câu #${index + 1}`

  if (!isObject(sentence)) {
    return [`${label}: không phải object`]
  }

  if (typeof sentence.meaning !== 'string' || !sentence.meaning.trim()) {
    errors.push(`${label}: thiếu "meaning"`)
  }

  if (typeof sentence.template !== 'string' || !sentence.template.trim()) {
    errors.push(`${label}: thiếu "template"`)
    return errors
  }

  const blankCount = countBlanks(sentence.template)
  if (blankCount === 0) {
    errors.push(`${label}: template phải có ít nhất một "___"`)
  }

  if (!Array.isArray(sentence.blanks)) {
    errors.push(`${label}: thiếu "blanks" (array)`)
    return errors
  }

  if (sentence.blanks.length !== blankCount) {
    errors.push(
      `${label}: số "___" (${blankCount}) không khớp số blanks (${sentence.blanks.length})`,
    )
  }

  sentence.blanks.forEach((blank, bi) => {
    if (!isObject(blank)) {
      errors.push(`${label}, blank #${bi + 1}: không phải object`)
      return
    }
    if (typeof blank.answer !== 'string' || !blank.answer.trim()) {
      errors.push(`${label}, blank #${bi + 1}: thiếu "answer"`)
    }
    if (typeof blank.explanation !== 'string' || !blank.explanation.trim()) {
      errors.push(`${label}, blank #${bi + 1}: thiếu "explanation"`)
    }
  })

  return errors
}

function validateGroup(group: unknown, index: number): string[] {
  const errors: string[] = []
  const label = `Group #${index + 1}`

  if (!isObject(group)) {
    return [`${label}: không phải object`]
  }

  if (typeof group.pair !== 'string' || !group.pair.trim()) {
    errors.push(`${label}: thiếu "pair"`)
  }

  if (!Array.isArray(group.sentences)) {
    errors.push(`${label}: thiếu "sentences" (array)`)
    return errors
  }

  if (group.sentences.length === 0) {
    errors.push(`${label}: "sentences" không được rỗng`)
  }

  group.sentences.forEach((s, si) => {
    errors.push(...validateSentence(s, label, si))
  })

  return errors
}

export function validateParticleDeck(
  data: unknown,
): { deck?: ParticleDeck; errors: string[] } {
  const errors: string[] = []

  if (!isObject(data)) {
    return { errors: ['JSON root phải là object'] }
  }

  if (typeof data.title !== 'string' || !data.title.trim()) {
    errors.push('Thiếu "title"')
  }

  if (!Array.isArray(data.focus_pairs) || data.focus_pairs.length === 0) {
    errors.push('Thiếu "focus_pairs" (array, không rỗng)')
  }

  if (!Array.isArray(data.groups)) {
    errors.push('Thiếu "groups" (array)')
    return { errors }
  }

  if (data.groups.length === 0) {
    errors.push('"groups" không được rỗng')
  }

  data.groups.forEach((g, i) => {
    errors.push(...validateGroup(g, i))
  })

  if (errors.length > 0) {
    return { errors }
  }

  return { deck: data as unknown as ParticleDeck, errors: [] }
}

export function stripJsonWrapper(raw: string): string {
  const text = raw.trim()
  const fenceMatch = text.match(/^```(?:json)?\s*([\s\S]*?)```$/i)
  if (fenceMatch) return fenceMatch[1].trim()
  return text
}

export function parseParticleJson(
  raw: string,
): { deck?: ParticleDeck; errors: string[] } {
  let parsed: unknown
  try {
    parsed = JSON.parse(stripJsonWrapper(raw))
  } catch {
    return { errors: ['JSON không hợp lệ — kiểm tra cú pháp'] }
  }
  return validateParticleDeck(parsed)
}

export function flattenParticleDeck(deck: ParticleDeck): FlatParticleSentence[] {
  const flat: FlatParticleSentence[] = []
  let index = 0

  for (const group of deck.groups) {
    for (const sentence of group.sentences) {
      flat.push({
        globalIndex: index,
        pair: group.pair,
        meaning: sentence.meaning,
        template: sentence.template,
        blanks: sentence.blanks,
      })
      index += 1
    }
  }

  return flat
}

export function shuffledOrder(count: number): number[] {
  const order = Array.from({ length: count }, (_, i) => i)
  for (let i = order.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  return order
}

export function getOrderedSentences(
  deck: ParticleDeck,
  sentenceOrder?: number[],
): FlatParticleSentence[] {
  const flat = flattenParticleDeck(deck)
  if (!sentenceOrder || sentenceOrder.length !== flat.length) {
    return flat
  }
  return sentenceOrder.map((i) => flat[i])
}

export function particleDeckFingerprint(deck: ParticleDeck): string {
  return `${deck.title}::${flattenParticleDeck(deck).length}`
}

export function checkParticleSentence(
  sentence: FlatParticleSentence,
  userAnswers: string[],
): ParticleCheckResult {
  const results = sentence.blanks.map((blank, blankIndex) => {
    const userAnswer = userAnswers[blankIndex] ?? ''
    return {
      blankIndex,
      userAnswer,
      correctAnswer: blank.answer,
      explanation: blank.explanation,
      isCorrect: answersMatch(userAnswer, blank.answer),
    }
  })

  return {
    globalIndex: sentence.globalIndex,
    results,
    allCorrect: results.every((r) => r.isCorrect),
  }
}
