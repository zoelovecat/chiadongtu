export const PARTICLE_PROMPT_TEMPLATE = `Tôi muốn làm bài tập trợ từ tiếng Nhật. Tôi hay nhầm trợ từ, hãy tạo bài tập giúp tôi luyện tập.

Yêu cầu:
- CHỈ tập trung 2 cặp dễ nhầm: は vs が và に vs で.
- KHÔNG gom theo cặp trong câu hỏi — trộn ngẫu nhiên các câu của cả hai cặp (người làm bài không được biết trước đang luyện cặp nào).
- Mỗi câu có thể có nhiều chỗ trống (2+ trợ từ trong cùng câu khi hợp lý).
- Câu dùng trong cuộc sống / công việc, tự nhiên.
- Template dùng "___" cho mỗi chỗ trống, theo đúng thứ tự trong "blanks".
- "answer": CHỈ hiragana — trong phạm vi bài này chỉ dùng: は, が, に, で (và を nếu cần làm tân ngữ trong câu, nhưng KHÔNG ra đề so sánh を vs が).
- "explanation": giải thích ngắn bằng tiếng Việt, nhấn mạnh tại sao dùng trợ từ này (so với trợ từ dễ nhầm trong cùng cặp).

Trả về DUY NHẤT một file JSON hợp lệ (không markdown, không giải thích thêm):

{
  "title": "Trợ từ — Luyện は・が・に・で",
  "focus_pairs": ["は vs が", "に vs で"],
  "groups": [
    {
      "pair": "は vs が",
      "sentences": [
        {
          "meaning": "Tôi là nhân viên",
          "template": "私___会社員です。",
          "blanks": [
            {
              "answer": "は",
              "explanation": "は = chủ đề câu. が dùng khi đưa thông tin mới."
            }
          ]
        }
      ]
    },
    {
      "pair": "に vs で",
      "sentences": [
        {
          "meaning": "Tôi sống ở Tokyo",
          "template": "東京___住んでいます。",
          "blanks": [
            {
              "answer": "に",
              "explanation": "に = nơi tồn tại/sống. で = nơi diễn ra hành động."
            }
          ]
        },
        {
          "meaning": "Đi công ty bằng xe bus",
          "template": "バス___会社___行きます。",
          "blanks": [
            {
              "answer": "で",
              "explanation": "で = phương tiện di chuyển."
            },
            {
              "answer": "に",
              "explanation": "に = đích đến."
            }
          ]
        }
      ]
    }
  ]
}

Mỗi group 4–6 câu. Chỉ 2 group (は/が và に/で). Trộn thứ tự câu đa dạng. Số "___" PHẢI bằng số phần tử trong "blanks".`

export const PARTICLE_SCHEMA_HINT = `Schema: title, focus_pairs[], groups[].
Chỉ 2 cặp: は vs が, に vs で. pair trong JSON dùng nội bộ — app không hiện khi làm bài.
Mỗi sentence: meaning, template (___), blanks[] (answer + explanation).
Đáp án chủ yếu: は, が, に, で.`
