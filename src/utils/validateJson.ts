import { FORM_KEYS } from '../constants'
import type { Deck, FlatVerb, VerbGroup } from '../types'

export function flattenDeck(deck: Deck): FlatVerb[] {
  const flat: FlatVerb[] = []
  let index = 0

  for (const group of deck.groups) {
    for (const verb of group.verbs) {
      flat.push({
        globalIndex: index,
        groupId: group.id,
        groupName: group.name,
        kanji: verb.kanji,
        reading: verb.reading,
        meaning: verb.meaning,
        answers: verb.answers,
        examples: verb.examples,
      })
      index += 1
    }
  }

  return flat
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function validateVerb(
  verb: unknown,
  groupLabel: string,
  verbIndex: number,
): string[] {
  const errors: string[] = []

  if (!isObject(verb)) {
    return [`${groupLabel}, động từ #${verbIndex + 1}: không phải object`]
  }

  for (const field of ['kanji', 'reading', 'meaning'] as const) {
    if (typeof verb[field] !== 'string' || !verb[field].trim()) {
      errors.push(`${groupLabel}, động từ #${verbIndex + 1}: thiếu "${field}"`)
    }
  }

  if (!isObject(verb.answers)) {
    errors.push(`${groupLabel}, động từ #${verbIndex + 1}: thiếu "answers"`)
    return errors
  }

  for (const key of FORM_KEYS) {
    const value = verb.answers[key]
    if (typeof value !== 'string' || !value.trim()) {
      errors.push(
        `${groupLabel}, "${verb.kanji ?? '?'}": thiếu đáp án cho "${key}"`,
      )
    }
  }

  if (!isObject(verb.examples)) {
    errors.push(`${groupLabel}, động từ #${verbIndex + 1}: thiếu "examples"`)
    return errors
  }

  for (const key of FORM_KEYS) {
    const value = verb.examples[key]
    if (typeof value !== 'string' || !value.trim()) {
      errors.push(
        `${groupLabel}, "${verb.kanji ?? '?'}": thiếu câu ví dụ cho "${key}"`,
      )
    }
  }

  return errors
}

function validateGroup(group: unknown, index: number): string[] {
  const errors: string[] = []
  const label = `Nhóm #${index + 1}`

  if (!isObject(group)) {
    return [`${label}: không phải object`]
  }

  if (typeof group.id !== 'number') {
    errors.push(`${label}: thiếu "id" (number)`)
  }

  if (typeof group.name !== 'string' || !group.name.trim()) {
    errors.push(`${label}: thiếu "name"`)
  }

  if (!Array.isArray(group.verbs)) {
    errors.push(`${label}: thiếu "verbs" (array)`)
    return errors
  }

  group.verbs.forEach((verb, verbIndex) => {
    errors.push(...validateVerb(verb, label, verbIndex))
  })

  return errors
}

export function validateDeck(data: unknown): { deck?: Deck; errors: string[] } {
  const errors: string[] = []

  if (!isObject(data)) {
    return { errors: ['JSON root phải là object'] }
  }

  if (typeof data.title !== 'string' || !data.title.trim()) {
    errors.push('Thiếu "title" (string)')
  }

  if (!Array.isArray(data.groups)) {
    errors.push('Thiếu "groups" (array)')
    return { errors }
  }

  if (data.groups.length === 0) {
    errors.push('"groups" không được rỗng')
  }

  const groupIds = new Set<number>()
  data.groups.forEach((group, index) => {
    errors.push(...validateGroup(group, index))
    if (isObject(group) && typeof group.id === 'number') {
      groupIds.add(group.id)
    }
  })

  for (const requiredId of [1, 2, 3]) {
    if (!groupIds.has(requiredId)) {
      errors.push(`Thiếu nhóm id=${requiredId} (cần đủ 3 nhóm)`)
    }
  }

  const totalVerbs = data.groups.reduce((sum, g) => {
    if (isObject(g) && Array.isArray(g.verbs)) return sum + g.verbs.length
    return sum
  }, 0)

  if (totalVerbs === 0) {
    errors.push('Không có động từ nào trong bộ đề')
  }

  if (errors.length > 0) {
    return { errors }
  }

  return { deck: data as unknown as Deck, errors: [] }
}

export function stripJsonWrapper(raw: string): string {
  const text = raw.trim()
  const fenceMatch = text.match(/^```(?:json)?\s*([\s\S]*?)```$/i)
  if (fenceMatch) return fenceMatch[1].trim()
  return text
}

export function parseDeckJson(raw: string): { deck?: Deck; errors: string[] } {
  let parsed: unknown

  try {
    parsed = JSON.parse(stripJsonWrapper(raw))
  } catch {
    return { errors: ['JSON không hợp lệ — kiểm tra cú pháp'] }
  }

  return validateDeck(parsed)
}

export function deckFingerprint(deck: Deck): string {
  return `${deck.title}::${flattenDeck(deck).length}`
}

export function getGroupSummary(groups: VerbGroup[]): string {
  return groups
    .map((g) => `${g.name}: ${g.verbs.length} từ`)
    .join(' · ')
}
