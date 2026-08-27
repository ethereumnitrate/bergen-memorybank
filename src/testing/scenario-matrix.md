# Scenario Verification Matrix

## Verification purpose through Phase 6

This file is the human-readable verification matrix for Bergen Memory Bank v1.0 through Phase 6. It maps synthetic inputs to observable Gem instructions, Keep contracts, template content, faculty guides, browser-packager behavior, artifact structure, approval, privacy, and safe next steps. It does not claim access to Gemini's hidden behavior, a live Apps Script page, connected Google Keep evidence, or Bergen Canvas compatibility.

## Phase 6 aggregate and authorized acceptance scenarios

The intended synthetic journey is Gemini → connected Google Keep → Bergen Course Packager → authorized unpublished Canvas sandbox. Repository checks verify every local contract; the connected actions and Canvas import remain Pending until an authorized observer records the exact evidence below.

Across the eleven faculty guides, the complete journey is verified Google Keep memory → one approved Bergen Course Transfer Block → one browser-local `.imscc` → manual import and review in an unpublished Canvas sandbox. The whole-course `.imscc` route remains distinct from the assessment-only QTI route. Connected Gem/Keep evidence is Pending, Canvas compatibility evidence is Pending, and Canvas publication remains manual.

| Acceptance criterion | Repository-verifiable behavior | Authorized external evidence | Status |
|---|---|---|---|
| AC-ENTRY-1 | Seventeen typed aliases, natural-language parity, privacy, course, stage, and next-command behavior align across Gem and guides | Invoke every v2 entry route in a classic Gem | Repository Ready; external Pending |
| AC-HAPPY-1 | Initialization limits automatic authority to a temporary checkpoint and reports all verification fields | Observe synthetic R001 create, exact-title retrieval, full comparison, and report | Repository Ready; external Pending |
| AC-HAPPY-2 | Durable approval, immutable R002, exact `Supersedes`, and unchanged R001 are contract checked | Retrieve both synthetic notes and compare the approved revision | Repository Ready; external Pending |
| AC-HAPPY-3 | Resume filters by course and deterministically selects verified active revisions | Start a new chat and observe course-specific retrieval | Repository Ready; external Pending |
| AC-HAPPY-4 | Memory inspection lists exact titles, classes, superseded records, conflicts, and last verified write | Compare displayed titles with retrievable synthetic notes | Repository Ready; external Pending |
| AC-HAPPY-5 | The approved CIS-277 course emits one versioned input-derived transfer block with unpublished defaults | Observe the Gem handoff from the current approved synthetic course | Repository Ready; external Pending |
| AC-HAPPY-6 | Valid input generates deterministic local `.imscc` bytes only after `Course package ready` | Use the authorized page if supplied; local browser behavior is already verified | Repository Ready; external Pending |
| AC-HAPPY-7 | Five QTI item types, privacy gate, local ZIP, and assessment-only boundary remain preserved | Import only in an authorized unpublished test course | Repository Ready; external Pending |
| AC-ERROR-1 | Create, retrieval, mismatch, duplicate, and unavailable results fail without false success; recovery stays in Gemini | Exercise a safely reproducible denied or unavailable result | Repository Ready; external Pending |
| AC-ERROR-2 | Privacy stops before retrieval, memory, validation, packaging, or object creation without echo | Use only an approved synthetic signal; never real protected data | Repository Ready; external Pending |
| AC-ERROR-3 | Broken chains, gaps, cycles, duplicates, and cross-course links remain visibly unresolved | Observe exact safe conflicting titles in an authorized test account | Repository Ready; external Pending |
| AC-ERROR-4 | Invalid transfer input creates no partial ZIP or stale download and exposes only safe corrections | Local browser checks are sufficient; no Canvas action is attempted | Ready |
| AC-ASYNC-1 | Keep success follows create → retrieve → compare → report; local readiness follows completed generation | Record Canvas queued/running states, wait for Completed, then inspect unpublished Modules | Repository Ready; external Pending |

## Phase 5 QTI Packager scenarios

| Check | Source contract | Observable contract | Automated test |
|---|---|---|---|
| Transfer parsing | Approved Bergen Quiz Transfer Block | Plain and fenced JSON parse; malformed text reports a correctable issue | `qti-packager.test.mjs` check 1 |
| Five item types and settings | Synthetic five-item fixture | Multiple choice, true/false, multiple answer, short answer, and essay validate with 12 total points | `qti-packager.test.mjs` check 2 |
| Invalid and unsupported content | Missing answer, invalid points, or unsupported type | No ZIP; correctable issue and reviewed manual-entry fallback | `qti-packager.test.mjs` check 3 |
| Protected-data signal | Synthetic possible-identifier pattern | Stop packaging and require removal; no ZIP | `qti-packager.test.mjs` check 4 |
| QTI XML | Manifest and assessment | Well-formed QTI 1.2 XML contains five Canvas item labels plus approved quiz settings | `qti-packager.test.mjs` check 5 |
| Deterministic ZIP | Valid synthetic transfer block | Local ZIP contains only `imsmanifest.xml` and `assessment.xml` and is byte-stable | `qti-packager.test.mjs` check 6 |
| Deployment bundle | Apps Script source and deployment guide | Complete static bundle; domain restriction is an authorized deployment setting, not a manifest claim | `apps-script-bundle.test.mjs` check 1 |
| Browser-only boundary | Apps Script entry point and browser script | Static HTML serving only; no quiz-content server call, storage, telemetry, URL transfer, or Canvas connection | `apps-script-bundle.test.mjs` check 2 |
| Accessible privacy gate | Page shell, styles, and browser script | Labeled input, live status, explicit privacy checkbox, responsive layout, exact success text, and manual Canvas boundary | `apps-script-bundle.test.mjs` check 3 |
| Desktop journey | Self-contained demo at desktop width | Load sample → check → privacy confirmation → local ZIP download succeeds | `browser-smoke.mjs` check 1 |
| Mobile journey | Self-contained demo at mobile width | The same privacy-gated local journey succeeds | `browser-smoke.mjs` check 2 |
| Browser fallback | Unsupported synthetic transfer block | Download remains disabled and the manual-entry fallback is visible | `browser-smoke.mjs` check 3 |

## Phase 4 guide scenarios

| Check | Source contract | Observable contract | Automated test |
|---|---|---|---|
| Guide set and language | Eleven faculty guides | All requested guides exist; faculty prose avoids internal paths, source-format mechanics, and technical workflow language | `guide-alignment.test.mjs` check 1 |
| Five-minute installation | Installation guide | Exactly eight numbered requirements; access checks remain optional preflight or troubleshooting | `guide-alignment.test.mjs` check 2 |
| Commands and quick start | Command reference and quick start | All seventeen workflows and exact purposes; natural-language parity; explicit course selection; observable context, minimum question, stage, next command, and approval gates | `guide-alignment.test.mjs` check 3 |
| Privacy and context | Privacy checklist and quick start | Complete protected-data stop and blank snapshot recovery; conservative, low-confidence, rounded visible-chat estimate with all exclusions and action bands | `guide-alignment.test.mjs` check 4 |
| Ten-minute presentation | Presentation script | Contiguous timed sections total 10:00 and demonstrate safe value, privacy, verified Keep memory, all seventeen workflows, distinct course/QTI packaging, and manual Canvas | `guide-alignment.test.mjs` check 5 |
| Prompt examples | Sample prompts | One safe alias example and one safe natural-language example for every workflow | `guide-alignment.test.mjs` check 6 |
| Aligned demonstration | End-to-end demonstration | One synthetic course, outcome, concept set, and criteria remain aligned through lesson, assignment, rubric, review, approved revision, verified Keep record, local `.imscc`, and unpublished Canvas review | `guide-alignment.test.mjs` check 7 |
| Recovery and QTI handoff | Troubleshooting and QTI-to-Canvas guide | Complete recovery paths, manual fallback, five item types, browser/local-only boundaries, unpublished test course, no live-link availability or compatibility claim | `guide-alignment.test.mjs` check 8 |

## Phase 3 template and document scenarios

| Check | Source contract | Observable contract | Automated test |
|---|---|---|---|
| Four-document package | Four faculty knowledge Markdown sources and four Google Docs-ready DOCX files | One shared Faculty Profile; one shared Decisions, Reflections, and Reusable Practices document; one Course Memory and Active Workbench pair per course; no separate snapshot DOCX | `template-contracts.test.mjs` check 1 |
| One primary home | All four knowledge templates | Each template declares one distinct primary home and directs other facts to their owning document | `template-contracts.test.mjs` check 2 |
| Embedded snapshot | `class-learning-snapshot.md` and `active-workbench.md` | The source partial appears exactly once inside Active Workbench and identifies itself as temporary and replaceable rather than a fifth knowledge document | `template-contracts.test.mjs` check 3 |
| Required snapshot fields | `class-learning-snapshot.md` | All ten required fields appear once, in the approved order, with no additional form fields | `template-contracts.test.mjs` check 4 |
| Snapshot privacy | `class-learning-snapshot.md` | De-identified class-level observations only; every prohibited data category is named; protected data stays in Canvas | `template-contracts.test.mjs` check 5 |
| Course selection | Course Memory and Active Workbench | Select and echo the course before use; make no claim that selection persists into a new Gemini chat | `template-contracts.test.mjs` check 6 |
| Future-concept guard | `class-learning-snapshot.md` | Concepts not yet introduced and knowledge not to assume are hard constraints; uncertain concepts trigger clarification | `template-contracts.test.mjs` check 7 |
| Manual record proposal | All four knowledge templates | `bergen:record` waits for faculty approval, names exactly one primary target, supplies copy-ready text, and requires manual paste without an automatic save or sync claim | `template-contracts.test.mjs` check 8 |

## Workflow scenarios

| Scenario | Synthetic input intent | Observable header | Context and minimum-question contract | Stage and next-command contract | Status |
|---|---|---|---|---|---|
| Help | Mixed-case `bergen:help` | `Bergen Memory Bank Â· Help` | Shared setup status; no course required | Remember; setup or course | Verified |
| Setup | Check attached memory roles | `Bergen Memory Bank Â· Setup` | Name available and missing document roles; ask one setup fact only if needed | Remember; course | Verified |
| Init | Initialize a synthetic course from its syllabus | `Bergen Memory Bank Â· Init` | Echo selected course; propose durable facts; verify only an allowed temporary checkpoint automatically | Remember or Frame; course or lesson | Repository Verified; connected Keep Pending |
| Resume | Resume one synthetic course in a new chat | `Bergen Memory Bank Â· Resume` | Retrieve only course-scoped notes; list exact verified titles; surface conflicts | Remember or later; current safe next step | Repository Verified; connected Keep Pending |
| Memory | Inspect the active memory basis | `Bergen Memory Bank Â· Memory` | List active, superseded, and conflicting exact note titles plus last verified write | Remember or later; current safe next step | Repository Verified; connected Keep Pending |
| Course | Plan a synthetic course module | `Bergen Memory Bank Â· Course` | Echo selected course; use relevant Course Memory and Workbench facts | Frame or later; lesson, review, or record | Verified |
| Lesson | Plan an introductory lesson | `Bergen Memory Bank Â· Lesson` | Selected course, outcomes, concepts introduced; one missing fact at most | Plan or Draft; assignment or review | Verified |
| Assignment | Draft a synthetic knowledge check | `Bergen Memory Bank Â· Assignment` | Selected course, outcomes, constraints, approval state | Draft; rubric or review | Verified |
| Rubric | Draft aligned synthetic criteria | `Bergen Memory Bank Â· Rubric` | Selected course and assignment facts; no individual scoring | Draft; review | Verified |
| Reinforce | Use a de-identified class snapshot | `Bergen Memory Bank Â· Reinforce` | Selected course and safe snapshot; hard prerequisite constraints | Plan; review | Verified |
| Review | Inspect a synthetic artifact without changing it | `Bergen Memory Bank Â· Review` | State artifact, outcomes, context, and approval state | Review; revise | Verified |
| Revise | Apply an approved clarity change | `Bergen Memory Bank Â· Revise` | Use the reviewed artifact and explicit change list only | Revise; review | Verified |
| Message | Draft a general class announcement | `Bergen Memory Bank Â· Message` | Class-wide facts only; audience and purpose | Draft; review | Verified |
| Reflect | Reflect on de-identified class-level patterns | `Bergen Memory Bank Â· Reflect` | Separate observation, inference, and uncertainty | Review; record after approval | Verified |
| Record | Propose a durable approved update | `Bergen Memory Bank Â· Record` | Display one atomic revision, require separate approval, then create, retrieve, compare, and report | Record; help or course | Repository Verified; connected Keep Pending |
| Package course | Prepare one approved whole-course handoff | `Bergen Memory Bank Â· Package Course` | Use the current approved course; emit one Bergen Course Transfer Block with unpublished defaults | Record; manual local `.imscc` packaging | Repository Verified; Canvas Pending |
| Package assessment | Prepare one approved assessment-only handoff | `Bergen Memory Bank Â· Package Assessment` | Use the approved quiz or exam; emit one Bergen Quiz Transfer Block without a whole-course package | Record; manual local QTI ZIP packaging | Repository Verified; Canvas Pending |

## Boundary and recovery scenarios

| Scenario | Synthetic input intent | Observable contract | Status |
|---|---|---|---|
| Natural-language routing | Ask for an introductory lesson without an alias | Same Lesson header, context, stages, privacy check, and approval gates as `bergen:lesson` | Verified |
| Unsupported alias | Enter `bergen:archive-course` | Identify unsupported input, do not invent a workflow, show Help, suggest close aliases, invite restatement | Verified |
| Protected-data stop | Placeholder states that protected content was removed | Stop without echo or transformation; identify Canvas boundary; offer a blank de-identified Class Learning Snapshot | Verified |
| Ambiguous course | Request a lesson for an unspecified course | Use no course-specific document; ask only which course; make no cross-chat persistence claim | Verified |
| Visible-chat estimate | Ask whether to start a new chat | Low-confidence conservative visible-chat estimate or an explicit statement that no defensible estimate is available | Verified |
| Approved quiz handoff | Request transfer for a reviewed synthetic quiz | Text-only Bergen Quiz Transfer Block boundary; privacy confirmation; no ZIP claim; copy-ready fallback | Verified |
| Approved course handoff | Request transfer for a fully reviewed synthetic course | Text-only Bergen Course Transfer Block → browser-local `.imscc` → manual unpublished Canvas import and review | Repository Verified; Canvas Pending |

## Shared observable response contract

Every recognized workflow begins exactly `Bergen Memory Bank Â· <Workflow Name>`, states the selected course or that none is required, names only context actually used, distinguishes faculty-supplied facts, identifies missing or conflicting context, and asks no more than one blocking question. Each response ends with `Current stage: <stage>` and `Recommended next command: bergen:<workflow>`.

The stage engine is Remember â†’ Frame â†’ Plan â†’ Draft â†’ Review â†’ Revise â†’ Record as applicable. Review never silently revises; revision and durable recording require explicit faculty approval. Course and assessment handoffs require separate approval; Canvas import and publication remain manual.

## Safeguard coverage contract

| Safeguard | Observable output | Verification owner |
|---|---|---|
| Minimum necessary context | Selected course, named document sources, supplied facts, missing or conflicting facts, and no more than one necessary question | Phase 2 content checks |
| Human approval | Review does not revise; revise and record use only approved changes; publication remains manual | Phase 2 content checks and Phase 4 guide alignment |
| Student-record boundary | Processing stops without echoing or transforming identifying content; Canvas remains the student-record system | Phase 2 content checks |
| Concepts already introduced | Reinforcement treats future concepts and knowledge it must not assume as hard constraints | Phase 2 content checks and Phase 3 snapshot checks |
| Four-document ownership | Shared and course-specific homes plus a replaceable de-identified snapshot section | Phase 2 instruction checks and Phase 3 template checks |
| Context hygiene | Estimate is visibly qualified, conservative, rounded, and never presented as actual remaining capacity | Phase 2 content checks |
| Faculty-facing language | Installation and daily work do not require repository, API, terminal, or programming knowledge | Phase 4 guide checks |
| Browser-only packaging | No server, database, account, telemetry, or Canvas API receives quiz content | Phase 5 source and browser checks |
| Canvas compatibility | Authorized manual import result in an unpublished Bergen test course | Manual v1.0 release gate |
| Whole-course packaging | Input-derived Common Cartridge bytes are generated locally only after validation and privacy completion | Phase 5 source, package, and browser checks |
| Connected Keep acceptance | Exact-title create, retrieve, compare, and report evidence from synthetic authorized scenarios | Pending Phase 6 manual release gate |
| Whole-course Canvas acceptance | Completed import job followed by unpublished Modules review | Pending Phase 6 manual release gate |

## Phase 3 document-delivery limitations retained

Phase 3 produced four Google Docs-ready DOCX files. It did not create live Drive documents because a Drive connection was unavailable. Automated OOXML, privacy, accessibility, and source-parity checks passed; rendered-page visual review remained unavailable because the bundled document runtime did not include the required office renderer. Phase 4 guide readiness does not remove or reinterpret those limitations.

## What is not tested here

No fixture or guide contains a real record, credential, email address, identifying filename, grade, accommodation, health detail, or raw student work. The suites verify committed static contracts, local browser behavior, Common Cartridge and QTI structure, and deterministic generation. They do not verify hidden Gemini context, live tenant access, connected Google Keep actions, automatic Google Docs editing, Canvas automation, a live Apps Script page, Bergen-domain access, a live packager location, or Canvas compatibility inferred from structure.
