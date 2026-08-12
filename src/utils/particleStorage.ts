import type { ParticleSessionState } from '../types/particle'

const STORAGE_KEY = 'chiathedongtu-particle-session'

export function loadParticleSession(): ParticleSessionState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as ParticleSessionState
  } catch {
    return null
  }
}

export function saveParticleSession(session: ParticleSessionState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

export function clearParticleSession(): void {
  localStorage.removeItem(STORAGE_KEY)
}
