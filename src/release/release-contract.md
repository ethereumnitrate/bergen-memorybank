# Bergen Memory Bank Release Contract

## Bergen Memory Bank v2 Phase 1 boundary

Bergen Memory Bank v2.0 is in development. Phase 1 establishes only the dated source boundary, the normative atomic Google Keep note contract, the machine-readable whole-course transfer contract, one complete synthetic CIS-277 fixture, and repository structure checks. It does not yet implement the v2 Gem commands, Keep retrieval or write behavior, immutable-chain selection, faculty guides, course-transfer validator, browser packager, Common Cartridge generator, or aggregate finalization.

The v2 design changes the v1 manual-only persistence boundary only for a connected Google Keep action that is observed and then verified by exact-title retrieval and full content comparison. Repository structure checks cannot satisfy that live gate. A creation, retrieval, comparison, authorization, or availability failure remains failed and unverified.

The whole-course schema is strict input evidence for later work, not a generated Common Cartridge. Every Canvas-facing fixture object defaults to unpublished, protected or identifiable student information is prohibited, and authorized import into an unpublished Bergen Canvas sandbox remains required before any compatibility claim. Canvas publication remains a separate faculty decision.

## Preserved v1.0 release boundary

Bergen Memory Bank v1.0 is a no-code faculty kit: one custom Gemini Gem, four reusable Google Docs, faculty enablement material, and an optional browser-only QTI packaging handoff. Phases 1 through 5 establish the repository foundation, complete classic custom Gem instruction system, four-document hybrid memory model with a replaceable de-identified Class Learning Snapshot, aligned faculty guides, and deployable client-side QTI Packager source with a self-contained demonstration and synthetic compatibility package. A listed artifact is evidence only for the phase and behavior its tests verify.

Canvas remains the student-record system and the final manual publishing destination. The implemented Gem, memory documents, and faculty guides, together with the implemented optional QTI Packager, use teaching context and synthetic or de-identified class-level observations only. Revision requires explicit faculty approval, and recording and publication require separate approvals. Google Docs persistence and Canvas transfer require faculty manual action. Quiz import and publication also remain faculty-controlled manual steps.

## Capability boundaries

Version 1.0 does not claim or implement native Gemini commands, Gem plugins or custom actions, automatic Google Docs editing, a Canvas API, automated grading, individual student profiling, autonomous Canvas publication, server-side quiz-content handling, accounts, databases, or telemetry. Optional `bergen:<workflow>` strings are documented as case-insensitive prompt aliases with natural-language equivalents, not as platform integrations.

Phase 5 implements and locally verifies the optional QTI Packager as a Google Apps Script HTML Service bundle whose server entry point serves static HTML only. Quiz validation, QTI 1.2 XML generation, and ZIP creation occur in the active browser without sending quiz content to Apps Script functions or any external service. The phase also supplies a self-contained presentation page and a synthetic prebuilt ZIP. It does not deploy a live institution page, change Canvas, or establish Bergen Canvas compatibility.

## Status meanings

- **Ready**: present and verified in a completed implementation phase.
- **Pending**: for the preserved v1.0 inventory, required evidence that still needs an authorized manual action; for the v2 inventory, a planned v2 implementation or authorized external gate that Phase 1 has not completed. A v1 artifact may exist while its v2 extension remains Pending.

## Complete v1.0 artifact inventory

| Artifact | Status | Phase | Purpose |
|---|---|---:|---|
| `package.json` | Ready | 1 | Dependency-free repository commands |
| `src/release/release-contract.md` | Ready | 1 | Release scope, safeguards, and complete inventory |
| `src/release/version.md` | Ready | 1 | Visible release identifier and review date |
| `src/sources/authoritative-source-register.md` | Ready | 1 | Dated official-source claim mapping |
| `src/testing/scenario-matrix.md` | Ready | 1 | Verification contract and later-phase scaffold |
| `scripts/validate-release.mjs` | Ready | 1 | Local aggregate validation harness |
| `tests/content/release-structure.test.mjs` | Ready | 1 | Release, version, inventory, and fixture checks |
| `tests/content/source-register.test.mjs` | Ready | 1 | Dated-source and claim-boundary checks |
| `tests/fixtures/workflow-scenarios.json` | Ready | 1 | Synthetic scenario seeds for later workflow tests |
| `tests/fixtures/sample-quiz.json` | Ready | 1 | Synthetic quiz seed for later packaging tests |
| `src/gem/bergen-memory-bank-instructions.md` | Ready | 2 | Gem safety, routing, context, and stage instructions |
| `tests/content/gem-workflows.test.mjs` | Ready | 2 | Workflow and safeguard content contracts |
| `src/templates/faculty-profile.md` | Ready | 3 | Shared stable faculty preferences template |
| `src/templates/course-memory.md` | Ready | 3 | Course-specific durable memory template |
| `src/templates/active-workbench.md` | Ready | 3 | Course-specific active work and snapshot template |
| `src/templates/decisions-reflections-reusable-practices.md` | Ready | 3 | Shared durable practices template |
| `src/templates/class-learning-snapshot.md` | Ready | 3 | Reusable de-identified snapshot section source |
| `dist/google-docs/Bergen Memory Bank - Faculty Profile.docx` | Ready | 3 | Google Docs-ready Faculty Profile |
| `dist/google-docs/Bergen Memory Bank - Course Memory.docx` | Ready | 3 | Google Docs-ready Course Memory |
| `dist/google-docs/Bergen Memory Bank - Active Workbench.docx` | Ready | 3 | Google Docs-ready Active Workbench |
| `dist/google-docs/Bergen Memory Bank - Decisions Reflections and Reusable Practices.docx` | Ready | 3 | Google Docs-ready shared practices document |
| `scripts/build-google-docs.mjs` | Ready | 3 | Deterministic document build entry point |
| `tests/content/template-contracts.test.mjs` | Ready | 3 | Document ownership and snapshot checks |
| `src/guides/command-reference.md` | Ready | 4 | Prompt-alias and natural-language reference |
| `src/guides/installation-guide.md` | Ready | 4 | Five-minute, eight-step installation guide |
| `src/guides/faculty-quick-start.md` | Ready | 4 | Faculty quick start |
| `src/guides/presentation-script.md` | Ready | 4 | Ten-minute presentation script |
| `src/guides/sample-prompts.md` | Ready | 4 | Examples for all supported workflows |
| `src/guides/end-to-end-demonstration.md` | Ready | 4 | Lesson-to-record demonstration |
| `src/guides/privacy-checklist.md` | Ready | 4 | Safe-data and recovery checklist |
| `src/guides/troubleshooting.md` | Ready | 4 | Capability, context, and fallback guidance |
| `src/guides/qti-canvas-handoff.md` | Ready | 4 | Manual packaging and Canvas import guide |
| `tests/content/guide-alignment.test.mjs` | Ready | 4 | Guide and demonstration consistency checks |
| `apps/qti-packager/Code.gs` | Ready | 5 | Static Apps Script HTML entry point |
| `apps/qti-packager/Index.html` | Ready | 5 | Accessible packager page shell |
| `apps/qti-packager/Styles.html` | Ready | 5 | Responsive HTML Service style include |
| `apps/qti-packager/Script.html` | Ready | 5 | Browser-only validation and QTI packaging behavior |
| `apps/qti-packager/appsscript.json` | Ready | 5 | Minimal Apps Script manifest |
| `apps/qti-packager/README.md` | Ready | 5 | Authorized deployment, verification, and rollback guide |
| `demo/Bergen-QTI-Packager-Demo.html` | Ready | 5 | Self-contained presentation fallback |
| `demo/bergen-qti-compatibility-check-qti.zip` | Ready | 5 | Synthetic compatibility fallback package |
| `scripts/build-qti-demo.mjs` | Ready | 5 | Deterministic demo and fallback-package build entry point |
| `tests/qti/qti-packager.test.mjs` | Ready | 5 | QTI validation and package checks |
| `tests/qti/apps-script-bundle.test.mjs` | Ready | 5 | Deployment-bundle and privacy checks |
| `tests/qti/browser-smoke.mjs` | Ready | 5 | Local desktop/mobile presentation-journey smoke checks |

## Bergen Memory Bank v2 inventory

This delta inventory describes v2 readiness only. It does not downgrade the preserved v1.0 artifacts above. Phase 1 tests and contracts marked Ready validate foundation structure; later behavior remains Pending even where a v1 file at the same path already exists.

| Artifact | Status | Phase | V2 responsibility |
|---|---|---:|---|
| `src/contracts/bergen-memory-v2.md` | Ready | 1 | Normative atomic Keep note, authority, revision, isolation, verification, conflict, privacy, and failure contract |
| `src/contracts/bergen-course-transfer-v0.1.json` | Ready | 1 | Strict versioned whole-course transfer schema |
| `tests/fixtures/sample-course-transfer.json` | Ready | 1 | Complete synthetic and de-identified CIS-277 transfer fixture |
| `tests/keep/memory-contract.test.mjs` | Ready | 1 | Phase 1 memory-contract structure check; revision algorithms remain later work |
| `tests/course/course-transfer.test.mjs` | Ready | 1 | Phase 1 schema, fixture, safety, and reference checks; the executable validator remains later work |
| `src/gem/bergen-memory-bank-instructions.md` | Pending | 2 | V2 professor commands and observable connected Keep behavior |
| `src/guides/keep-memory-workflow.md` | Pending | 3 | No-code faculty Keep workflow and recovery guidance |
| `src/guides/canvas-course-handoff.md` | Pending | 6 | No-code whole-course packaging, sandbox review, and publication boundary |
| `apps/course-packager/Script.html` | Pending | 5 | Browser-only validation and Common Cartridge generation |
| `scripts/build-course-demo.mjs` | Pending | 5 | Deterministic local course-packager demonstration build |
| `tests/course/common-cartridge.test.mjs` | Pending | 5 | Manifest, resource, embedded assessment, escaping, and determinism checks |
| `tests/course/apps-script-bundle.test.mjs` | Pending | 5 | Static hosting and client-only privacy checks |
| `tests/course/browser-smoke.mjs` | Pending | 5 | Desktop and mobile whole-course packaging journey checks |

## Release gates

The local `npm run validate` command is the aggregate repository gate. Its authoritative result is 69/69 passing checks without third-party dependencies, combining the preserved v1.0 checks with the v2 Phase 1 foundation checks.

Automated structure checks and local browser checks may establish artifact integrity. They cannot establish compatibility with Bergen's Canvas configuration. Version 1.0 QTI compatibility remains unapproved until an authorized Bergen faculty or support user imports the synthetic package into an unpublished Bergen Canvas test course, verifies the five supported item types and settings without student data, and records the result.

## Deliberately not verified by the local build

The content suites verify static instructions, templates, and faculty-guide contracts; they cannot execute or inspect live Gemini responses. Phase 3 produced four Google Docs-ready DOCX files but did not create live Drive documents because a Drive connection was unavailable. Automated OOXML, privacy, accessibility, and source-parity checks passed, but visual rendering was unavailable because the bundled document runtime did not include the required office renderer; that visual QA limitation remains recorded.

The local build does not test hidden context, live tenant access, automatic Google Docs editing, Canvas publication, real student records, a deployed Apps Script page, Bergen-domain access controls, or Canvas import compatibility. Automated checks establish browser behavior, QTI structure, and deterministic artifacts only. The authorized manual unpublished-course import remains the QTI compatibility release gate.
