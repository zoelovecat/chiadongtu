import type { FormKey } from './types'

export const FORM_HINTS: Record<FormKey, string> = {
  masu: `Thể lịch sự (hiện tại / tương lai)

Nhóm 1 (godan): đuôi u → i + ます
　かく → かきます / はなす → はなします

Nhóm 2 (ichidan): bỏ る + ます
　たべる → たべます / みる → みます

Nhóm 3: する→します / くる→きます / いく→いきます`,

  nai: `Phủ định thân mật (〜ない)

Nhóm 1 (godan): đuôi u → a + ない
　かく → かかない / はなす → はなさない

Nhóm 2 (ichidan): bỏ る + ない
　たべる → たべない

Nhóm 3: する→しない / くる→こない / いく→いかない`,

  te: `Thể て — nối ngữ pháp (〜ている, 〜てください…)

Nhóm 1 (godan):
　う・つ・る → って　(かう→かって, まつ→まって)
　む・ぶ・ぬ → んで　(よむ→よんで, あそぶ→あそんで)
　く → いて　(かく→かいて)
　ぐ → いで　(およぐ→およいで)
　す → して　(はなす→はなして)

Nhóm 2 (ichidan): bỏ る + て
　たべる → たべて

Nhóm 3: する→して / くる→きて / いく→いって`,

  ta: `Quá khứ thân mật (〜た) — quy tắc giống thể て, đổi đuôi cuối:

Nhóm 1 (godan):
　って→った / んで→んだ
　いて→いた / いで→いだ / して→した

Nhóm 2 (ichidan): て → た
　たべて → たべた

Nhóm 3: して→した / きて→きた / いって→いった`,

  dictionary: `辞書形 — dạng nguyên thể (tra từ điển)

Nhóm 1 (godan): giữ nguyên
　かく / はなす / よむ

Nhóm 2 (ichidan): giữ nguyên
　たべる / みる

Nhóm 3: する / くる / いく`,

  volitional: `Thể ý chí (〜う / 〜よう) — "hãy cùng…", "tôi sẽ…"

Nhóm 1 (godan): đuôi u → o + う
　かく → かこう / はなす → はなそう

Nhóm 2 (ichidan): る → よう
　たべる → たべよう

Nhóm 3: する→しよう / くる→こよう / いく→いこう`,

  potential: `Thể khả năng (〜られる / 〜える) — "có thể"

Nhóm 1 (godan): e hàng + る
　かく → かける / はなす → はなせる

Nhóm 2 (ichidan): る → られる
　たべる → たべられる

Nhóm 3: する→できる / くる→こられる / いく→いける`,

  passive: `Thể bị động (〜られる) — "bị / được"

Nhóm 1 (godan): a hàng + れる
　かく → かかれる / はなす → はなされる

Nhóm 2 (ichidan): る → られる
　たべる → たべられる

Nhóm 3: する→される / くる→こられる / いく→いかれる`,

  causative: `Thể sai khiến (〜させる) — "bắt / cho ai làm"

Nhóm 1 (godan): a hàng + せる
　かく → かかせる / はなす → はなさせる

Nhóm 2 (ichidan): る → させる
　たべる → たべさせる

Nhóm 3: する→させる / くる→こさせる / いく→いかせる`,

  causative_passive: `Sai khiến bị động (〜させられる) — "bị bắt phải làm"

Nhóm 1 (godan): a hàng + せられる
　かく → かかせられる

Nhóm 2 (ichidan): る → させられる
　たべる → たべさせられる

Nhóm 3: する→させられる / くる→こさせられる`,

  imperative: `Thể mệnh lệnh — mạnh, dùng cẩn thận

Nhóm 1 (godan): e hàng
　かく → かけ / はなす → はなせ

Nhóm 2 (ichidan): る → ろ
　たべる → たべろ

Nhóm 3: する→しろ(せよ) / くる→こい / いく→いけ`,

  conditional_ba: `Điều kiện ば (〜ば) — "nếu… thì"

Nhóm 1 (godan): e hàng + ば
　かく → かけば / はなす → はなせば

Nhóm 2 (ichidan): る → れば
　たべる → たべれば

Nhóm 3: する→すれば / くる→くれば / いく→いけば`,

  conditional_tara: `Điều kiện たら — thường = thể た + ら

Nhóm 1: chia た (như quy tắc thể た) + ら
　かいた → かいたら / はなした → はなしたら

Nhóm 2: た + ら
　たべた → たべたら

Nhóm 3: した→したら / きた→きたら / いった→いったら`,

  hypothetical_nara: `Giả định なら — thể từ điển + なら

Nhóm 1: かく → かくなら / はなす → はなすなら
Nhóm 2: たべる → たべるなら
Nhóm 3: する→するなら / くる→くるなら / いく→いくなら`,

  prohibitive_na: `Thể cấm な — thể từ điển + な ("không được!")

Nhóm 1: かく → かくな / はなす → はなすな
Nhóm 2: たべる → たべるな
Nhóm 3: する→するな / くる→くるな / いく→いくな`,

  masen: `Lịch sự phủ định (〜ません)

Chia thể ます trước, rồi đổi ます → ません

Nhóm 1: かきます → かきません
Nhóm 2: たべます → たべません
Nhóm 3: します→しません / きます→きません`,

  mashita: `Quá khứ lịch sự (〜ました)

Chia thể ます trước, rồi đổi ます → ました

Nhóm 1: かきます → かきました
Nhóm 2: たべます → たべました
Nhóm 3: します→しました / きます→きました`,

  nakatta: `Quá khứ phủ định thân mật (〜なかった)

Chia thể ない trước, rồi ない → なかった

Nhóm 1: かかない → かかなかった
Nhóm 2: たべない → たべなかった
Nhóm 3: しない→しなかった / こない→こなかった`,

  masen_deshita: `Quá khứ lịch sự phủ định (〜ませんでした)

Chia ません trước, rồi ません → ませんでした

Nhóm 1: かきません → かきませんでした
Nhóm 2: たべません → たべませんでした
Nhóm 3: しません→しませんでした`,

  teiru: `Đang làm / trạng thái (〜ている)

Chia thể て trước, rồi + いる

Nhóm 1: かいて → かいている / はなして → はなしている
Nhóm 2: たべて → たべている
Nhóm 3: して→している / きて→きている / いって→いっている`,
}
