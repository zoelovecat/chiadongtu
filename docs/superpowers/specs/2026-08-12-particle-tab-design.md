# Tab Trợ từ — Design Spec

## Goal

Add a third nav tab for particle exercises: AI-generated JSON, multi-blank sentences, hiragana input, focus on confusion pairs (は↔が, に↔で, へ↔に, を↔が), short Vietnamese explanations on wrong answers.

## Flow

Tab **Trợ từ** → Prompt copy → Paste/upload JSON → Sentence-by-sentence exercise → Check → Results. Progress saved in localStorage (separate key from verb deck).

## JSON Schema

- `title`, `focus_pairs[]`, `groups[]`
- Each group: `pair`, `sentences[]`
- Each sentence: `meaning`, `template` (use `___` per blank in order), `blanks[]` with `answer` (hiragana) and `explanation` (Vietnamese)

## UI

- Inline inputs replace `___` in template
- Check marks all blanks; wrong fields show correct answer + explanation
- Normalized grading (hiragana/katakana, trim)

## Out of Scope

Static particle dictionary, merged upload with verb decks.
