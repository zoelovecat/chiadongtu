# chiadongtu

App luyện chia thể động từ tiếng Nhật — paste/upload JSON từ AI, làm bài từng động từ, chấm tự động.

## Chạy local

```bash
npm install
npm run dev
```

## Deploy (GitHub Pages)

1. Vào **Settings → Pages** của repo: https://github.com/zoelovecat/chiadongtu/settings/pages
2. **Build and deployment → Source:** chọn **Deploy from a branch**
3. **Branch:** `gh-pages` · folder **`/ (root)`** → **Save**
4. Đợi 1–2 phút sau khi push `main` (Actions tự build & đẩy lên `gh-pages`)

**Live:** https://zoelovecat.github.io/chiadongtu/

## Cách dùng

1. Tab **Prompt mẫu** → copy prompt → dán vào AI
2. AI trả JSON → dán hoặc upload file ở tab **Làm bài**
3. Điền các thể bằng hiragana → **Kiểm tra** → **Tiếp theo**
