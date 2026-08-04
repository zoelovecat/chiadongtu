import type { FormKey } from './types'

export const CONJUGATION_FORMS: { key: FormKey; label: string }[] = [
  { key: 'masu', label: 'Thể ます' },
  { key: 'nai', label: 'Thể ない' },
  { key: 'te', label: 'Thể て' },
  { key: 'ta', label: 'Thể た' },
  { key: 'dictionary', label: 'Thể từ điển (辞書形)' },
  { key: 'volitional', label: 'Thể ý chí (Volitional)' },
  { key: 'potential', label: 'Thể khả năng (Potential)' },
  { key: 'passive', label: 'Thể bị động (Passive)' },
  { key: 'causative', label: 'Thể sai khiến (Causative)' },
  { key: 'causative_passive', label: 'Thể sai khiến bị động (Causative Passive)' },
  { key: 'imperative', label: 'Thể mệnh lệnh (Imperative)' },
  { key: 'conditional_ba', label: 'Thể điều kiện ば' },
  { key: 'conditional_tara', label: 'Thể điều kiện たら' },
  { key: 'hypothetical_nara', label: 'Thể giả định ～なら' },
  { key: 'prohibitive_na', label: 'Thể cấm (～な)' },
  { key: 'masen', label: 'Thể lịch sự phủ định (ません)' },
  { key: 'mashita', label: 'Thể quá khứ lịch sự (ました)' },
  { key: 'nakatta', label: 'Thể quá khứ phủ định (なかった)' },
  { key: 'masen_deshita', label: 'Thể phủ định lịch sự quá khứ (ませんでした)' },
  { key: 'teiru', label: 'Thể diễn tả đang làm (～ている)' },
]

export const FORM_KEYS: FormKey[] = CONJUGATION_FORMS.map((f) => f.key)

export const PROMPT_TEMPLATE = `Tôi muốn làm bài tập chia thể động từ. Mỗi động từ hiển thị kanji, cách đọc (reading) và nghĩa tiếng Việt — nhưng tôi sẽ VIẾT ĐÁP ÁN bằng hiragana. Bạn hãy tạo đề bài gồm tất cả các thể; tôi sẽ điền hiragana và app sẽ chấm tự động.

Hãy dùng các từ thường dùng trong cuộc sống và làm việc. Mỗi lần ra đề bài hãy random và đảm bảo đầy đủ 3 nhóm từ (nhóm 1: godan/五段, nhóm 2: ichidan/一段, nhóm 3: bất quy tắc).

QUAN TRỌNG — quy tắc hiragana:
- "kanji", "reading", "meaning": giữ nguyên (kanji + hiragana reading + nghĩa tiếng Việt) để hiển thị đề bài.
- Tất cả giá trị trong "answers": CHỈ dùng hiragana, KHÔNG dùng kanji hay katakana.
- Ví dụ: "masu": "かきます" (đúng), KHÔNG phải "書きます" (sai).

Trả về DUY NHẤT một file JSON hợp lệ (không markdown, không giải thích thêm) theo schema sau:

{
  "title": "Tên bộ đề",
  "groups": [
    {
      "id": 1,
      "name": "Nhóm 1 - Godan (五段)",
      "verbs": [
        {
          "kanji": "書く",
          "reading": "かく",
          "meaning": "viết",
          "answers": {
            "masu": "かきます",
            "nai": "かかない",
            "te": "かいて",
            "ta": "かいた",
            "dictionary": "かく",
            "volitional": "かこう",
            "potential": "かける",
            "passive": "かかれる",
            "causative": "かかせる",
            "causative_passive": "かかせられる",
            "imperative": "かけ",
            "conditional_ba": "かけば",
            "conditional_tara": "かいたら",
            "hypothetical_nara": "かくなら",
            "prohibitive_na": "かくな",
            "masen": "かきません",
            "mashita": "かきました",
            "nakatta": "かかなかった",
            "masen_deshita": "かきませんでした",
            "teiru": "かいている"
          }
        }
      ]
    },
    {
      "id": 2,
      "name": "Nhóm 2 - Ichidan (一段)",
      "verbs": []
    },
    {
      "id": 3,
      "name": "Nhóm 3 - Bất quy tắc",
      "verbs": []
    }
  ]
}

Mỗi động từ PHẢI có đủ 20 key trong "answers": masu, nai, te, ta, dictionary, volitional, potential, passive, causative, causative_passive, imperative, conditional_ba, conditional_tara, hypothetical_nara, prohibitive_na, masen, mashita, nakatta, masen_deshita, teiru.

Mỗi nhóm có ít nhất 3-4 động từ. Tổng cộng khoảng 10-12 động từ.`

export const JSON_SCHEMA_HINT = `Hiển thị đề: kanji + reading (hiragana) + meaning (tiếng Việt).
Đáp án trong answers: chỉ hiragana.

Các key bắt buộc trong answers:
masu, nai, te, ta, dictionary, volitional, potential, passive, causative,
causative_passive, imperative, conditional_ba, conditional_tara,
hypothetical_nara, prohibitive_na, masen, mashita, nakatta,
masen_deshita, teiru`
