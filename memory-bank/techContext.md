# Technology Context

## Current State

This remains a content-first project with no faculty-facing application runtime, API integration, or automated deployment. Phases 1 and 2 provide the release foundation, complete classic custom Gem instruction source, synthetic workflow scenarios, and a developer-only Node.js validation lane. Node.js is repository tooling only and must never become an installation or usage prerequisite for faculty.

## Component Structure

| Component | Purpose | Current Location | Format |
|-----------|---------|------------------|--------|
| Memory Bank | Durable planning, task, decision, and verification context for producing the kit | `memory-bank/` | Markdown |
| Release foundation | Version boundary, 45-artifact inventory, status, phase ownership, and review date | `src/release/release-contract.md`, `src/release/version.md` | Markdown |
| Authoritative source register | Source-dated pointers and narrow claim mappings for policy and platform assertions | `src/sources/authoritative-source-register.md` | Markdown |
| Verification contract and fixtures | Phase 2 observable workflow contracts plus synthetic, de-identified test inputs | `src/testing/scenario-matrix.md`, `tests/fixtures/` | Markdown and JSON |
| Validation tooling | Dependency-free build, lint, aggregate validation, and 26 Phase 1–2 tests | `package.json`, `scripts/validate-release.mjs`, `tests/content/*.test.mjs` | Node.js ECMAScript modules (`.mjs`) |
| Gemini Gem instructions | Complete privacy kernel, routing, context selection, staged workflow, approval-gate, and manual-handoff instructions for the classic “Bergen Memory Bank” Gem | `src/gem/bergen-memory-bank-instructions.md` | Copy-ready Markdown |
| Google Docs templates | Four memory documents plus the Class Learning Snapshot template | `src/templates/` and `dist/google-docs/` (pending Phase 3) | Markdown sources and Google Docs-ready DOCX files |
| Faculty enablement materials | Command reference, installation, quick start, presentation script, prompts, demonstration, privacy, and troubleshooting content | `src/guides/` (pending Phase 4) | Copy-ready Markdown |
| QTI packaging companion | Optional browser-only packaging handoff, separate from the no-code Gem, Docs, and Canvas workflow | `apps/qti-packager/` (planned for Phase 5; not implemented through Phase 2) | Client-side Apps Script HTML Service files |

## Platforms and External Services

| Platform | Role | Integration Boundary |
|----------|------|----------------------|
| Classic custom Gemini Gem | Hosts the conversational instructions and interprets prompt aliases | Manual configuration only; exact current capabilities must be confirmed from official Google documentation |
| Google Drive | Holds the faculty-created Bergen Memory Bank folder | Manual file management only |
| Google Docs | Holds reusable memory documents | Manual copy, edit, and approved update workflow |
| Canvas | Stores student records and receives final approved course content | Manual faculty workflow only; no Canvas API or autonomous publishing |

## Development Commands

Run repository validation from the project root. On Windows, use the `.cmd` executable explicitly:

| Purpose | Windows-safe command | Portable equivalent |
|---------|----------------------|---------------------|
| Run the 26 focused Phase 1–2 tests | `npm.cmd test` | `npm test` |
| Validate release structure, inventory state, version, and source-register count | `npm.cmd run build` | `npm run build` |
| Validate text hygiene, fixture privacy metadata and fields, JSON parsing, and zero third-party dependencies | `npm.cmd run lint` | `npm run lint` |
| Run lint validation, build validation, and the focused tests | `npm.cmd run validate` | `npm run validate` |

There is no separate type-check command. The scripts require a local Node.js/npm installation for repository contributors only; faculty do not run these commands or install Node.js.

## Test Execution Strategy

- Phases 1 and 2 contain 26 dependency-free tests across `tests/content/release-structure.test.mjs`, `tests/content/source-register.test.mjs`, and `tests/content/gem-workflows.test.mjs`, executed with the Node.js built-in test runner.
- The four release-structure tests cover repository scripts and dependency boundaries, release version and review date, the exact 45-artifact inventory with later phases absent, and synthetic fixture safeguards.
- The four source-register tests cover dated source completeness, Bergen policy boundaries, Gem and Canvas capability claims, and Apps Script hosting constraints.
- The 18 Gem-workflow tests cover the always-on privacy and capability kernel, all twelve aliases and natural-language routing, explicit course and context selection, the seven-stage engine, approval gates, protected-data recovery, prerequisite safeguards, manual record and Canvas boundaries, the text-only quiz handoff, and qualified visible-chat estimates.
- `scripts/validate-release.mjs` supplies deterministic build and lint checks and invokes the same focused test files for aggregate validation.
- The Phase 2 scenario matrix covers every `bergen:<workflow>` alias and representative natural-language, privacy-boundary, unknown-command, missing-context, approval-gate, prerequisite, quiz-handoff, and capability-claim scenarios. Later phases extend the matrix for templates, guides, packaging, and manual compatibility evidence.
- Tests, demonstrations, and compatibility checks use only synthetic or de-identified example data. Credentials, protected records, and real student data must never enter repository artifacts.
- Manually verify the installation path in an authorized non-production Gem and faculty-owned test documents before release; credentials and protected records must never enter repository artifacts.

## Technology Stack

- **Repository documentation**: Markdown.
- **Repository validation runtime**: Node.js ECMAScript modules using only built-in modules, including `node:test`; no third-party dependencies or development dependencies.
- **Package scripts**: npm command aliases in `package.json` for test, build, lint, and aggregate validation.
- **Faculty-facing authoring and memory**: Google Docs in Google Drive.
- **Conversational host**: Classic custom Gemini Gem created with a `bergen.edu` account.
- **Student-record and publishing system**: Canvas.
- **APIs and product automation**: No Canvas API, autonomous document editing, automated grading, or autonomous publishing in version 1.0. Repository validation automation is developer-only.
- **Planned optional companion**: A client-side QTI Packager is assigned to Phase 5 and is not implemented through Phase 2. The Gem can prepare only the approved text-only Bergen Quiz Transfer Block that the future packager will validate and package.

<!-- AUTO-MANAGED: c4-references-start -->
## C4 References

C4 architecture documentation has not been generated, and no C4 manifest exists. Phases 1 and 2 add developer-only validation and the Markdown Gem instruction source; the planned QTI companion is not implemented yet.

<!-- AUTO-MANAGED: c4-references-end -->

## Recent Technology Changes

### 2026-08-04 - Completed the Phase 2 content-contract validation lane

- **What Changed**: Added the complete classic Gem instruction source, 18 Gem-workflow content-contract tests, and Phase 2 synthetic scenario coverage; aggregate validation now runs 26 tests.
- **Reason**: Make routing, privacy, context selection, staged approvals, prerequisite constraints, and manual handoff boundaries executable before templates and faculty guides are produced.
- **Impact**: Repository contributors can validate the complete Phase 1–2 content contract with the existing dependency-free Node.js commands. Faculty still install no software and use no developer tooling.
- **Migration Notes**: None; no runtime or third-party dependency was added.

### 2026-08-04 - Added the Phase 1 validation runtime

- **What Changed**: Added dependency-free Node.js `.mjs` tests and validation scripts plus npm aliases for test, build, lint, and aggregate validation.
- **Reason**: Make the release boundary, artifact inventory, dated-source discipline, and fixture privacy rules executable without introducing a framework or third-party package supply chain.
- **Impact**: Repository contributors have repeatable validation commands and eight focused tests. The faculty-facing Gem, Google Docs, and Canvas experience remains no-code and unaffected.
- **Migration Notes**: None; Node.js is developer tooling only.

### 2026-08-04 - Greenfield initialization

- **What Changed**: Recorded the user-specified no-code platform boundaries.
- **Reason**: Prevent the design from drifting toward custom software, APIs, or faculty-facing technical requirements.
- **Impact**: The core version 1.0 experience remains a content-and-template kit; the optional client-side QTI companion is planned separately for Phase 5.
