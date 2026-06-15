# SNOMED CT Implementation Navigator

A static web application for navigating SNOMED CT implementation playbooks.

## Structure

```
navigator/
├── index.html          Main page shell
├── styles.css          All styles and design tokens
├── app.js              Application logic (routing, search, rendering)
└── data/
    ├── questions.json  74 implementation questions
    └── playbooks.json  12 detailed playbooks
```

## Running locally (Python)

The app uses `fetch()` to load JSON files, so it must be served over HTTP — opening `index.html` directly from the file system won't work.

**Quickest way — run the included script:**
```bash
cd navigator
./serve.sh
```

Open [http://localhost:8080](http://localhost:8080) — done. Edit any file and just refresh the browser.

**Or run Python directly:**
```bash
cd navigator
python3 -m http.server 8080
# then open http://localhost:8080
```

**Node / npx:**
```bash
npx serve navigator
```

**VS Code:** Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension and click "Go Live".

## Deployment

### GitHub Pages

1. Push the `navigator/` folder contents to a GitHub repository.
2. Go to **Settings → Pages → Source** and select the branch and `/ (root)` folder.
3. Your site will be live at `https://<username>.github.io/<repo>/`.

### Netlify

1. Drag the `navigator/` folder onto [app.netlify.com/drop](https://app.netlify.com/drop).
2. Your site is live instantly with a `*.netlify.app` URL.
3. For a custom domain, connect the repo and configure DNS as prompted.

## Editing content (no code required)

All content lives in `data/` as JSON files — edit these to update the navigator.

### Adding or editing a question (`data/questions.json`)

Each question is one object in the array:

```json
{
  "id": "Q075",
  "text": "How do we handle retired concepts in legacy data?",
  "perspective": "capability",
  "category": "Terminology Service",
  "playbook": "term-service"
}
```

Fields:
- `id` — unique identifier (Q001–Q999)
- `text` — the question as displayed
- `perspective` — one of `useCase`, `capability`, `role`
- `category` — the filter category shown in browse view
- `playbook` — the playbook ID this question maps to

### Adding or editing a playbook (`data/playbooks.json`)

Each playbook is keyed by its ID. Full structure:

```json
"my-playbook-id": {
  "title": "Short title",
  "subtitle": "One-line description",
  "icon": "server",
  "color": "blue",
  "audience": ["Architect", "Terminologist"],
  "overview": "One or two paragraphs explaining the playbook.",
  "decisions": [
    {
      "question": "What approach should we take?",
      "options": ["Option A", "Option B", "Option C"]
    }
  ],
  "steps": [
    {
      "title": "Step title",
      "description": "What to do and why."
    }
  ],
  "dependencies": [
    { "icon": "server", "text": "Terminology service" }
  ],
  "pitfalls": [
    "Description of something that commonly goes wrong."
  ],
  "resources": [
    {
      "type": "Guide",
      "title": "Resource title",
      "url": "https://docs.snomed.org/..."
    }
  ]
}
```

**Available `color` values:** `blue`, `teal`, `green`, `amber`, `red`, `purple`, `gray`

**Available `icon` values (dependency icons):** `server`, `filter`, `shield`, `database`, `key`, `cloud`, `lock`, `users`, `language`, `code`, `certificate`, `file-import`, `file-description`, `id-badge`, `clipboard-list`

## URL structure (deep linking)

All routes use hash-based navigation — no server configuration needed:

| URL | Page |
|-----|------|
| `index.html#/` | Landing page |
| `index.html#/browse/useCase` | Use case questions |
| `index.html#/browse/capability` | Capability questions |
| `index.html#/browse/role` | Role questions |
| `index.html#/browse/useCase/Problem%20List` | Filtered browse |
| `index.html#/playbook/problem-list` | Specific playbook |
| `index.html#/search/allergy` | Search results |

All these URLs are shareable and bookmarkable.

## Adding a new playbook to the order

Edit the `PLAYBOOK_ORDER` array near the top of `app.js` to control the order in which playbooks appear in the landing chips.
