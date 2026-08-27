# Technology Context

## Current State

This is a content-first project with two optional faculty-facing browser companions and no API integration or automated deployment. The v1.0 baseline includes the complete classic custom Gem instructions, synthetic scenarios, four-document memory model, deterministic Google Docs-ready DOCX files, nine aligned faculty guides, and browser-only QTI 1.2 packager. Bergen Memory Bank v2.0 has completed all six repository-verifiable phases at package version `2.0.0-dev.1`: the repository now also contains dated platform claims, all seventeen professor-facing workflow aliases with natural-language parity, a complete atomic Google Keep memory contract, coordinated no-code Keep and Canvas handoff guidance, an executable Bergen Course Transfer Block v0.1 validator, and a separate browser-only Bergen Course Packager. The Gem emits exactly one approved JSON block; the packager validates it and deterministically creates one local Common Cartridge 1.3 `.imscc` with embedded QTI 1.2 assessments. Generation, readiness, and download remain in the same browser session, with package bytes completed before readiness is reported. Authorized live classic Gem/Keep verification and unpublished Canvas sandbox acceptance remain Pending; Phase 6 adds no Keep or Canvas API, server-side content transfer, import automation, Bergen Canvas compatibility evidence, or publication authority. Node.js and the bundled document-authoring runtime remain contributor tooling and are never faculty prerequisites.

## Component Structure

| Component | Purpose | Current Location | Format |
|-----------|---------|------------------|--------|
| Memory Bank | Durable planning, task, decision, and verification context for producing the kit | `memory-bank/` | Markdown |
| Release foundation | Preserved 45-artifact v1.0 inventory, 13-artifact v2 delta inventory, package version, phase ownership, status, and review dates | `src/release/release-contract.md`, `src/release/version.md`, `package.json` | Markdown and JSON |
| Authoritative source register | Source-dated pointers and narrow claim mappings for policy and platform assertions, including the 2026-08-26 Keep connected-app and Common Cartridge boundaries | `src/sources/authoritative-source-register.md` | Markdown |
| V2 atomic-memory contract | Normative atomic note title/body, temporary and durable authority, immutable revision chains, deterministic effective-head selection, title-first course isolation, privacy stop, exact-title verification, conflict quarantine, durable reconciliation, and probe-first retry rules | `src/contracts/bergen-memory-v2.md` | Markdown contract only; no executable Keep client or API |
| Whole-course transfer contract and validator | Strict versioned schema, all-or-nothing dependency-free validator, and complete synthetic CIS-277 and ENG-102 fixtures with privacy-first rejection, unpublished Canvas-facing defaults, approval gates, semantic/reference checks, and sanitized deterministic errors | `src/contracts/bergen-course-transfer-v0.1.json`, `src/contracts/bergen-course-transfer-validator.mjs`, `tests/fixtures/sample-course-transfer.json`, `tests/fixtures/sample-course-transfer-eng-102.json` | JSON Schema, Node.js ECMAScript module, and JSON fixtures; the browser bundle mechanically embeds this repository-owned validation contract |
| Verification contract and fixtures | Observable Gem, template, guide, packager, and manual-gate contracts plus synthetic, de-identified test inputs | `src/testing/scenario-matrix.md`, `tests/fixtures/` | Markdown and JSON |
| Validation tooling | Dependency-free build, lint, aggregate validation, and 139 passing checks across thirteen test files | `package.json`, `scripts/validate-release.mjs`, `tests/content/*.test.mjs`, `tests/keep/*.test.mjs`, `tests/course/*.mjs`, `tests/qti/*.mjs` | Node.js ECMAScript modules (`.mjs`) |
| Gemini Gem instructions | Complete privacy kernel, seventeen workflow routes, natural-language parity, course and context selection, staged approvals, observable Keep read/write behavior, current approved course accumulation, complete v0.1 transfer fields/rules, one-block emission, and manual Canvas handoffs for the classic “Bergen Memory Bank” Gem | `src/gem/bergen-memory-bank-instructions.md` | Copy-ready Markdown |
| Google Docs templates | Four faculty knowledge documents generated from four primary Markdown sources; the fifth Markdown source is the reusable Class Learning Snapshot partial embedded in Active Workbench, not a fifth knowledge document | `src/templates/`, `dist/google-docs/` | Markdown sources and four Google Docs-ready DOCX files |
| Document build pipeline | Converts the Markdown sources with `python-docx`, runs the packaged title sanitizer and privacy scrubber, removes `rsid` markup across all XML members, and normalizes ZIP ordering and timestamps | `scripts/build-google-docs.mjs` | Node.js orchestrator with bundled Python document tooling |
| Faculty enablement materials | Eleven aligned guides covering commands, installation, quick start, presentation, prompts, demonstration, privacy, troubleshooting, the no-code Keep memory workflow, whole-course Canvas handoff, and the distinct manual QTI-to-Canvas handoff | `src/guides/` | Copy-ready Markdown |
| QTI packaging companion | Optional browser-only validation and QTI 1.2 ZIP handoff, separate from the Gem, Docs, and Canvas workflow | `apps/qti-packager/`, `demo/` | Client-side Apps Script HTML Service files, self-contained HTML, and synthetic ZIP |
| Whole-course packaging companion | Optional static Apps Script shell with client-only v0.1 validation and deterministic Common Cartridge 1.3 generation; assessments are embedded as QTI 1.2 and the self-contained demo contains no course fixture | `apps/course-packager/`, `scripts/build-course-demo.mjs`, `demo/Bergen-Course-Packager-Demo.html` | Apps Script HTML Service files, browser JavaScript, deterministic stored ZIP bytes, and self-contained HTML; no network, storage, telemetry, or server content processing |

## Platforms and External Services

| Platform | Role | Integration Boundary |
|----------|------|----------------------|
| Classic custom Gemini Gem | Hosts the conversational instructions and interprets prompt aliases | Manual configuration only; exact current capabilities must be confirmed from official Google documentation |
| Google Drive | Holds the faculty-created Bergen Memory Bank folder | Manual file management only |
| Google Docs | Holds reusable memory documents and remains the curated archive | Manual copy, edit, and approved update workflow |
| Google Keep | Active v2 target for atomic, course-scoped memory | Phases 2–3 define observable connected-action behavior and the complete immutable revision, retrieval, verification, conflict, checkpoint, retry, and recovery contracts; live connected-action evidence remains an authorized external gate, and no Keep client or API is included |
| Canvas | Stores student records and receives final approved course content | Manual faculty workflow only; Phase 5 creates local unpublished `.imscc` output but adds no Canvas API, import automation, Bergen compatibility claim, or autonomous publishing. Compatibility remains an authorized manual import and review gate in an unpublished Canvas sandbox |

## Development Commands

Run repository validation from the project root. On Windows, use the `.cmd` executable explicitly:

| Purpose | Windows-safe command | Portable equivalent |
|---------|----------------------|---------------------|
| Run the 135 aggregate contract and implementation checks | `npm.cmd test` | `npm test` |
| Regenerate the self-contained QTI Packager demo and synthetic ZIP | `npm.cmd run build:qti-demo` | `npm run build:qti-demo` |
| Regenerate the self-contained Course Packager demo without embedding a course fixture | `npm.cmd run build:course-demo` | `npm run build:course-demo` |
| Regenerate the four Google Docs-ready DOCX files | `npm.cmd run build:google-docs` | `npm run build:google-docs` |
| Validate release structure, inventory state, version, and source-register count | `npm.cmd run build` | `npm run build` |
| Validate text hygiene, fixture privacy metadata and fields, JSON parsing, and zero third-party dependencies | `npm.cmd run lint` | `npm run lint` |
| Run lint validation, build validation, and the focused tests | `npm.cmd run validate` | `npm run validate` |

There is no separate type-check command. The scripts require a local Node.js/npm installation for repository contributors only; faculty do not run these commands or install Node.js.

The document build also requires the Codex-bundled Python runtime with `python-docx` and the bundled documents package. `CODEX_BUNDLED_PYTHON` and `CODEX_DOCUMENTS_PACKAGE` can provide explicit locations. When unset, the builder discovers the standard bundled Python path and selects the newest compatible documents package from the Codex plugin cache without hard-coding a user profile or package version. It fails with an actionable configuration error when either prerequisite is unavailable.

## Test Execution Strategy

- The aggregate Node.js run reports 139/139 passing checks across thirteen dependency-free test files, combining the preserved v1.0 suites with the v2 Phase 1 foundation, Phase 2 Gem behavior, Phase 3 Keep memory and faculty-guide contracts, Phase 4 Bergen Course Transfer Block validation, Phase 5 browser-only whole-course packaging, and Phase 6 guide/release-evidence alignment.
- The five release-structure tests preserve the v1.0 scripts, dependency boundaries, release version, exact 45-artifact inventory, and synthetic fixture safeguards while checking the v2 Phase 1 identifier, 13-artifact delta inventory, `2.0.0-dev.1` package version, pending live gates, and new suite registration.
- The six source-register tests preserve the dated v1.0 sources and policy/platform boundaries while checking the 2026-08-26 Keep connected-app and Common Cartridge claims without promoting documentation into tenant or compatibility evidence.
- The fourteen atomic-memory checks cover exact note fields, allowed authority classes, stable immutable revision identity, title-first course isolation, deterministic effective-head selection, privacy-before-access, exact-title full-content verification, conflict quarantine, current-chat versus durable reconciliation, and probe-first retry. They inspect the normative content contract and do not execute Google Keep operations or revision-selection code.
- The 21 whole-course transfer checks exercise the v0.1 schema and executable validator against two distinct synthetic courses. They cover raw and parsed privacy short-circuiting, sanitized no-echo errors, strict types and bounds, unique identifiers, order and placement, relationship integrity, rubric and assessment totals, completion rules, approval and input-derived gates, unpublished defaults, null-safe failure, normalized decimal scoring, code-point error ordering, and fail-closed plain-text-only markup rejection. They do not validate or generate a Common Cartridge package.
- The four Common Cartridge checks validate deterministic stored-ZIP bytes, CRC-32 values, Common Cartridge 1.3 manifest/resource profiles, internal links, unpublished course representations, discussion dependencies, embedded five-type QTI 1.2 semantics, XML/HTML escaping, and fail-closed `invalid_xml_character` rejection without exposing source values or package bytes.
- The two Course Packager bundle checks verify the static Apps Script shell, exact source-composed demo freshness, accessible responsive controls, client-only execution, MIME type, zero browser storage/network/telemetry calls, and conservative Canvas handoff language.
- The seven Course Packager browser-smoke checks exercise desktop and mobile journeys, privacy-confirmation gating, completed generation before readiness, byte reuse on download, stale-byte invalidation after input changes or generation errors, XML-invalid input rejection before encoding, and exception-safe object-URL removal and revocation.
- The 35 Gem-workflow tests cover the always-on privacy and capability kernel, all seventeen aliases, equivalent natural-language routes, explicit course and context selection, the seven-stage engine, immutable Keep note fields and authority classes, ordered exact-title verification, initialization, course-scoped resume, memory inspection, visible failure recovery, protected-data recovery, current approved course accumulation, the complete v0.1 normative field and semantic-rule maps, separate final-review and package approvals, exactly-one-block emission, manual Canvas boundaries, the distinct course and QTI assessment-only handoffs, and qualified visible-chat estimates.
- The eight template-contract tests cover the four-document ownership model, source-to-DOCX parity, the embedded Class Learning Snapshot and its exact ordered fields, privacy and Canvas boundaries, explicit course selection, prerequisite constraints, manual faculty-approved recording, and the Google Docs OOXML contract.
- The fifteen guide-alignment checks cover the complete eleven-guide set and nontechnical language, exact eight-step installation, all seventeen aliases plus natural-language parity, observable response fields, privacy recovery, conservative context estimates, the ten-minute presentation, synthetic prompts and demonstration alignment, verified Keep write recovery, approval ordering, bounded Google Docs, Keep, and Canvas actions, the distinct whole-course and assessment-only handoffs, and source-date provenance.
- The 21 QTI regression checks cover transfer parsing and validation, all five item types, scoring and settings, privacy stops, well-formed manifest and assessment XML, deterministic ZIP contents, static Apps Script serving, network/storage prohibitions, accessible responsive UI, privacy-gated download, and desktop/mobile demonstration journeys.
- `scripts/validate-release.mjs` supplies deterministic build and lint checks and invokes the same focused test files for aggregate validation.
- The Phase 4 Gem fixture contains 37 synthetic/de-identified scenarios preserving every `bergen:<workflow>` alias and representative natural-language equivalent while adding the current course-transfer behavior. It covers initialization, resume conflicts, memory inspection, temporary and durable writes, all defined write-failure categories, privacy stops, separate course approvals, and distinct manual course and QTI assessment-only handoffs. The broader scenario matrix also covers template, guide, browser-packaging, and manual compatibility behavior.
- The Phase 3 focused lane reports 26/26 passing checks across `tests/keep/memory-contract.test.mjs` and `tests/content/guide-alignment.test.mjs`. Build and lint also pass; the checks use synthetic/de-identified content and do not claim live Gemini or Keep behavior.
- The Phase 4 focused lane reports 56/56 passing checks across `tests/course/course-transfer.test.mjs` and `tests/content/gem-workflows.test.mjs`; the 21/21 QTI regression lane also passes. At Phase 4 completion, local Common Cartridge generation had not yet been added. Live Gemini/Keep behavior and unpublished Canvas sandbox compatibility remain unclaimed.
- The Phase 5 focused lane reports 13/13 passing checks across `tests/course/common-cartridge.test.mjs`, `tests/course/apps-script-bundle.test.mjs`, and `tests/course/browser-smoke.mjs`; the 21/21 QTI regression lane and the 135/135 aggregate lane also pass. Build, lint, deterministic demo regeneration, security/privacy review, CSS privacy scanning, and zero-dependency review pass. These checks establish local package generation, not live Gemini/Keep behavior or Bergen Canvas import, interpretation, compatibility, or publication.
- V1 Phase 3 verification additionally checked all four generated packages with the packaged title sanitizer, accessibility checks, and package-wide OOXML, `google_docs_default`, privacy, and deterministic-output checks. Document render/PNG visual QA is `DONE_WITH_CONCERNS` because the bundled environment has no LibreOffice/`soffice`; Google Docs import and visual inspection remain a manual release check rather than a claimed automated pass.
- Tests, demonstrations, and compatibility checks use only synthetic or de-identified example data. Credentials, protected records, and real student data must never enter repository artifacts.
- Manually verify the installation path in an authorized non-production Gem and faculty-owned test documents before release; credentials and protected records must never enter repository artifacts.

## Technology Stack

- **Repository documentation**: Markdown.
- **Repository validation runtime**: Node.js ECMAScript modules using only built-in modules, including `node:test`; no third-party dependencies or development dependencies.
- **Whole-course validation**: `src/contracts/bergen-course-transfer-validator.mjs` loads the repository-owned v0.1 JSON Schema and performs privacy-first, strict schema and semantic validation for a Bergen Course Transfer Block; it introduces no new runtime, dependency, configuration, service, or network boundary.
- **Whole-course browser packaging**: `apps/course-packager/Script.html` mechanically embeds the v0.1 validator and schema, rejects strings that XML 1.0 cannot represent with sanitized `invalid_xml_character` errors, renders Common Cartridge 1.3 resources and embedded QTI 1.2 assessments, and builds deterministic uncompressed ZIP bytes entirely in browser memory. The same page exposes readiness only after byte generation succeeds and reuses those exact bytes for local download.
- **Package scripts**: npm command aliases in `package.json` for test, build, lint, and aggregate validation; the current development package version is `2.0.0-dev.1`.
- **Document authoring runtime**: Codex-bundled Python with `python-docx`, plus the bundled documents package title-sanitization and privacy-scrubbing helpers; this is a contributor build-time dependency, not a package.json dependency or faculty prerequisite.
- **Faculty-facing authoring and archive**: Google Docs in Google Drive remain an optional curated archive; they are not the v2 daily-memory layer or a Keep-repair requirement.
- **V2 active-memory target**: Google Keep through observable connected actions; Phases 2–3 supply the Gem behavior plus immutable revision, retrieval, verification, conflict, checkpoint, retry, recovery, and faculty-guidance contracts, with no executable client, API, or live-service claim.
- **Conversational host**: Classic custom Gemini Gem created with a `bergen.edu` account.
- **Student-record and publishing system**: Canvas.
- **APIs and product automation**: No Canvas API, Keep API/client, autonomous document editing, automated grading, autonomous publishing, import automation, or server-side packaging has been added through v2 Phase 6. The local browser course packager and `.imscc` output do not establish Bergen Canvas Common Cartridge compatibility, successful import, interpretation, or publication.
- **Implemented optional companion**: The Gem prepares only an approved text-only Bergen Quiz Transfer Block. The separate client-side QTI Packager validates it and creates the local ZIP without sending quiz content to Apps Script or another service.

<!-- AUTO-MANAGED: c4-references-start -->
## C4 References

C4 architecture documentation has not been generated, and no C4 manifest exists. The architecture is documented in `memory-bank/systemPatterns.md`; the absence of a C4 manifest does not change the client-side-only boundaries of either optional packager.

<!-- AUTO-MANAGED: c4-references-end -->

## Recent Technology Changes

### 2026-08-27 - Completed Phase 6 repository and guidance alignment

- **What Changed**: Aligned all eleven faculty guides, release/version records, source provenance, scenario coverage, and aggregate validation with the completed v2 repository. Aggregate validation now reports 139/139 checks, while authorized live classic Gem/Keep and unpublished Canvas sandbox evidence remain Pending.
- **Reason**: Make repository readiness and external acceptance states explicit without overstating unobserved integrations.
- **Impact**: Faculty guidance now presents one verified Keep-to-Canvas journey and clearly separates whole-course `.imscc` packaging from assessment-only QTI packaging. No runtime, dependency, infrastructure, or external integration changed.
- **Migration Notes**: None. Authorized synthetic live acceptance remains a manual release gate.

### 2026-08-27 - Added the browser-only Bergen Course Packager

- **What Changed**: Added a static Apps Script HTML Service bundle, mechanically embedded v0.1 validation contract, deterministic Common Cartridge 1.3 stored-ZIP generation with embedded QTI 1.2 assessments, self-contained fixture-free demo, `build:course-demo` command, and 13 focused checks. Aggregate validation now reports 135/135 across thirteen test files with zero package dependencies.
- **Reason**: Convert one complete approved whole-course handoff into a locally downloadable unpublished course package while keeping content out of servers, browser storage, telemetry, and Canvas automation.
- **Impact**: Identical approved input produces byte-stable `.imscc` output and different approved courses produce different packages. XML 1.0-invalid text fails with `invalid_xml_character`; any validation or generation failure keeps download disabled and cannot expose stale package bytes. Readiness is reported only after generation completes.
- **Migration Notes**: An authorized Bergen deployment and a synthetic import into an unpublished Canvas sandbox remain external manual gates. This implementation does not establish live Gemini/Keep behavior, Bergen Canvas compatibility, import success, or publication authority.

### 2026-08-27 - Added the v0.1 Bergen Course Transfer Block validator

- **What Changed**: Added a dependency-free Node.js `.mjs` validator over the repository-owned JSON Schema, a second synthetic course fixture, complete Gem-side field and semantic-rule maps, and 21 focused validator checks. The Phase 4 focused lane totals 56 checks, the QTI regression lane totals 21, and aggregate validation reports 122/122.
- **Reason**: Provide deterministic all-or-nothing validation and a complete syllabus-to-course handoff contract before browser packaging begins.
- **Impact**: Repository validation now proves privacy-first sanitized rejection, strict schema and relationship semantics, normalized scoring, deterministic errors, unpublished and approval boundaries, and two distinct validator-compatible courses. Live Gemini/Keep checks and unpublished Canvas sandbox compatibility remain external gates.
- **Migration Notes**: None. No dependency, runtime, configuration, deployment, API, course packager, Common Cartridge, `.imscc`, Canvas import, or publication capability was added.

### 2026-08-26 - Completed the v2 Phase 3 Keep memory contract and faculty guide

- **What Changed**: Expanded the atomic-memory contract with deterministic effective-head and archived-head decisions, title-first course isolation, conflict quarantine, clean-record reconciliation, low-risk checkpoint limits, probe-first idempotent retry, and exact observable report shapes. Added the tenth faculty guide and expanded the two focused suites to 26 checks.
- **Reason**: Give faculty and future implementation phases one precise, no-code contract for safe memory revision, retrieval, verification, conflict, checkpoint, and recovery behavior.
- **Impact**: Aggregate validation now reports 98/98 passing checks across ten dependency-free test files. Build, lint, code review, and dependency/security review pass. Live Gemini/Keep connected actions and Canvas compatibility remain unclaimed external gates.
- **Migration Notes**: None. No dependency, runtime, configuration, deployment, Keep API/client, or Canvas integration was added.

### 2026-08-26 - Implemented the v2 Phase 2 Gem and Keep behavior contracts

- **What Changed**: Expanded the classic Gem contract to seventeen workflow aliases and equivalent natural-language routes; added initialization, course-scoped resume, memory inspection, immutable temporary and durable Keep writes, exact-title full-content verification, visible recovery for five failure categories, and distinct course and assessment handoffs. Expanded the synthetic Phase 2 fixture to 37 scenarios and the focused Gem suite to 30 checks.
- **Reason**: Make the professor-facing command and memory behavior deterministic and reviewable before relying on an authorized live connected Keep action.
- **Impact**: Aggregate validation now reports 81/81 passing checks with zero third-party dependencies. Build and lint pass, while live Keep persistence and Canvas compatibility remain unclaimed external gates.
- **Migration Notes**: None. Google Keep becomes the instructed active-memory target, Google Docs remain an optional curated archive, and Canvas remains the protected student-record and faculty-controlled publication system.

### 2026-08-26 - Established the v2 Phase 1 contract and validation foundation

- **What Changed**: Advanced the package to `2.0.0-dev.1`; added the normative atomic Keep note contract, strict whole-course JSON Schema, complete synthetic CIS-277 fixture, eight dated v2 platform sources, two new focused test files, and v2 release-inventory checks.
- **Reason**: Fix privacy, authority, immutable revision, observable write-verification, unpublished transfer, and external acceptance boundaries before implementing connected behavior or browser packaging.
- **Impact**: Aggregate validation now reports 69/69 passing checks with zero third-party dependencies. No executable Keep client or API, v2 Gem behavior, course-transfer validator, course packager, Common Cartridge file, Canvas integration, or faculty-facing capability was added.
- **Migration Notes**: None. The preserved v1.0 Gem, Google Docs archive, and optional QTI Packager remain intact while v2 implementation proceeds through later phases.

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
