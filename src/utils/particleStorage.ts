import type { ParticleSessionState } from '../types/particle'
import { flattenParticleDeck } from './particleJson'

const STORAGE_KEY = 'chiathedongtu-particle-session'

function normalizeSession(session: ParticleSessionState): ParticleSessionState {
  if (!session.sentenceOrder && session.deck) {
    const flat = flattenParticleDeck(session.deck)
    return {
      ...session,
      sentenceOrder: Array.from({ length: flat.length }, (_, i) => i),
    }
  }
  return session
}

export function loadParticleSession(): ParticleSessionState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return normalizeSession(JSON.parse(raw) as ParticleSessionState)
  } catch {
    return null
  }
}

export function saveParticleSession(session: ParticleSessionState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeSession(session)))
}

export function clearParticleSession(): void {
  localStorage.removeItem(STORAGE_KEY)
}
