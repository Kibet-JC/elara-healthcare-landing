# NexCare — Landing Site

The public landing site for **NexCare**, a Health Information Management System (HIMS) and Electronic Health Record (EHR) operated by a registered Clinical Officer for a Kenyan clinic chain.

> _Live site URL will be added here after first deploy: `_TODO_`_

---

## About NexCare

NexCare is a clinical software platform built for Kenyan primary and secondary care. It supports appointment booking, patient records, clinician workflows, and integration with the Social Health Authority (SHA / SHIF) and the Ministry of Health reporting pipeline. The system is built and operated by **Kibet**, a registered Clinical Officer, in partnership with established Kenyan hospital partners.

This repository hosts the public-facing landing site only. Patient-facing modules and the clinical core live in separate repositories.

---

## Stack

- HTML5, CSS3, vanilla JavaScript (ES2022)
- No frameworks, no bundler
- GitHub Pages for hosting
- GitHub Actions for deployment

---

## Run locally

```bash
# Serve the site locally with any static server. Examples:
npx serve src
# or
python3 -m http.server -d src 8000
```

Then open http://localhost:3000 (or :8000).

---

## Deploy

Pushes to `main` trigger the GitHub Actions workflow at `.github/workflows/deploy.yml`, which publishes `src/` to GitHub Pages.

---

## Roadmap

This repo is module 1 of the NexCare 90-day roadmap. The full module ladder:

1. **`nexcare-landing`** — this repo (landing + public information)
2. `nexcare-appointments-client` — client-side appointment intake
3. `nexcare-api` — Node + Express + Postgres clinical API
4. `nexcare-web` — React patient + clinician web app
5. Auth + RBAC (JWT, audit logs)
6. Production deployment (Vercel + Railway)
7. AI-assisted clinical note summarization (Claude API, server-side)

---

## Known limitations

- Open Graph / Twitter card images are not yet set; social previews will show as text-only until a brand image is added.
- Clinic locations in the appointment form (Nairobi / Mombasa / Kisumu) are placeholder values; replace with the actual NexCare clinic locations before public launch.
- Callback phone number in the saved-requests list is placeholder (+254 000 000 000); replace before public launch.
- Online booking submissions persist on the visitor's device only; Phase 2 introduces the real API and submits to the clinic system.
- Privacy Notice link points to the GitHub-rendered PRIVACY.md; a dedicated /privacy page on the site will land in a follow-up issue.

---

## Compliance, privacy, security

NexCare is operated under the laws of the Republic of Kenya, including the Data Protection Act, 2019 and the Health Act, 2017.

- [Compliance overview](./COMPLIANCE.md) — KDPA, ODPC, sub-processors, retention
- [Privacy notice](./PRIVACY.md) — patient-facing, plain language
- [Security policy](./SECURITY.md) — vulnerability reporting, incident response

---

## Contact

| | |
|---|---|
| Project lead / Clinical Officer | Kibet |
| Email | kibet@jeremiahchebii.net |
| GitHub | [@Kibet-JC](https://github.com/Kibet-JC) |
| Privacy / DPO enquiries | _TODO: privacy@nexcare-domain_ |
| Security disclosure | _TODO: security@nexcare-domain_ |

---

© 2026 Kibet (NexCare). All rights reserved. See [LICENSE](./LICENSE).
