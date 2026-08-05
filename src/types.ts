export type FormKey =
  | 'masu'
  | 'nai'
  | 'te'
  | 'ta'
  | 'dictionary'
  | 'volitional'
  | 'potential'
  | 'passive'
  | 'causative'
  | 'causative_passive'
  | 'imperative'
  | 'conditional_ba'
  | 'conditional_tara'
  | 'hypothetical_nara'
  | 'prohibitive_na'
  | 'masen'
  | 'mashita'
  | 'nakatta'
  | 'masen_deshita'
  | 'teiru'

export interface VerbAnswers {
  [key: string]: string
}

export interface VerbExamples {
  [key: string]: string
}

export interface Verb {
  kanji: string
  reading: string
  meaning: string
  answers: VerbAnswers
  examples: VerbExamples
}

export interface VerbGroup {
  id: number
  name: string
  verbs: Verb[]
}

export interface Deck {
  title: string
  groups: VerbGroup[]
}

export interface FlatVerb {
  globalIndex: number
  groupId: number
  groupName: string
  kanji: string
  reading: string
  meaning: string
  answers: VerbAnswers
  examples: VerbExamples
}

export interface FieldResult {
  formKey: FormKey
  userAnswer: string
  correctAnswer: string
  isCorrect: boolean
}

export interface VerbCheckResult {
  globalIndex: number
  kanji: string
  results: FieldResult[]
  allCorrect: boolean
}

export interface SessionState {
  deck: Deck
  deckFingerprint: string
  currentVerbIndex: number
  userAnswers: Record<number, Partial<Record<FormKey, string>>>
  checkResults: Record<number, VerbCheckResult>
  completed: boolean
  uploadedAt: string
}

export type AppView = 'prompt' | 'upload' | 'exercise' | 'results'
