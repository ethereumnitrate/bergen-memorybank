# Scenario Verification Matrix

## Verification purpose through Phase 4

This file is the human-readable content-contract matrix for Bergen Memory Bank v1.0 through Phase 4. It maps synthetic inputs to observable instructions, template content, and faculty guides for routing, context selection, stage state, document ownership, approval, privacy, and safe next steps. It does not claim access to Gemini's hidden behavior or that Phase 5 QTI packaging exists.

## Phase 4 guide scenarios

| Check | Source contract | Observable contract | Automated test |
|---|---|---|---|
| Guide set and language | Nine faculty guides | All requested guides exist; faculty prose avoids repository paths, source-format mechanics, and developer workflow language | `guide-alignment.test.mjs` check 1 |
| Five-minute installation | Installation guide | Exactly eight numbered requirements; access checks remain optional preflight or troubleshooting | `guide-alignment.test.mjs` check 2 |
| Commands and quick start | Command reference and quick start | All twelve aliases and exact purposes; natural-language parity; explicit course selection; observable context, minimum question, stage, next command, and approval gates | `guide-alignment.test.mjs` check 3 |
| Privacy and context | Privacy checklist and quick start | Complete protected-data stop and blank snapshot recovery; conservative, low-confidence, rounded visible-chat estimate with all exclusions and action bands | `guide-alignment.test.mjs` check 4 |
| Ten-minute presentation | Presentation script | Contiguous timed sections total 10:00 and demonstrate safe value, privacy, context, course memory, commands, optional QTI, and manual Canvas | `guide-alignment.test.mjs` check 5 |
| Prompt examples | Sample prompts | One safe alias example and one safe natural-language example for every workflow | `guide-alignment.test.mjs` check 6 |
| Aligned demonstration | End-to-end demonstration | One synthetic course, outcome, concept set, and criteria remain aligned through lesson, assignment, rubric, review, approved revision, record proposal, and manual publishing packet | `guide-alignment.test.mjs` check 7 |
| Recovery and QTI handoff | Troubleshooting and QTI-to-Canvas guide | Complete recovery paths, manual fallback, five item types, browser/local-only boundaries, unpublished test course, no Phase 5 availability or compatibility claim | `guide-alignment.test.mjs` check 8 |

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
| Course | Plan a synthetic course module | `Bergen Memory Bank Â· Course` | Echo selected course; use relevant Course Memory and Workbench facts | Frame or later; lesson, review, or record | Verified |
| Lesson | Plan an introductory lesson | `Bergen Memory Bank Â· Lesson` | Selected course, outcomes, concepts introduced; one missing fact at most | Plan or Draft; assignment or review | Verified |
| Assignment | Draft a synthetic knowledge check | `Bergen Memory Bank Â· Assignment` | Selected course, outcomes, constraints, approval state | Draft; rubric or review | Verified |
| Rubric | Draft aligned synthetic criteria | `Bergen Memory Bank Â· Rubric` | Selected course and assignment facts; no individual scoring | Draft; review | Verified |
| Reinforce | Use a de-identified class snapshot | `Bergen Memory Bank Â· Reinforce` | Selected course and safe snapshot; hard prerequisite constraints | Plan; review | Verified |
| Review | Inspect a synthetic artifact without changing it | `Bergen Memory Bank Â· Review` | State artifact, outcomes, context, and approval state | Review; revise | Verified |
| Revise | Apply an approved clarity change | `Bergen Memory Bank Â· Revise` | Use the reviewed artifact and explicit change list only | Revise; review | Verified |
| Message | Draft a general class announcement | `Bergen Memory Bank Â· Message` | Class-wide facts only; audience and purpose | Draft; review | Verified |
| Reflect | Reflect on de-identified class-level patterns | `Bergen Memory Bank Â· Reflect` | Separate observation, inference, and uncertainty | Review; record after approval | Verified |
| Record | Propose a durable approved update | `Bergen Memory Bank Â· Record` | Name one primary document and require separate approval | Record; help or course | Verified |

## Boundary and recovery scenarios

| Scenario | Synthetic input intent | Observable contract | Status |
|---|---|---|---|
| Natural-language routing | Ask for an introductory lesson without an alias | Same Lesson header, context, stages, privacy check, and approval gates as `bergen:lesson` | Verified |
| Unsupported alias | Enter `bergen:archive-course` | Identify unsupported input, do not invent a workflow, show Help, suggest close aliases, invite restatement | Verified |
| Protected-data stop | Placeholder states that protected content was removed | Stop without echo or transformation; identify Canvas boundary; offer a blank de-identified Class Learning Snapshot | Verified |
| Ambiguous course | Request a lesson for an unspecified course | Use no course-specific document; ask only which course; make no cross-chat persistence claim | Verified |
| Visible-chat estimate | Ask whether to start a new chat | Low-confidence conservative visible-chat estimate or an explicit statement that no defensible estimate is available | Verified |
| Approved quiz handoff | Request transfer for a reviewed synthetic quiz | Text-only Bergen Quiz Transfer Block boundary; privacy confirmation; no ZIP claim; copy-ready fallback | Verified |

## Shared observable response contract

Every recognized workflow begins exactly `Bergen Memory Bank Â· <Workflow Name>`, states the selected course or that none is required, names only context actually used, distinguishes faculty-supplied facts, identifies missing or conflicting context, and asks no more than one blocking question. Each response ends with `Current stage: <stage>` and `Recommended next command: bergen:<workflow>`.

The stage engine is Remember â†’ Frame â†’ Plan â†’ Draft â†’ Review â†’ Revise â†’ Record as applicable. Review never silently revises; revision, recording, and Canvas handoffs require explicit faculty approval and remain manual.

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

## Phase 3 document-delivery limitations retained

Phase 3 produced four Google Docs-ready DOCX files. It did not create live Drive documents because a Drive connection was unavailable. Automated OOXML, privacy, accessibility, and source-parity checks passed; rendered-page visual review remained unavailable because the bundled document runtime did not include the required office renderer. Phase 4 guide readiness does not remove or reinterpret those limitations.

## What is not tested here

No fixture or guide contains a real record, credential, email address, identifying filename, grade, accommodation, health detail, or raw student work. The content suite verifies committed static contracts, not hidden Gemini context, live tenant access, automatic Google Docs editing, Canvas automation, live APIs, browser packaging, QTI XML, a live QTI URL, or Canvas compatibility inferred from structure.
