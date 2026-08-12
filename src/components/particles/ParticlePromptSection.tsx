import { useState } from 'react'
import {
  PARTICLE_PROMPT_TEMPLATE,
  PARTICLE_SCHEMA_HINT,
} from '../../particleConstants'

export function ParticlePromptSection() {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(PARTICLE_PROMPT_TEMPLATE)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>Prompt trợ từ</h1>
        <p>
          Copy prompt vào AI để tạo bộ đề trợ từ (cặp dễ nhầm). Lưu JSON rồi
          nạp ở tab <strong>Làm bài</strong> bên trên.
        </p>
      </header>

      <div className="prompt-actions">
        <button type="button" className="btn btn-primary" onClick={handleCopy}>
          {copied ? 'Đã copy!' : 'Copy prompt'}
        </button>
      </div>

      <pre className="prompt-box">{PARTICLE_PROMPT_TEMPLATE}</pre>

      <section className="hint-box">
        <h2>Cấu trúc JSON</h2>
        <p>{PARTICLE_SCHEMA_HINT}</p>
        <p className="muted">
          Mỗi câu có thể nhiều chỗ trống (___). Đáp án gõ bằng hiragana.
        </p>
      </section>
    </div>
  )
}
