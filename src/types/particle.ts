export interface ParticleBlank {
  answer: string
  explanation: string
}

export interface ParticleSentence {
  meaning: string
  template: string
  blanks: ParticleBlank[]
}

export interface ParticleGroup {
  pair: string
  sentences: ParticleSentence[]
}

export interface ParticleDeck {
  title: string
  focus_pairs: string[]
  groups: ParticleGroup[]
}

export interface FlatParticleSentence {
  globalIndex: number
  pair: string
  meaning: string
  template: string
  blanks: ParticleBlank[]
}

export interface ParticleBlankResult {
  blankIndex: number
  userAnswer: string
  correctAnswer: string
  explanation: string
  isCorrect: boolean
}

export interface ParticleCheckResult {
  globalIndex: number
  results: ParticleBlankResult[]
  allCorrect: boolean
}

export interface ParticleSessionState {
  deck: ParticleDeck
  deckFingerprint: string
  sentenceOrder: number[]
  currentIndex: number
  userAnswers: Record<number, string[]>
  checkResults: Record<number, ParticleCheckResult>
  completed: boolean
  uploadedAt: string
}

export type ParticleView = 'prompt' | 'upload' | 'exercise' | 'results'
