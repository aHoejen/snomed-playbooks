# SNOMED Playbooks

## Project layout

**`navigator/`** — Public-facing website (SNOMED CT Implementation Navigator). Static HTML/CSS/JS served via nginx or GitHub Pages. Content lives in `navigator/data/` as JSON (`questions.json`, `playbooks.json`, `answers.json`).

**`wiki/`** — Distilled reference material and summaries. Use as the source of knowledge when generating or updating website content in `navigator/`.

When adding or revising navigator content, draw from `wiki/` for accuracy and consistency; keep the website concise and actionable for implementers.
