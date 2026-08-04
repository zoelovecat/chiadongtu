import { useState } from 'react'
import { JSON_SCHEMA_HINT, PROMPT_TEMPLATE } from '../constants'

export function PromptPage() {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(PROMPT_TEMPLATE)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>Prompt mẫu</h1>
        <p>
          Copy prompt này vào AI (ChatGPT, Claude, Gemini…). AI sẽ tạo file JSON
          — bạn lưu file đó rồi upload ở tab <strong>Làm bài</strong>.
        </p>
      </header>

      <div className="prompt-actions">
        <button type="button" className="btn btn-primary" onClick={handleCopy}>
          {copied ? 'Đã copy!' : 'Copy prompt'}
        </button>
      </div>

      <pre className="prompt-box">{PROMPT_TEMPLATE}</pre>

      <section className="hint-box">
        <h2>Cấu trúc JSON</h2>
        <p>{JSON_SCHEMA_HINT}</p>
        <p className="muted">
          Bạn viết đáp án bằng hiragana. App chấm linh hoạt: hiragana/katakana
          tương đương, bỏ khoảng trắng thừa.
        </p>
      </section>
    </div>
  )
}
