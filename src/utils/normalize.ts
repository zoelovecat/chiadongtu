/** Chuyển katakana full-width sang hiragana để so sánh linh hoạt. */
function katakanaToHiragana(input: string): string {
  return input.replace(/[\u30a1-\u30f6]/g, (char) =>
    String.fromCharCode(char.charCodeAt(0) - 0x60),
  )
}

/** Chuẩn hóa đáp án trước khi so sánh. */
export function normalizeAnswer(input: string): string {
  return katakanaToHiragana(input.trim().normalize('NFKC'))
}

export function answersMatch(user: string, correct: string): boolean {
  return normalizeAnswer(user) === normalizeAnswer(correct)
}
