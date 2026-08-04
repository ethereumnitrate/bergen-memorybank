# Bergen Memory Bank v1.0 Release Contract

## Release boundary

Bergen Memory Bank v1.0 is planned as a no-code faculty kit: one custom Gemini Gem, four reusable Google Docs, faculty enablement material, and an optional browser-only QTI packaging handoff. Phases 1 through 4 establish the repository foundation, the complete classic custom Gem instruction system, the four-document hybrid memory model with a replaceable de-identified Class Learning Snapshot, and the aligned faculty guides. A listed artifact is evidence only for the phase and behavior its tests verify.

Canvas remains the student-record system and the final manual publishing destination. The implemented Gem, memory documents, and faculty guides use teaching context and synthetic or de-identified class-level observations only; the future optional QTI Packager must preserve the same boundary. Revision requires explicit faculty approval, and recording and publication require separate approvals. Google Docs persistence and Canvas transfer require faculty manual action. Quiz import and publication also remain faculty-controlled manual steps.

## Capability boundaries

Version 1.0 does not claim or implement native Gemini commands, Gem plugins or custom actions, automatic Google Docs editing, a Canvas API, automated grading, individual student profiling, autonomous Canvas publication, server-side quiz-content handling, accounts, databases, or telemetry. Optional `bergen:<workflow>` strings are documented as case-insensitive prompt aliases with natural-language equivalents, not as platform integrations.

Phase 4 creates and content-tests the command reference, installation guide, quick start, presentation script, sample prompts, aligned demonstration, privacy checklist, troubleshooting guidance, and QTI-to-Canvas handoff. It does not create or deploy the Phase 5 QTI Packager, live application, demonstration page, or ZIP. Those Phase 5 artifacts remain pending until implemented and verified.

## Status meanings

- **Ready**: present and verified in a completed implementation phase.
- **Pending**: required for v1.0, assigned to an unimplemented phase, and intentionally absent now.

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
| `apps/qti-packager/Code.gs` | Pending | 5 | Apps Script entry point and deployment surface |
| `apps/qti-packager/Index.html` | Pending | 5 | Accessible packager page shell |
| `apps/qti-packager/Styles.html` | Pending | 5 | HTML Service style include |
| `apps/qti-packager/Script.html` | Pending | 5 | Browser-only validation and QTI packaging behavior |
| `apps/qti-packager/appsscript.json` | Pending | 5 | Minimal Apps Script manifest |
| `apps/qti-packager/README.md` | Pending | 5 | Deployment, verification, and rollback guide |
| `demo/Bergen-QTI-Packager-Demo.html` | Pending | 5 | Self-contained presentation fallback |
| `demo/bergen-qti-compatibility-check-qti.zip` | Pending | 5 | Synthetic compatibility fallback package |
| `scripts/build-qti-demo.mjs` | Pending | 5 | Demo and fallback-package build entry point |
| `tests/qti/qti-packager.test.mjs` | Pending | 5 | QTI validation and package checks |
| `tests/qti/apps-script-bundle.test.mjs` | Pending | 5 | Deployment-bundle and privacy checks |
| `tests/qti/browser-smoke.mjs` | Pending | 5 | Local presentation-journey smoke check |

## Release gates

The local `npm run validate` command is the aggregate repository gate. It runs the completed Phase 1 through Phase 4 content suites; Phase 5 will extend the focused suites without weakening this contract.

Automated structure checks and local browser checks may establish artifact integrity. They cannot establish compatibility with Bergen's Canvas configuration. Version 1.0 QTI compatibility remains unapproved until an authorized Bergen faculty or support user imports the synthetic package into an unpublished Bergen Canvas test course, verifies the five supported item types and settings without student data, and records the result.

## Deliberately not verified through Phase 4

The content suites verify static instructions, templates, and faculty-guide contracts; they cannot execute or inspect live Gemini responses. Phase 3 produced four Google Docs-ready DOCX files but did not create live Drive documents because a Drive connection was unavailable. Automated OOXML, privacy, accessibility, and source-parity checks passed, but visual rendering was unavailable because the bundled document runtime did not include the required office renderer; that visual QA limitation remains recorded.

Phases 1–4 do not test hidden context, live tenant access, automatic Google Docs editing, Canvas publication, real student records, browser packaging, QTI XML, a live QTI URL, or Canvas import compatibility. Each is assigned to Phase 5, prohibited, unavailable to deterministic local tests, or reserved for the authorized manual release gate.
