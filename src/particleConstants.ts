export const PARTICLE_PROMPT_TEMPLATE = `Tôi muốn làm bài tập trợ từ tiếng Nhật. Tôi hay nhầm các cặp trợ từ, hãy tạo bài tập giúp tôi luyện tập.

Yêu cầu:
- Tập trung vào các CẶP DỄ NHẦM: は vs が, に vs で, へ vs に, を vs が (và cặp khác nếu phù hợp).
- Mỗi câu có thể có NHIỀU chỗ trống (2+ trợ từ trong cùng câu khi hợp lý).
- Câu dùng trong cuộc sống / công việc, tự nhiên.
- Template dùng "___" cho mỗi chỗ trống, theo đúng thứ tự trong "blanks".
- "answer": CHỈ hiragana (に, で, は, が, を, へ, と, も…).
- "explanation": giải thích ngắn bằng tiếng Việt, nhấn mạnh tại sao dùng trợ từ này (so với cặp dễ nhầm).

Trả về DUY NHẤT một file JSON hợp lệ (không markdown, không giải thích thêm):

{
  "title": "Trợ từ — に vs で",
  "focus_pairs": ["に vs で"],
  "groups": [
    {
      "pair": "に vs で",
      "sentences": [
        {
          "meaning": "Tôi sống ở Tokyo",
          "template": "東京___住んでいます。",
          "blanks": [
            {
              "answer": "に",
              "explanation": "に = nơi tồn tại/sống. Không dùng で (で = phương tiện/hoạt động)."
            }
          ]
        },
        {
          "meaning": "Đi công ty bằng xe bus",
          "template": "バス___会社___行きます。",
          "blanks": [
            {
              "answer": "で",
              "explanation": "で = phương tiện di chuyển (bằng xe bus)."
            },
            {
              "answer": "に",
              "explanation": "に = đích đến (đến công ty)."
            }
          ]
        }
      ]
    }
  ]
}

Mỗi group có 4–6 câu. Bộ đề có 2–4 cặp trợ từ (mỗi cặp là 1 group). Số "___" trong template PHẢI bằng số phần tử trong "blanks".`

export const PARTICLE_SCHEMA_HINT = `Schema: title, focus_pairs[], groups[].
Mỗi group: pair, sentences[].
Mỗi sentence: meaning, template (dùng ___), blanks[] (answer hiragana + explanation tiếng Việt).
Số ___ phải khớp số blanks.`
