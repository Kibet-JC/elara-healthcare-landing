# CLAUDE.md — Elara Healthcare project conventions for Claude Code

This file is read automatically by Claude Code on every session in this repo. It encodes the working conventions for Elara Healthcare so you (Claude Code) do not need to be re-briefed each time.

---

## 1. Project identity

- **Product:** NexCare — a real production Health Information Management System (HIMS) / Electronic Health Record (EHR) for a Kenyan clinic chain.
- **Owner / lead clinician:** Kibet (`Kibet-JC`), a registered and licensed Clinical Officer in Kenya with established hospital partners.
- **Status:** Active commercial development. Modules go live progressively as they pass the per-module readiness gates defined in `COMPLIANCE.md` §12.
- **Not:** an educational demo, a portfolio toy, a research project, or a synthetic-data sandbox.

---

## 2. Framing rules (non-negotiable)

Do **not** add or suggest any of the following anywhere in this repo — code comments, README copy, UI text, commit messages, PR descriptions, issue replies:

- "Educational project" / "for educational purposes only"
- "Not for clinical use" / "not a medical device"
- "Demo only" / "synthetic data only" / "no real patient data"
- A `DISCLAIMER.md` file
- Any caveat that frames NexCare as anything less than a real clinical product

Use **production compliance framing** instead:

- Reference `COMPLIANCE.md`, `PRIVACY.md`, `SECURITY.md` (already present in repo root).
- Reference Kenya Data Protection Act, 2019 and the Office of the Data Protection Commissioner (ODPC) where relevant.
- Reference Health Act, 2017 and Clinical Officers Council standards where relevant.
- For data safety, reference the per-module **go-live readiness gates** in `COMPLIANCE.md` §12, not blanket "no real data" rules.

---

## 3. Repository conventions

### 3.1 Branch naming

`<type>/<issue-number>-<short-slug>`

| Type | Use for |
|---|---|
| `feature/` | New user-facing capability |
| `fix/` | Bug fix |
| `chore/` | Setup, tooling, configuration |
| `docs/` | Documentation only |
| `refactor/` | Code restructuring without behavior change |
| `test/` | Adding or fixing tests |

Examples: `chore/1-initialize-repo`, `feature/3-intake-form`, `fix/12-localstorage-fallback`.

### 3.2 Commit messages (Conventional Commits)

`<type>(<scope>): <subject in imperative mood, lowercase, no period>`

Examples:
- `chore(repo): add base scaffolding and compliance links`
- `feat(intake): add Kenyan phone number validation`
- `fix(form): handle disabled localStorage`

The body should explain **why**, not what. Reference the issue: `Closes #1`.

### 3.3 PR workflow

One issue → one branch → one PR → one merge. If a PR grows past ~300 lines of code, split it. Read every diff before merging.

### 3.4 Files Claude Code must not modify without explicit instruction

- `COMPLIANCE.md`, `PRIVACY.md`, `SECURITY.md` — these have specific legal and clinical phrasing. Claude Code may **link to them** from the README but must not summarize, paraphrase, or rewrite them. If a change seems needed, surface it to Kibet for DPO/legal review first.
- `LICENSE` — proprietary / all-rights-reserved by default for Elara Healthcare. Do not switch to MIT or any OSS license without explicit instruction.

---

## 4. Engineering baseline

### 4.1 General

- No inline styles, no inline scripts (this applies to all Elara Healthcare web frontends).
- Server-side validation on every external boundary; never trust the client.
- Parameterized queries via the project ORM (no raw SQL with user input).
- Secrets via environment variables or a secret manager. **Never** in source. `.env` is in `.gitignore` from commit #1.
- No `localStorage` or `sessionStorage` for any clinical data after Phase 2 — clinical data lives in the API + Postgres only.

### 4.2 This repo specifically (`elara-healthcare-landing`)

- Vanilla HTML, CSS, JS. No frameworks, no bundler.
- Semantic HTML5 landmarks: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`.
- BEM-style class naming inside CSS files.
- CSS custom properties for color tokens; honor `prefers-color-scheme`.
- Forms: every input has `<label for>`, errors via `aria-describedby`.
- Phone validation accepts Kenyan formats: `+254...`, `07...`, `01...`.
- Privacy notice link visible near any form's submit button.

### 4.3 Accessibility and quality bars

- WCAG AA color contrast (4.5:1 body, 3:1 large text).
- Lighthouse Performance, Accessibility, and Best Practices ≥ 90 before any merge to `main`.
- HTML must validate with zero errors.

---

## 5. How to work with Kibet

- He is a Clinical Officer learning full-stack engineering through real production work. Explain new concepts briefly when you introduce them, but do not over-teach.
- He prefers direct, execution-focused responses with tables, checklists, and code blocks. No motivational essays.
- He runs the **Task → Context → Reference → Evaluate → Iterate** prompt structure. Match it.
- He reviews every diff. Keep PRs small and the **why** explicit.
- For any change touching clinical workflow or patient-visible copy, propose first and wait for sign-off; do not assume.
- Pushing back on engineering risks (security, data loss, audit gaps) is welcome. Pushing back on clinical scope or claims is not — Kibet is the clinical authority.

---

## 6. Pointers

- Roadmap and module ladder: `~/Documents/Claude/Projects/CodeOps Lab/NEXCARE_90_DAY_ROADMAP.md`
- Compliance and privacy templates: `~/Documents/Claude/Projects/CodeOps Lab/templates/`
- Issue bootstrap script pattern: `~/Documents/Claude/Projects/CodeOps Lab/scripts/bootstrap-elara-healthcare-landing-issues.sh`

When in doubt, ask Kibet rather than guess. When asking, propose two concrete options and recommend one.
