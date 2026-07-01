/* ─────────────────────────────────────────────────────────────────────
   SNOMED CT Implementation Navigator
   Vanilla JS SPA — hash-based routing, search, deep linking
   ───────────────────────────────────────────────────────────────────── */

'use strict';

// ── State ───────────────────────────────────────────────────────────────
const state = {
  questions: [],
  playbooks: {},
  answers: {},
  loaded: false,
};

// ── Colour / icon maps ───────────────────────────────────────────────────
// Colours map directly to the SNOMED International brand palette:
//   blue    = Blumine #12506B / Cerulean #00A9E0
//   teal    = Eastern Blue #25ACB8
//   green   = Silver Tree #6DBBA1
//   amber   = Sea Buckthorn #F8A73D
//   orange  = Di Serria #DE8345
//   red     = Mandy #CE0037
//   purple  = Deluge #8072AC
//   camelot = Camelot #8D3057
//   gray    = River Bed #434A55
const PERSPECTIVE = {
  useCase:    { label: 'Use case',   color: 'blue',   icon: 'target',  count: 0 },
  capability: { label: 'Capability', color: 'teal',   icon: 'puzzle',  count: 0 },
  role:       { label: 'Role',       color: 'purple', icon: 'users',   count: 0 },
};

const PLAYBOOK_ORDER = [
  'problem-list','clin-docs','cds','analytics','interop',
  'value-sets','term-service','search-ux','mapping','governance',
  'extensions','multilingual'
];

// ── SVG icon helper ──────────────────────────────────────────────────────
const ICONS = {
  target:         `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
  puzzle:         `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.856.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.23 8.77c.24-.24.581-.353.917-.303.515.077.877.528 1.073 1.01a2.5 2.5 0 1 0 3.259-3.259c-.482-.196-.933-.558-1.01-1.073-.05-.336.062-.676.303-.917l1.525-1.525A2.402 2.402 0 0 1 12 2c.617 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.237 3.237c-.464.18-.894.527-.967 1.02z"/></svg>`,
  users:          `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  search:         `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`,
  'arrow-left':   `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>`,
  'arrow-right':  `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
  'git-branch':   `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" x2="6" y1="3" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>`,
  stairs:         `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21 9 9l4 4 4-12 3 9"/></svg>`,
  plug:           `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"/></svg>`,
  warning:        `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`,
  books:          `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>`,
  file:           `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>`,
  server:         `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>`,
  filter:         `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>`,
  shield:         `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`,
  database:       `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/></svg>`,
  key:            `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></svg>`,
  cloud:          `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>`,
  lock:           `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  users2:         `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  language:       `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>`,
  code:           `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  certificate:    `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`,
  'clipboard-list': `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>`,
  'file-import':  `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="m9 15 3 3 3-3"/></svg>`,
  'file-description': `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>`,
  'id-badge':     `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="18" x="5" y="3" rx="2"/><circle cx="12" cy="10" r="2"/><path d="M9 18h6"/></svg>`,
  'check-circle': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>`,
  'list-check':   `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 7 3 3 4-4"/><path d="m3 17 3 3 4-4"/><path d="M14 8h7"/><path d="M14 18h7"/></svg>`,
  stethoscope:    `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>`,
  clock:          `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  globe:          `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  'arrow-up':     `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="19" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>`,
};

function icon(name, size = 16) {
  const svg = ICONS[name] || ICONS.file;
  return svg.replace(/width="\d+"/, `width="${size}"`).replace(/height="\d+"/, `height="${size}"`);
}

// ── Data loading ─────────────────────────────────────────────────────────
async function loadData() {
  const [qRes, pbRes, aRes] = await Promise.all([
    fetch('data/questions.json'),
    fetch('data/playbooks.json'),
    fetch('data/answers.json'),
  ]);
  state.questions = await qRes.json();
  state.playbooks = await pbRes.json();
  state.answers  = await aRes.json();

  // Compute perspective counts
  state.questions.forEach(q => {
    if (PERSPECTIVE[q.perspective]) PERSPECTIVE[q.perspective].count++;
  });

  state.loaded = true;
  // Render in a try/catch so a rendering error doesn't show "Failed to load"
  try { route(); } catch (renderErr) {
    console.error('Render error:', renderErr);
    document.getElementById('main').innerHTML =
      `<div class="container" style="padding:80px 0;text-align:center">
        <p style="color:var(--red-text);font-size:15px;margin-bottom:8px">Rendering error — data loaded but could not be displayed.</p>
        <p style="color:var(--text-muted);font-size:13px">${renderErr.message}</p>
       </div>`;
  }
}

// ── Routing ──────────────────────────────────────────────────────────────
function navigate(hash) {
  window.location.hash = hash;
}

function route() {
  if (!state.loaded) return;
  const hash = window.location.hash.slice(1) || '/';
  const parts = hash.split('/').filter(Boolean);

  updateNavLinks(hash);
  closeSearch();

  if (!parts.length || parts[0] === '') return renderLanding();
  if (parts[0] === 'playbooks') return renderAllPlaybooks();
  if (parts[0] === 'browse' && parts[1]) return renderBrowse(parts[1], parts[2] ? decodeURIComponent(parts[2]) : null);
  if (parts[0] === 'question' && parts[1]) return renderQuestion(parts[1]);
  if (parts[0] === 'playbook' && parts[1]) return renderPlaybook(parts[1]);
  if (parts[0] === 'search' && parts[1]) return renderSearchPage(decodeURIComponent(parts[1]));
  renderLanding();
}

function updateNavLinks(hash) {
  document.querySelectorAll('.header-nav a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${hash}`);
  });
}

window.addEventListener('hashchange', route);

// ── Views ────────────────────────────────────────────────────────────────
function setView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function _prevHash() {
  // Used by back buttons to determine where to return
  return document.referrer ? history.back() : navigate('#/');
}

// ── Landing ──────────────────────────────────────────────────────────────
function renderLanding() {
  setView('view-landing');

  // Entry cards
  const grid = document.getElementById('entry-grid');
  grid.innerHTML = Object.entries(PERSPECTIVE).map(([key, p]) => `
    <a href="#/browse/${key}" class="entry-card">
      <div class="entry-card-icon c-${p.color}" style="background:var(--c-bg)">
        <span style="color:var(--c-text)">${icon(p.icon, 22)}</span>
      </div>
      <div class="entry-card-title">${p.label}</div>
      <div class="entry-card-desc">${entryDesc(key)}</div>
      <div class="entry-card-count c-${p.color}" style="color:var(--c-text)">${p.count} questions →</div>
    </a>
  `).join('');

  // Playbook chips
  const chips = document.getElementById('playbook-chips');
  chips.innerHTML = PLAYBOOK_ORDER.map(id => {
    const pb = state.playbooks[id];
    if (!pb) return '';
    return `<a href="#/playbook/${id}" class="chip c-${pb.color}" style="color:var(--c-text);background:var(--c-bg);border-color:var(--c-border)">${pb.title}</a>`;
  }).join('');
}

function entryDesc(p) {
  return {
    useCase:    'I have a specific goal — problem list, decision support, reporting',
    capability: 'I need to build something — value sets, mappings, services',
    role:       'Guide me based on my role — clinician, architect, terminologist',
  }[p];
}

// ── Browse ────────────────────────────────────────────────────────────────
function renderBrowse(perspective, activeFilter) {
  setView('view-browse');
  const p = PERSPECTIVE[perspective];
  if (!p) return renderLanding();

  const qs = state.questions.filter(q => q.perspective === perspective);
  const cats = [...new Set(qs.map(q => q.category))];

  document.getElementById('browse-title').innerHTML =
    `<span class="c-${p.color}" style="color:var(--c-text)">${icon(p.icon, 22)}</span> ${p.label} questions`;

  document.getElementById('browse-subtitle').textContent =
    `${qs.length} questions — select one to open its playbook`;

  // Role introductions
  const roleIntroEl = document.getElementById('role-intros');
  if (perspective === 'role') {
    const roles = [
      {
        name: 'Clinician',
        icon: 'stethoscope',
        description: 'Clinical professionals involved in defining requirements, reviewing terminology content, and validating that structured data accurately reflects clinical practice. Clinicians determine which data elements need to be captured, what level of granularity is meaningful, and whether the right concepts and terms are available for their specialty.'
      },
      {
        name: 'Software provider',
        icon: 'code',
        description: 'Technical teams responsible for designing and building systems that implement SNOMED CT — including EHR platforms, terminology services, FHIR endpoints, and data entry interfaces. Software providers make architectural decisions about how SNOMED CT is stored, queried, and surfaced to end users.'
      },
      {
        name: 'Information Manager',
        icon: 'filter',
        description: 'Specialists responsible for the quality, governance, and lifecycle of SNOMED CT content within an organisation or programme. Information managers author and maintain value sets, manage reference sets, oversee concept requests, coordinate release updates, and ensure that terminology content meets clinical and technical requirements.'
      },
      {
        name: 'Governance Lead',
        icon: 'shield',
        description: 'Leaders accountable for organisational policy around SNOMED CT adoption — including compliance with national requirements, change control processes, stakeholder alignment, and ongoing quality assurance. Governance leads define who has authority over terminology decisions and how the implementation responds to evolving clinical and regulatory requirements.'
      }
    ];
    roleIntroEl.innerHTML = `
      <div class="role-intro-grid">
        ${roles.map(r => `
          <div class="role-intro-card">
            <div class="role-intro-icon">${icon(r.icon, 18)}</div>
            <div class="role-intro-body">
              <div class="role-intro-name">${r.name}</div>
              <div class="role-intro-desc">${r.description}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    roleIntroEl.style.display = 'block';
  } else {
    roleIntroEl.style.display = 'none';
    roleIntroEl.innerHTML = '';
  }

  // Filter bar
  const filterBar = document.getElementById('filter-bar');
  filterBar.innerHTML = [
    `<button class="filter-btn ${!activeFilter ? 'active' : ''}" onclick="navigate('#/browse/${perspective}')">All (${qs.length})</button>`,
    ...cats.map(cat => {
      const count = qs.filter(q => q.category === cat).length;
      const isActive = activeFilter === cat;
      return `<button class="filter-btn ${isActive ? 'active' : ''}" onclick="navigate('#/browse/${perspective}/${encodeURIComponent(cat)}')">${cat} (${count})</button>`;
    })
  ].join('');

  // Questions
  const filtered = activeFilter ? qs.filter(q => q.category === activeFilter) : qs;
  const list = document.getElementById('question-list');
  list.innerHTML = filtered.map(q => {
    const pb = state.playbooks[q.playbook];
    const color = pb ? pb.color : 'blue';
    return `
      <a href="${state.answers[q.id] ? `#/question/${q.id}` : `#/playbook/${q.playbook}`}" class="question-item">
        <span class="question-id">${q.id}</span>
        <span class="question-text">${q.text}</span>
        ${pb ? `<span class="question-pb-tag c-${color}" style="color:var(--c-text);background:var(--c-bg);border-color:var(--c-border)">${pb.title}</span>` : ''}
        <span class="question-arrow">${icon('arrow-right', 14)}</span>
      </a>
    `;
  }).join('');
}

// ── Playbook ──────────────────────────────────────────────────────────────
function renderPlaybook(id) {
  setView('view-playbook');
  const pb = state.playbooks[id];
  if (!pb) return renderLanding();

  const related = state.questions.filter(q => q.playbook === id);

  // Determine back link — use history or default to browse
  document.getElementById('playbook-back').onclick = () => history.back();

  const content = document.getElementById('playbook-content');
  content.innerHTML = `
    <div class="playbook-header pb-header-${pb.color}">
      <div class="playbook-type">Implementation playbook</div>
      <div class="playbook-title">${pb.title}</div>
      <div class="playbook-subtitle">${pb.subtitle}</div>
      <div class="playbook-audience">
        ${pb.audience.map(a => `<span class="audience-badge">${a}</span>`).join('')}
      </div>
    </div>

    <p class="overview-text">${pb.overview}</p>

    <div class="playbook-sections">

      <!-- Key considerations -->
      <div class="pb-card">
        <div class="pb-card-title">${icon('git-branch')} Things to clarify before you start</div>
        <p style="font-size:13px;color:var(--text-muted);margin-bottom:14px;line-height:1.5">Work through these questions with your clinical, technical, and governance leads before implementation begins.</p>
        <div class="consideration-list">
          ${pb.decisions.map((d, i) => `
            <div class="consideration-item c-${pb.color}">
              <div class="consideration-num">${i + 1}</div>
              <div class="consideration-body">
                <div class="consideration-q">${d.question}</div>
                ${d.guidance ? `<div class="consideration-guidance">${d.guidance}</div>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Validation error resolution (optional, data-driven) -->
      ${pb.errorHandling ? `
      <div class="pb-card pb-error-handling">
        <div class="pb-card-title">${icon('warning')} Validation error resolution</div>
        <p class="error-handling-intro">${pb.errorHandling.intro}</p>
        <div class="error-scenario-grid">
          ${pb.errorHandling.scenarios.map(s => `
            <div class="error-scenario-card">
              <div class="error-scenario-header">
                ${icon(s.icon || 'warning', 14)}
                <span class="error-scenario-trigger">${s.trigger}</span>
              </div>
              <div class="error-scenario-body">
                <div class="error-scenario-section">
                  <div class="error-scenario-label">Cause</div>
                  <div class="error-scenario-text">${s.cause}</div>
                </div>
                <div class="error-scenario-section">
                  <div class="error-scenario-label">Resolution</div>
                  ${s.resolutionSteps.length === 1
                    ? `<div class="error-scenario-text">${s.resolutionSteps[0]}</div>`
                    : `<ol class="error-resolution-steps">${s.resolutionSteps.map(r => `<li>${r}</li>`).join('')}</ol>`
                  }
                </div>
              </div>
            </div>
          `).join('')}
        </div>
        ${pb.errorHandling.note ? `
          <div class="error-handling-note">
            ${icon('check-circle', 14)}
            <span>${pb.errorHandling.note}</span>
          </div>
        ` : ''}
      </div>
      ` : ''}

      <!-- Implementation steps -->
      <div class="pb-card">
        <div class="pb-card-title">${icon('stairs')} Implementation steps</div>
        <div class="step-list">
          ${pb.steps.map((s, i) => `
            <div class="step-item">
              <div class="step-num c-${pb.color}" style="background:var(--c-bg);color:var(--c-text)">${i + 1}</div>
              <div class="step-body">
                <div class="step-title">${s.title}</div>
                <div class="step-desc">${s.description}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Dependencies + Pitfalls -->
      <div class="two-col">
        <div class="pb-card">
          <div class="pb-card-title">${icon('plug')} Dependencies</div>
          <div class="dep-list">
            ${pb.dependencies.map(d => `
              <div class="dep-item">
                ${icon(d.icon || 'server', 15)}
                <span>${d.text}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="pb-card" style="background:#FFFBF0;border-color:var(--color-amber-border)">
          <div class="pb-card-title">${icon('warning')} Common pitfalls</div>
          <div class="pitfall-list">
            ${pb.pitfalls.map(p => `<div class="pitfall-item">${p}</div>`).join('')}
          </div>
        </div>
      </div>

      <!-- Resources -->
      <div class="pb-card">
        <div class="pb-card-title">${icon('books')} Resources</div>
        <div class="resource-grid">
          ${pb.resources.map(r => {
            const typeClass = r.type === 'Tool' ? 'resource-type-tool' : r.type === 'Spec' ? 'resource-type-spec' : 'resource-type-guide';
            const resIcon = r.type === 'Tool' ? icon('plug', 16) : icon('file', 16);
            return `
            <a href="${r.url}" target="_blank" rel="noopener" class="resource-item">
              ${resIcon}
              <div>
                <div class="resource-type ${typeClass}">${r.type}</div>
                <div class="resource-title">${r.title}</div>
              </div>
            </a>
          `}).join('')}
        </div>
      </div>

      <!-- Related questions -->
      ${related.length ? `
        <div class="related-card">
          <div class="pb-card-title" style="margin-bottom:10px">${icon('search', 14)} Questions answered by this playbook</div>
          ${related.map(q => `
            <div class="related-item">
              <span class="related-id">${q.id}</span>
              <span>${q.text}</span>
            </div>
          `).join('')}
        </div>
      ` : ''}

    </div>
  `;
}

// ── All playbooks overview ────────────────────────────────────────────────
function renderAllPlaybooks() {
  setView('view-all-playbooks');

  const bandColour = {
    blue:    '#00A9E0', teal:    '#25ACB8', green:   '#6DBBA1',
    amber:   '#F8A73D', orange:  '#DE8345', red:     '#CE0037',
    purple:  '#8072AC', camelot: '#8D3057', gray:    '#434A55',
  };

  // Group playbooks into themed sections
  const groups = [
    {
      label: 'Use case playbooks',
      description: 'Start here if you have a specific clinical or operational goal.',
      ids: ['problem-list', 'clin-docs', 'cds', 'analytics', 'interop'],
    },
    {
      label: 'Capability playbooks',
      description: 'Start here if you need to design or build a specific component.',
      ids: ['value-sets', 'term-service', 'search-ux', 'mapping', 'governance'],
    },
    {
      label: 'Content and language playbooks',
      description: 'Start here if you are working with extensions, translations, or multilingual environments.',
      ids: ['extensions', 'multilingual'],
    },
  ];

  const grid = document.getElementById('all-playbooks-grid');
  grid.innerHTML = groups.map(group => {
    const cards = group.ids.map(id => {
      const pb = state.playbooks[id];
      if (!pb) return '';
      const band = bandColour[pb.color] || '#12506B';
      const qCount = state.questions.filter(q => q.playbook === id).length;
      return `
        <a href="#/playbook/${id}" class="pb-full-card">
          <div class="pb-full-card-accent" style="background:${band}">
            <span class="c-${pb.color}" style="color:var(--c-text)">${icon(pb.icon || 'file', 20)}</span>
          </div>
          <div class="pb-full-card-body">
            <div class="pb-full-card-title">${pb.title}</div>
            <div class="pb-full-card-subtitle">${pb.subtitle}</div>
            <div class="pb-full-card-overview">${pb.overview}</div>
            <div class="pb-full-card-stats">
              <span class="pb-stat">${icon('git-branch', 13)} ${pb.decisions.length} considerations</span>
              <span class="pb-stat">${icon('stairs', 13)} ${pb.steps.length} steps</span>
              <span class="pb-stat">${icon('books', 13)} ${pb.resources.length} resources</span>
              <span class="pb-stat">${icon('search', 13)} ${qCount} question${qCount !== 1 ? 's' : ''}</span>
            </div>
            <div class="pb-full-card-footer">
              <div class="pb-full-card-audience">
                ${pb.audience.map(a => `<span class="audience-pill c-${pb.color}" style="color:var(--c-text);border-color:var(--c-border);background:var(--c-bg)">${a}</span>`).join('')}
              </div>
              <span class="pb-full-card-cta c-${pb.color}" style="color:var(--c-text)">
                Open playbook ${icon('arrow-right', 13)}
              </span>
            </div>
          </div>
        </a>
      `;
    }).join('');

    return `
      <div class="pb-group">
        <div class="pb-group-header">
          <div class="pb-group-label">${group.label}</div>
          <div class="pb-group-desc">${group.description}</div>
        </div>
        <div class="pb-group-grid">${cards}</div>
      </div>
    `;
  }).join('');
}

// ── Question answer page ─────────────────────────────────────────────────
function renderQuestion(id) {
  setView('view-question');
  const q   = state.questions.find(q => q.id === id);
  const ans = state.answers[id];
  if (!q || !ans) { navigate('#/'); return; }

  document.getElementById('question-back').onclick = () => history.back();

  const relatedPlaybooks = ans.playbooks
    .map(pbId => ({ id: pbId, ...state.playbooks[pbId] }))
    .filter(pb => pb.title);

  const bandColour = {
    blue:'#00A9E0', teal:'#25ACB8', green:'#6DBBA1', amber:'#F8A73D',
    orange:'#DE8345', red:'#CE0037', purple:'#8072AC', camelot:'#8D3057', gray:'#434A55',
  };

  document.getElementById('question-content').innerHTML = `

    <!-- Question -->
    <div class="qa-question-block">
      <div class="qa-qid">${q.id}</div>
      <h1 class="qa-question">${q.text}</h1>
    </div>

    <!-- Answer -->
    <div class="qa-answer-block">
      <div class="qa-answer-label">${icon('check-circle', 16)} Answer</div>
      <p class="qa-answer-text">${ans.answer}</p>
    </div>

    <!-- Key points -->
    <div class="qa-keypoints-block">
      <div class="qa-section-title">${icon('list-check', 15)} Key points</div>
      <ul class="qa-keypoints">
        ${ans.keyPoints.map(pt => `
          <li class="qa-keypoint">
            <span class="qa-keypoint-dot"></span>
            <span>${pt}</span>
          </li>
        `).join('')}
      </ul>
    </div>

    <!-- Go deeper -->
    <div class="qa-playbooks-block">
      <div class="qa-section-title">${icon('books', 15)} Go deeper — open the full playbook</div>
      <div class="qa-playbook-cards">
        ${relatedPlaybooks.map(pb => {
          const band = bandColour[pb.color] || '#12506B';
          const qCount = state.questions.filter(q => q.playbook === pb.id).length;
          return `
            <a href="#/playbook/${pb.id}" class="qa-pb-card">
              <div class="qa-pb-card-band" style="background:${band}"></div>
              <div class="qa-pb-card-body">
                <div class="qa-pb-card-title c-${pb.color}" style="color:var(--c-text)">
                  ${icon(pb.icon || 'file', 16)} ${pb.title}
                </div>
                <div class="qa-pb-card-sub">${pb.subtitle}</div>
                <div class="qa-pb-card-stats">
                  <span>${icon('git-branch', 12)} ${pb.decisions.length} considerations</span>
                  <span>${icon('stairs', 12)} ${pb.steps.length} steps</span>
                  <span>${icon('search', 12)} ${qCount} questions</span>
                </div>
                <div class="qa-pb-card-cta c-${pb.color}" style="color:var(--c-text)">
                  Open full playbook ${icon('arrow-right', 13)}
                </div>
              </div>
            </a>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Related questions in the same category -->
    ${(() => {
      const related = state.questions
        .filter(rq => rq.id !== id && rq.category === q.category)
        .slice(0, 5);
      if (!related.length) return '';
      return `
        <div class="qa-related-block">
          <div class="qa-section-title">${icon('search', 15)} Related questions</div>
          <div class="question-list">
            ${related.map(rq => {
              const rpb = state.playbooks[rq.playbook];
              const color = rpb ? rpb.color : 'blue';
              return `
                <a href="${state.answers[rq.id] ? `#/question/${rq.id}` : `#/playbook/${rq.playbook}`}" class="question-item">
                  <span class="question-id">${rq.id}</span>
                  <span class="question-text">${rq.text}</span>
                  ${rpb ? `<span class="question-pb-tag c-${color}" style="color:var(--c-text);background:var(--c-bg);border-color:var(--c-border)">${rpb.title}</span>` : ''}
                  <span class="question-arrow">${icon('arrow-right', 14)}</span>
                </a>
              `;
            }).join('')}
          </div>
        </div>
      `;
    })()}
  `;
}

// ── Search page ──────────────────────────────────────────────────────────
function renderSearchPage(query) {
  setView('view-search');
  const { questions, playbooks } = searchAll(query);

  document.getElementById('search-page-title').textContent = `Results for "${query}"`;
  document.getElementById('search-page-sub').textContent =
    `${questions.length} questions · ${playbooks.length} playbooks`;

  const out = document.getElementById('search-results-main');
  let html = '';

  if (!questions.length && !playbooks.length) {
    html = `<div class="no-results">
      <div class="no-results-icon">🔍</div>
      <div class="no-results-text">No results for "<strong>${escHtml(query)}</strong>" — try different keywords</div>
    </div>`;
  } else {
    if (playbooks.length) {
      html += `<div class="search-section-title">Playbooks</div>
        <div class="question-list">
          ${playbooks.map(pb => `
            <a href="#/playbook/${pb.id}" class="question-item">
              <span class="question-pb-tag c-${pb.color}" style="color:var(--c-text);background:var(--c-bg);border-color:var(--c-border);min-width:0">Playbook</span>
              <span class="question-text" style="font-weight:600">${highlight(pb.title, query)}</span>
              <span class="question-arrow">${icon('arrow-right', 14)}</span>
            </a>
          `).join('')}
        </div>`;
    }
    if (questions.length) {
      html += `<div class="search-section-title">Questions</div>
        <div class="question-list">
          ${questions.map(q => {
            const pb = state.playbooks[q.playbook];
            const color = pb ? pb.color : 'blue';
            return `
              <a href="${state.answers[q.id] ? `#/question/${q.id}` : `#/playbook/${q.playbook}`}" class="question-item">
                <span class="question-id">${q.id}</span>
                <span class="question-text">${highlight(q.text, query)}</span>
                ${pb ? `<span class="question-pb-tag c-${color}" style="color:var(--c-text);background:var(--c-bg);border-color:var(--c-border)">${pb.title}</span>` : ''}
                <span class="question-arrow">${icon('arrow-right', 14)}</span>
              </a>
            `;
          }).join('')}
        </div>`;
    }
  }

  out.innerHTML = html;
}

// ── Search engine ────────────────────────────────────────────────────────
function searchAll(query) {
  const q = query.toLowerCase().trim();
  if (!q) return { questions: [], playbooks: [] };

  const matchedQuestions = state.questions.filter(item =>
    item.text.toLowerCase().includes(q) ||
    item.category.toLowerCase().includes(q)
  );

  const matchedPlaybooks = Object.entries(state.playbooks)
    .filter(([, pb]) =>
      pb.title.toLowerCase().includes(q) ||
      pb.subtitle.toLowerCase().includes(q) ||
      pb.overview.toLowerCase().includes(q) ||
      pb.steps.some(s => s.title.toLowerCase().includes(q)) ||
      pb.audience.some(a => a.toLowerCase().includes(q))
    )
    .map(([id, pb]) => ({ id, ...pb }));

  return { questions: matchedQuestions, playbooks: matchedPlaybooks };
}

function highlight(text, query) {
  if (!query) return escHtml(text);
  const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return escHtml(text).replace(re, '<mark style="background:#FFF176;border-radius:2px;padding:0 1px">$1</mark>');
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Live search dropdown ─────────────────────────────────────────────────
let searchDebounce;

function initSearch() {
  const input = document.getElementById('search-input');
  const dropdown = document.getElementById('search-results');

  input.addEventListener('input', () => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => renderSearchDropdown(input.value.trim()), 200);
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && input.value.trim()) {
      navigate(`#/search/${encodeURIComponent(input.value.trim())}`);
      input.blur();
      closeSearch();
    }
    if (e.key === 'Escape') closeSearch();
  });

  input.addEventListener('focus', () => {
    if (input.value.trim().length > 1) renderSearchDropdown(input.value.trim());
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.header-search')) closeSearch();
  });
}

function renderSearchDropdown(query) {
  const dropdown = document.getElementById('search-results');
  if (!query || query.length < 2) { dropdown.classList.remove('visible'); return; }

  const { questions, playbooks } = searchAll(query);
  const combined = [
    ...playbooks.slice(0, 3).map(pb => ({
      type: 'playbook', label: pb.title, sub: pb.subtitle, color: pb.color,
      href: `#/playbook/${pb.id}`
    })),
    ...questions.slice(0, 5).map(q => {
      const pb = state.playbooks[q.playbook];
      return { type: 'question', label: q.text, sub: q.id, tag: pb ? pb.title : '', color: pb ? pb.color : 'blue', href: `#/playbook/${q.playbook}` };
    }),
  ];

  if (!combined.length) {
    dropdown.innerHTML = `<div class="search-empty">No results for "<strong>${escHtml(query)}</strong>"</div>`;
  } else {
    dropdown.innerHTML = `
      <div class="search-results-header">${combined.length} results — press Enter for all</div>
      ${combined.map(item => `
        <a href="${item.href}" class="search-result-item" onclick="closeSearch()">
          <div class="search-result-icon c-${item.color}" style="background:var(--c-bg);color:var(--c-text)">
            ${item.type === 'playbook' ? icon('books', 14) : icon('file', 14)}
          </div>
          <div class="search-result-text">
            <div class="search-result-label">${highlight(item.label, query)}</div>
            <div class="search-result-sub">${item.type === 'playbook' ? item.sub : item.sub}</div>
          </div>
          ${item.tag ? `<span class="search-result-tag">${item.tag}</span>` : ''}
        </a>
      `).join('')}
    `;
  }

  dropdown.classList.add('visible');
}

function closeSearch() {
  document.getElementById('search-results').classList.remove('visible');
}

// ── Boot ─────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initSearch();
  loadData().catch(err => {
    document.getElementById('main').innerHTML =
      `<div class="container" style="padding:80px 0;text-align:center;color:#B83535">
        <p style="font-size:16px;margin-bottom:8px">Failed to load navigator data.</p>
        <p style="font-size:13px;color:#718096">Make sure you're running this from a web server, not directly from the file system.<br>Try: <code>python -m http.server 8080</code></p>
      </div>`;
    console.error('Data load failed:', err);
  });
});
