# Technology Context

## Current State

This is a content-first project with one optional faculty-facing browser companion and no API integration or automated deployment. Phases 1 through 4 provide the release foundation, complete classic custom Gem instructions, synthetic scenarios, the four-document memory model, deterministic Google Docs-ready DOCX files, and nine aligned faculty guides. Phase 5 adds a deployable static Apps Script page that performs validation and QTI 1.2 ZIP creation entirely in the browser. Node.js and the bundled document-authoring runtime remain contributor tooling and are never faculty prerequisites.

## Component Structure

| Component | Purpose | Current Location | Format |
|-----------|---------|------------------|--------|
| Memory Bank | Durable planning, task, decision, and verification context for producing the kit | `memory-bank/` | Markdown |
| Release foundation | Version boundary, 45-artifact inventory, status, phase ownership, and review date | `src/release/release-contract.md`, `src/release/version.md` | Markdown |
| Authoritative source register | Source-dated pointers and narrow claim mappings for policy and platform assertions | `src/sources/authoritative-source-register.md` | Markdown |
| Verification contract and fixtures | Observable Gem, template, guide, packager, and manual-gate contracts plus synthetic, de-identified test inputs | `src/testing/scenario-matrix.md`, `tests/fixtures/` | Markdown and JSON |
| Validation tooling | Dependency-free build, lint, aggregate validation, and 54 Phase 1–5 tests | `package.json`, `scripts/validate-release.mjs`, `tests/content/*.test.mjs`, `tests/qti/*.mjs` | Node.js ECMAScript modules (`.mjs`) |
| Gemini Gem instructions | Complete privacy kernel, routing, context selection, staged workflow, approval-gate, and manual-handoff instructions for the classic “Bergen Memory Bank” Gem | `src/gem/bergen-memory-bank-instructions.md` | Copy-ready Markdown |
| Google Docs templates | Four faculty knowledge documents generated from four primary Markdown sources; the fifth Markdown source is the reusable Class Learning Snapshot partial embedded in Active Workbench, not a fifth knowledge document | `src/templates/`, `dist/google-docs/` | Markdown sources and four Google Docs-ready DOCX files |
| Document build pipeline | Converts the Markdown sources with `python-docx`, runs the packaged title sanitizer and privacy scrubber, removes `rsid` markup across all XML members, and normalizes ZIP ordering and timestamps | `scripts/build-google-docs.mjs` | Node.js orchestrator with bundled Python document tooling |
| Faculty enablement materials | Nine aligned guides covering commands, installation, quick start, presentation, prompts, demonstration, privacy, troubleshooting, and the manual QTI-to-Canvas handoff | `src/guides/` | Copy-ready Markdown |
| QTI packaging companion | Optional browser-only validation and QTI 1.2 ZIP handoff, separate from the Gem, Docs, and Canvas workflow | `apps/qti-packager/`, `demo/` | Client-side Apps Script HTML Service files, self-contained HTML, and synthetic ZIP |

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
| Run the 54 focused Phase 1–5 tests | `npm.cmd test` | `npm test` |
| Regenerate the self-contained packager demo and synthetic ZIP | `npm.cmd run build:qti-demo` | `npm run build:qti-demo` |
| Regenerate the four Google Docs-ready DOCX files | `npm.cmd run build:google-docs` | `npm run build:google-docs` |
| Validate release structure, inventory state, version, and source-register count | `npm.cmd run build` | `npm run build` |
| Validate text hygiene, fixture privacy metadata and fields, JSON parsing, and zero third-party dependencies | `npm.cmd run lint` | `npm run lint` |
| Run lint validation, build validation, and the focused tests | `npm.cmd run validate` | `npm run validate` |

There is no separate type-check command. The scripts require a local Node.js/npm installation for repository contributors only; faculty do not run these commands or install Node.js.

The document build also requires the Codex-bundled Python runtime with `python-docx` and the bundled documents package. `CODEX_BUNDLED_PYTHON` and `CODEX_DOCUMENTS_PACKAGE` can provide explicit locations. When unset, the builder discovers the standard bundled Python path and selects the newest compatible documents package from the Codex plugin cache without hard-coding a user profile or package version. It fails with an actionable configuration error when either prerequisite is unavailable.

## Test Execution Strategy

- Phases 1 through 5 contain 54 dependency-free tests across the five content suites and three QTI suites, executed with the Node.js built-in test runner.
- The four release-structure tests cover repository scripts and dependency boundaries, release version and review date, the exact 45-artifact inventory with all implementation artifacts ready, and synthetic fixture safeguards.
- The four source-register tests cover dated source completeness, Bergen policy boundaries, Gem and Canvas capability claims, and Apps Script hosting constraints.
- The 18 Gem-workflow tests cover the always-on privacy and capability kernel, all twelve aliases and natural-language routing, explicit course and context selection, the seven-stage engine, approval gates, protected-data recovery, prerequisite safeguards, manual record and Canvas boundaries, the text-only quiz handoff, and qualified visible-chat estimates.
- The eight template-contract tests cover the four-document ownership model, source-to-DOCX parity, the embedded Class Learning Snapshot and its exact ordered fields, privacy and Canvas boundaries, explicit course selection, prerequisite constraints, manual faculty-approved recording, and the Google Docs OOXML contract.
- The eight guide-alignment tests cover the complete nine-guide set and nontechnical language, exact eight-step installation, all twelve aliases plus natural-language parity, observable response fields, privacy recovery, conservative context estimates, the ten-minute presentation, synthetic prompts and demonstration alignment, approval ordering, manual Google Docs and Canvas actions, and the optional QTI boundary.
- The twelve QTI checks cover transfer parsing and validation, all five item types, scoring and settings, privacy stops, well-formed manifest and assessment XML, deterministic ZIP contents, static Apps Script serving, network/storage prohibitions, accessible responsive UI, privacy-gated download, and desktop/mobile demonstration journeys.
- `scripts/validate-release.mjs` supplies deterministic build and lint checks and invokes the same focused test files for aggregate validation.
- The scenario matrix covers every `bergen:<workflow>` alias and representative natural-language, privacy-boundary, unknown-command, missing-context, approval-gate, prerequisite, quiz-handoff, capability-claim, template, guide, browser-packaging, and manual compatibility scenario.
- Phase 3 verification additionally checked all four generated packages with the packaged title sanitizer, accessibility checks, and package-wide OOXML, `google_docs_default`, privacy, and deterministic-output checks. Document render/PNG visual QA is `DONE_WITH_CONCERNS` because the bundled environment has no LibreOffice/`soffice`; Google Docs import and visual inspection remain a manual release check rather than a claimed automated pass.
- Tests, demonstrations, and compatibility checks use only synthetic or de-identified example data. Credentials, protected records, and real student data must never enter repository artifacts.
- Manually verify the installation path in an authorized non-production Gem and faculty-owned test documents before release; credentials and protected records must never enter repository artifacts.

## Technology Stack

- **Repository documentation**: Markdown.
- **Repository validation runtime**: Node.js ECMAScript modules using only built-in modules, including `node:test`; no third-party dependencies or development dependencies.
- **Package scripts**: npm command aliases in `package.json` for test, build, lint, and aggregate validation.
- **Document authoring runtime**: Codex-bundled Python with `python-docx`, plus the bundled documents package title-sanitization and privacy-scrubbing helpers; this is a contributor build-time dependency, not a package.json dependency or faculty prerequisite.
- **Faculty-facing authoring and memory**: Google Docs in Google Drive.
- **Conversational host**: Classic custom Gemini Gem created with a `bergen.edu` account.
- **Student-record and publishing system**: Canvas.
- **APIs and product automation**: No Canvas API, autonomous document editing, automated grading, or autonomous publishing in version 1.0. Repository validation automation is developer-only.
- **Implemented optional companion**: The Gem prepares only an approved text-only Bergen Quiz Transfer Block. The separate client-side QTI Packager validates it and creates the local ZIP without sending quiz content to Apps Script or another service.

<!-- AUTO-MANAGED: c4-references-start -->
## C4 References

C4 architecture documentation has not been generated, and no C4 manifest exists. The architecture is documented in `memory-bank/systemPatterns.md`; the absence of a C4 manifest does not change the implemented client-side-only QTI boundary.

<!-- AUTO-MANAGED: c4-references-end -->

## Recent Technology Changes

### 2026-08-04 - Implemented the privacy-first QTI Packager

- **What Changed**: Added a static Apps Script HTML Service bundle, browser-only transfer validation and QTI 1.2 ZIP creation, self-contained presentation fallback, synthetic compatibility ZIP, deterministic builder, and twelve focused checks.
- **Reason**: Give approved quizzes a practical manual Canvas transfer path without sending quiz content to a server or introducing a Canvas connection.
- **Impact**: Repository validation rises to 54 tests. Apps Script deployment, Bergen-domain access review, and the authorized unpublished-course Canvas compatibility check remain manual and unclaimed.

### 2026-08-04 - Added the aligned faculty-guide content layer

- **What Changed**: Added nine copy-ready Markdown faculty guides and an eight-test guide-alignment suite, then wired the suite into the existing package and aggregate validation commands.
- **Reason**: Make installation, daily workflows, privacy recovery, observable response expectations, approval ordering, context estimates, the synthetic demonstration, and manual Google Docs, Canvas, and future QTI handoffs consistent with the implemented Gem and template contracts.
- **Impact**: Faculty now have a complete nontechnical enablement layer. Repository validation rises to 42 dependency-free tests, while the faculty workflow still adds no runtime, dependency, API, server, storage, or Phase 5 packager.
- **Migration Notes**: None; the guides are content artifacts and the QTI Packager remains unimplemented.

### 2026-08-04 - Added deterministic Google Docs-ready document production

- **What Changed**: Added five Markdown template sources, four Google Docs-ready DOCX outputs, an eight-test template-contract suite, and a deterministic build entry point using the Codex-bundled Python and documents tooling.
- **Reason**: Turn the approved four-document ownership model and embedded Class Learning Snapshot into reproducible, import-ready faculty artifacts without adding a faculty-facing runtime.
- **Impact**: Repository contributors can regenerate and inspect the same scrubbed OOXML packages while faculty receive only the four documents. Automated package checks pass, but visual render/PNG QA remains `DONE_WITH_CONCERNS` until LibreOffice/`soffice` or a manual Google Docs review is available.
- **Migration Notes**: Contributors may set `CODEX_BUNDLED_PYTHON` and `CODEX_DOCUMENTS_PACKAGE` when the standard bundled-cache locations are unavailable; no npm dependency was added.

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
