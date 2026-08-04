---
slug: bergen-memory-bank-v1
feature: bergen-memory-bank-v1
status: IN_PROGRESS
---

# bergen-memory-bank-v1: Bergen Memory Bank v1.0

**Complexity**: Level 4
**Status**: IN_PROGRESS
**Roadmap**: bergen-memory-bank-v1
**Branch**: feature/bergen-memory-bank-v1
**Worktree**: C:\Users\alexa\source\repos\bergen-memorybank

## Task Description

Build version 1.0 of Bergen Memory Bank as a privacy-safe, no-code faculty workflow system for Bergen Community College. The release must provide one classic custom Gemini Gem named **Bergen Memory Bank**, four reusable Google Docs, a case-insensitive optional `bergen:<workflow>` prompt-alias protocol with natural-language equivalents, faculty enablement materials, a complete lesson-to-record demonstration, and a privacy-first companion QTI Packager for manually importing supported quizzes into Canvas.

The Gem must route `help`, `setup`, `course`, `lesson`, `assignment`, `rubric`, `reinforce`, `review`, `revise`, `message`, `reflect`, and `record`; state its context; use the staged sequence Remember → Frame → Plan → Draft → Review → Revise → Record; and require faculty approval before revision, recording, or Canvas publication. Canvas remains the student-record system. Gemini and the memory documents must not receive or retain identifiable or protected student information.

The approved companion QTI workflow is limited to quiz content and settings, not student data: the Gem produces an approved Bergen Quiz Transfer Block, the faculty member pastes it into a Bergen-hosted browser tool, the browser validates and packages QTI 1.2, and the faculty member downloads the ZIP and manually imports, reviews, and publishes it in an unpublished Canvas test course. Regular assignment text and other materials remain copy-ready for manual transfer.

**Complexity rationale**: inferred by `/ala:brainstorm`. Level 4 is warranted by the number of coordinated deliverables, institution-specific privacy and policy constraints, twelve workflow aliases, multi-document memory ownership, faculty training requirements, and a separately deployable browser application whose QTI output requires structural and Canvas compatibility validation.

## Specification

**Feature Type**: End-User Feature
**Primary Persona**: Faculty Member
**Creative Exploration Needed**: Yes: Architecture, User Journey, and QTI Packager UI/UX decisions resolved in approved brainstorm

### Invocation Method

- **Location**: A faculty member signed in with a `bergen.edu` account opens the Gemini web app, navigates to **Gems**, and opens the classic custom Gem named **Bergen Memory Bank**.
- **Element**: In the Gem conversation input, the faculty member types a case-insensitive `bergen:<workflow> [optional request or parameters]` alias or an equivalent natural-language request. `bergen:help` is the installation-verification entry point.
- **Visibility**: The Gem becomes visible in the faculty member's Gems list after the eight-step installation is complete: (1) create a **Bergen Memory Bank** folder in Google Drive, (2) copy the four supplied templates into it, (3) create a classic custom Gem with a `bergen.edu` account, (4) name it **Bergen Memory Bank**, (5) paste the supplied instructions, (6) attach the Drive documents as Gem knowledge, (7) save the Gem, and (8) enter `bergen:help`.
- **Navigation**: Gemini web app → Gems → Bergen Memory Bank → conversation input. For an approved supported quiz: `bergen:assignment` → Bergen Quiz Transfer Block → linked Bergen QTI Packager → paste and validate → confirm no student data → download ZIP → Canvas unpublished test course → Settings → Import Course Content → QTI ZIP → review imported quiz.

### Success Criteria

- **Gem verification**: The response to `bergen:help` begins exactly with `Bergen Memory Bank · Help`, shows all supported workflows, safe-data guidance, and examples, and ends with `Current stage: Remember` plus a recommended next command. This is observable in the same Gem response.
- **Workflow verification**: Every recognized command or natural-language equivalent displays `Bergen Memory Bank · <Workflow Name>`, identifies the selected course when course-specific, states which attached memory documents and faculty-supplied facts are being used, asks only for information required to continue, preserves applicable approval gates, and ends with the current stage and recommended next command. This is observable in each Gem response.
- **Manual memory persistence**: Teaching context persists only after the faculty member approves a `bergen:record` proposal and manually pastes its copy-ready text into a Google Doc inside the **Bergen Memory Bank** Drive folder. Faculty Profile and Decisions, Reflections, and Reusable Practices are shared; Course Memory and Active Workbench are course-specific. The pasted update is visible immediately after the faculty member saves or finishes the Google Docs edit.
- **Canvas persistence**: Final approved course content and every student record persist only in Canvas. Copy-ready Canvas Publishing Packets are verified in the Gem conversation before manual transfer and in the target Canvas editor after the faculty member pastes and saves them; the Gem never claims that transfer or publication occurred automatically.
- **QTI verification**: Quiz input exists only in the active browser's memory. Successful validation and local package creation show exactly `QTI package ready. Download your ZIP and import it into an unpublished Canvas test course.` in the same packager session, and the ZIP appears in the browser's download list or chosen local download folder. The faculty verifies the import at Canvas unpublished test course → Settings → Import Course Content and verifies the resulting questions and settings in the imported, unpublished quiz after Canvas reports that its import job completed.
- **Release gate**: Automated structure checks and local browser tests may establish package integrity, but version 1.0 QTI compatibility remains unapproved until an authorized Bergen faculty or support user successfully imports the synthetic compatibility package into an unpublished Bergen Canvas test course and records the result. This is the one remaining manual release gate.

### Acceptance Criteria

#### AC-ENTRY-1: Verify the exact eight-step installation

**Priority**: MUST

**Given**: A faculty member has a `bergen.edu` account, the supplied Gem instructions, the four supplied templates, and access to Google Drive and the Gemini web app

**When**: The faculty member completes the eight installation steps in order and enters `bergen:help` in the saved classic custom Gem

**Then**: The same Gem response begins exactly with `Bergen Memory Bank · Help`, lists the workflows, safe-data guidance, and examples, and ends with `Current stage: Remember` and a recommended next command without requiring Git, programming, an API, a terminal, or developer terminology

#### AC-ENTRY-2: Select a course explicitly for course-specific work

**Priority**: MUST

**Given**: The faculty member invokes a course-specific workflow and more than one course is present or the intended course is not unambiguous

**When**: The Gem frames the request

**Then**: It asks only for the course needed to continue, echoes the faculty member's selection before using Course Memory or Active Workbench, and does not claim that the selection will persist into a new Gemini chat

#### AC-HAPPY-1: Display the complete help workflow

**Priority**: MUST

**Given**: The Bergen Memory Bank Gem is open

**When**: The faculty member enters any case variation of `bergen:help`

**Then**: The response begins `Bergen Memory Bank · Help`, names all twelve aliases and their purposes, explains the protected-data boundary, supplies safe examples and natural-language alternatives, shows `Current stage: Remember`, and recommends the most appropriate setup or course-selection command

#### AC-HAPPY-2: Route every supported alias with optional parameters

**Priority**: MUST

**Given**: The faculty member enters a case-insensitive supported alias with or without a request after it

**When**: The Gem routes `bergen:setup`, `bergen:course`, `bergen:lesson`, `bergen:assignment`, `bergen:rubric`, `bergen:reinforce`, `bergen:review`, `bergen:revise`, `bergen:message`, `bergen:reflect`, or `bergen:record`

**Then**: It displays the matching workflow header and performs only the matching purpose: profile or course-memory setup; course/syllabus/outcomes/module/calendar design; outcome-aligned lesson planning; assignment, exam, or quiz drafting; rubric creation or review; class-level reinforcement; artifact review without revision; approved revision only; faculty communication drafting; teaching reflection; or proposed copy-ready memory updates, respectively

#### AC-HAPPY-3: Route equivalent natural-language requests through the same safeguards

**Priority**: MUST

**Given**: A faculty member describes one supported workflow in ordinary language without using a `bergen:` alias

**When**: The intent is unambiguous

**Then**: The Gem selects the same workflow header, context rules, privacy checks, stage behavior, and approval gates that the corresponding alias would use, while treating aliases as optional prompt conventions rather than native Gemini commands, plugins, integrations, or additional system access

#### AC-HAPPY-4: Make context and stage progression observable

**Priority**: MUST

**Given**: A recognized workflow has been selected and no privacy stop is active

**When**: The Gem responds at any point in the workflow

**Then**: It states the selected course when applicable, names the relevant attached documents and supplied facts it is using, identifies missing or conflicting context rather than inventing it, asks only the minimum question required, follows Remember → Frame → Plan → Draft → Review → Revise → Record as applicable, and ends with the current stage and recommended next command

#### AC-ERROR-1: Recover from an unknown alias without guessing

**Priority**: MUST

**Given**: The faculty member enters an unrecognized `bergen:<workflow>` alias

**When**: No exact supported alias matches case-insensitively

**Then**: The Gem does not invent or execute a workflow; it displays the `bergen:help` information, identifies the input as unsupported, suggests the closest supported aliases, and invites a natural-language restatement

#### AC-HAPPY-5: Preserve approval before revision, recording, or publication

**Priority**: MUST

**Given**: The Gem has drafted or reviewed an artifact or proposed a memory or Canvas action

**When**: A revision, record proposal, or Canvas publishing handoff is the next possible step

**Then**: `bergen:review` reports alignment, clarity, accessibility, cognitive load, quality, prerequisite creep, and bias without revising; `bergen:revise` applies only changes the faculty member explicitly approved; `bergen:record` waits for approval and supplies target-document copy-ready text only; and no Canvas publication is represented as complete before explicit faculty approval and manual action

#### AC-ERROR-2: Stop protected-data processing and recover through a safe snapshot

**Priority**: MUST

**Given**: A request or attached content includes a raw student submission; a name, email, ID, or identifying filename; an individual grade; student-specific feedback; accommodation, disability, health, advising, or disciplinary information; an identifiable quotation; or an identifying combination of details

**When**: The Gem detects the protected or identifiable content

**Then**: It immediately stops substantive processing without unnecessarily repeating, transforming, summarizing, or retaining the content; explains that Canvas is the student-record system; and offers a blank de-identified Class Learning Snapshot covering module completed, outcomes assessed, concepts already introduced, class-level strengths, common misconceptions, rubric areas needing reinforcement, general performance distribution, concepts not yet introduced, knowledge a new activity must not assume, and desired activity format and difficulty before allowing work to resume

#### AC-ERROR-3: Prevent reinforcement from assuming future concepts

**Priority**: MUST

**Given**: A de-identified Class Learning Snapshot marks concepts as not yet introduced or names knowledge a new activity must not assume

**When**: The faculty member invokes `bergen:reinforce` or requests a reinforcement activity naturally

**Then**: Every proposed activity uses only outcomes and concepts already introduced, avoids the prohibited prerequisites, and asks for clarification instead of introducing an uncertain concept

#### AC-HAPPY-6: Maintain the approved four-document hybrid ownership model

**Priority**: MUST

**Given**: The faculty member installs the initial templates or adds another course

**When**: The Gem selects, explains, or proposes a home for teaching context

**Then**: Stable faculty preferences go to the one shared Faculty Profile; durable decisions, reflections, and reusable practices go to the one shared Decisions, Reflections, and Reusable Practices document; each course uses its own Course Memory and Active Workbench pair; and the de-identified Class Learning Snapshot remains a temporary replaceable section within Active Workbench rather than a fifth knowledge document

#### AC-HAPPY-7: Persist an approved record only through manual Google Docs editing

**Priority**: MUST

**Given**: The faculty member approves a `bergen:record` proposal

**When**: The Gem prepares the record output

**Then**: It names exactly one primary target document, supplies copy-ready text, tells the faculty member to paste it manually into that Google Doc in the Bergen Memory Bank Drive folder, and does not claim that the Gem saved, synchronized, modified, or retained the document automatically

#### AC-HAPPY-8: Label the visible-chat percentage as a conservative estimate

**Priority**: MUST

**Given**: The faculty member asks about context use or the Gem recommends context hygiene

**When**: The Gem presents a percentage or threshold

**Then**: It labels the number a low-confidence conservative visible-chat estimate using 32,000 tokens only as an unverified Education Fundamentals working denominator; states that the estimate is not actual remaining capacity and excludes hidden/system/Gem instructions, retrieved knowledge, and actual model capacity; advises that below approximately 50% may continue, approximately 50–70% should use `bergen:record` soon, and above approximately 70% should record and begin a new chat; recommends restarting earlier if decisions are lost or courses mix; and states that hallucinations can occur at any percentage

#### AC-HAPPY-9: Produce a copy-ready Canvas Publishing Packet

**Priority**: MUST

**Given**: A faculty member approves an assignment, lesson, announcement, exam, quiz, or other course artifact for Canvas

**When**: The Gem prepares the publishing handoff

**Then**: It produces labeled copy-ready content and any relevant settings for manual faculty transfer, review, and saving in Canvas, while stating that Canvas is the final publishing destination and that the Gem has not saved, synchronized, or published anything

#### AC-HAPPY-10: Produce a validated Bergen Quiz Transfer Block

**Priority**: MUST

**Given**: A quiz created through `bergen:assignment` contains only supported question types, has passed review, and has faculty approval for packaging

**When**: The faculty member requests the optional QTI handoff

**Then**: The Gem emits a complete structured Bergen Quiz Transfer Block containing quiz settings, item identifiers, prompts, choices where applicable, answer keys where applicable, point values, and supported-type labels for multiple choice, true/false, multiple answer, short answer, and essay, plus instructions to use the linked Bergen QTI Packager and confirm that the block contains no student data

#### AC-HAPPY-11: Generate a QTI 1.2 ZIP entirely in the browser

**Priority**: MUST

**Given**: The faculty member opens the Bergen-controlled, domain-restricted QTI Packager, pastes a valid approved Quiz Transfer Block, and confirms it contains no student data

**When**: The faculty member validates and generates the package

**Then**: Client-side code creates a local QTI 1.2 ZIP with a well-formed manifest and assessment for the five supported item types; no quiz content is sent to a server, database, account, telemetry service, or Canvas API; and the page shows exactly `QTI package ready. Download your ZIP and import it into an unpublished Canvas test course.` in the same browser session

#### AC-ERROR-4: Fall back safely for invalid or unsupported quiz content

**Priority**: MUST

**Given**: A Quiz Transfer Block is malformed, lacks required scoring or answer information, or contains a question type outside multiple choice, true/false, multiple answer, short answer, and essay

**When**: The Gem prepares the handoff or the QTI Packager validates the block

**Then**: It identifies the correctable validation issue without creating a misleading ZIP; unsupported items are delivered as copy-ready Canvas quiz content for manual entry; and the faculty member can continue the core assignment workflow without the QTI Packager

#### AC-ERROR-5: Keep student records and automated authority out of every component

**Priority**: MUST

**Given**: A faculty member requests automated grading, individual student profiling, document modification, Canvas API activity, autonomous Canvas publishing, or QTI packaging of student-specific information

**When**: The Gem or QTI Packager evaluates the request

**Then**: It refuses the out-of-scope action, states the applicable privacy or capability boundary, preserves Canvas as the student-record system, and offers a safe class-level, copy-ready, or manual alternative without storing the rejected information

#### AC-ASYNC-1: Complete the manual Canvas QTI compatibility gate

**Priority**: MUST

**Given**: The synthetic QTI compatibility ZIP passes automated structure checks and local browser verification

**When**: An authorized Bergen faculty or support user manually imports it through an unpublished Bergen Canvas test course's Import Course Content screen

**Then**: The user waits for Canvas to report the import job complete, opens the imported unpublished quiz, verifies all five question types, answer behavior, point totals, and key settings, records pass or failure without student data, and version 1.0 QTI compatibility is not declared until this manual check passes

### Scope Boundaries

- **Included**: One classic custom Gem named **Bergen Memory Bank**; four Google Docs-ready templates; the embedded de-identified Class Learning Snapshot; all twelve optional aliases and natural-language routing; the seven-stage workflow; source-traceable guides, prompts, privacy material, troubleshooting, and demonstration; copy-ready Canvas Publishing Packets; and an optional client-side QTI 1.2 packaging path for the five approved item types.
- **Student-record boundary**: Canvas alone stores student submissions, grades, student-specific feedback, accommodations, and other protected student records. Gemini knowledge, memory documents, examples, Quiz Transfer Blocks, tests, and the QTI Packager use teaching context or synthetic/de-identified class-level observations only.
- **Capability boundary**: No native Gemini command claims, Gem plugin or custom-action claims, Canvas API, automatic grading, individual student profiling, automatic Google Docs modification, autonomous Canvas publication, server-side quiz-content processing, database, QTI Packager account, telemetry, Gemini Labs, or Opal dependency.
- **Faculty experience boundary**: Faculty installation and everyday use require Google Drive, Google Docs, a classic custom Gem, a web browser, and Canvas only; repository tooling, Git, programming, terminals, APIs, and developer terminology remain outside the faculty experience.
- **Compatibility boundary**: Structural QTI tests do not establish Bergen Canvas compatibility. The authorized unpublished test-course import in AC-ASYNC-1 is the sole remaining manual release gate.

### Creative Exploration Needed

Yes, completed. The approved brainstorm resolved the hybrid shared-and-per-course document architecture, layered Gem safety/router/context/stage architecture, explicit course-selection journey, conservative visible-chat estimate, manual Canvas Publishing Packet flow, and separate privacy-first QTI Packager UI/UX. The recorded decisions in `memory-bank/creative/bergen-memory-bank-v1-design.md` are binding for version 1.0; implementation may refine presentation details only when the acceptance criteria and one-way privacy/capability boundaries remain unchanged.

### Implementation Guide Required

Yes. The release must include a five-minute installation guide with the exact eight steps, faculty quick-start guide, `bergen:<workflow>` command reference, ten-minute presentation script, sample prompt for every command, complete lesson → assignment → rubric → review → record demonstration, privacy checklist, troubleshooting and fallback instructions, QTI-to-Canvas handoff guide, version 1.0 identifier, dated authoritative-source register, and an authorized manual Canvas compatibility-test record.

## User Journey Definition

**Feature Type**: End-User Feature
**Creative Phase Required**: Yes - Architecture and User Journey design (completed through the approved brainstorm)

### Invocation Method (End-User Features)

- **Location**: A signed-in `bergen.edu` faculty member opens the Gemini web app, selects the classic custom Gem named **Bergen Memory Bank**, and starts or continues a Gem conversation.
- **Element**: Type any supported case-insensitive `bergen:<workflow> [optional request or parameters]` alias, beginning with `bergen:help`, or make the equivalent request in natural language.
- **Visibility**: The Gem is available after the faculty member completes the eight-step installation and attaches the four Drive documents as Gem knowledge.
- **Navigation**: Gemini → Gems → Bergen Memory Bank → type `bergen:help`; for supported quizzes, follow the approved `bergen:assignment` handoff link to the Bergen QTI Packager, paste the Quiz Transfer Block, validate, download the ZIP, and manually import it in an unpublished Canvas test course.

### Success Criteria (End-User Features)

- **User sees**: `Bergen Memory Bank · Help` for the verification command, followed by available workflows, safe-data guidance, examples, `Current stage: Remember`, and a recommended next command. A successful QTI build shows `QTI package ready. Download your ZIP and import it into an unpublished Canvas test course.`
- **User can verify at**: The open Gemini conversation for Gem routing and approval gates; the Bergen Memory Bank Drive folder for manually applied approved records; the browser download list and unpublished Canvas test course for QTI import.
- **Data persisted**: Teaching context persists only when the faculty member manually copies approved text into the four Google Docs in the Bergen Memory Bank Drive folder. Final course content and all student records persist only in Canvas. The QTI Packager keeps quiz input in browser memory only and produces a local ZIP download; it has no database, server-side quiz-content storage, account, telemetry, or Canvas API.
- **Observable within**: The workflow header and help response appear in the same Gem turn; client-side validation and ZIP creation complete in the active browser session; Canvas import status appears after the faculty member performs the manual import.

### Acceptance Criteria

<!-- The Spec Writer Agent owns the canonical acceptance-criteria blocks below. -->

## Test Strategy

### Approach

- **Emphasis**: Balanced content-contract, integration, unit, ZIP-structure, and end-to-end scenario verification.
- **Target test count**: 54 automated or scripted checks across five phases. The count is above the usual multi-component range because the product exposes twelve workflows, seven shared routing behaviors, multiple privacy recovery paths, five QTI item types, four coordinated memory documents, and a complete cross-artifact faculty journey.

### File Organization

- **New test files**: `tests/content/release-structure.test.mjs`, `tests/content/gem-workflows.test.mjs`, `tests/content/template-contracts.test.mjs`, `tests/content/guide-alignment.test.mjs`, `tests/content/source-register.test.mjs`, `tests/qti/qti-packager.test.mjs`, `tests/qti/apps-script-bundle.test.mjs`, `tests/qti/browser-smoke.mjs`, `tests/fixtures/workflow-scenarios.json`, and `tests/fixtures/sample-quiz.json`.
- **Extend existing**: Promote and extend `poc/qti-packager/tests/qti-packager.test.mjs`; retain the PoC artifact and demo as traceable compatibility evidence rather than treating them as production source.

### What NOT to Test

- Real student records, credentials, or identifiable examples — prohibited by the product privacy boundary.
- Gemini's hidden context window, internal retrieval order, or an exact percentage of capacity used — those values are not exposed; only the documented conservative visible-chat estimate can be checked for accurate labeling.
- Automatic Google Docs editing, Canvas publishing, Canvas APIs, or grading — all are explicit v1.0 non-goals.
- Institution-wide QTI compatibility from XML structure alone — a manual import into an authorized unpublished Canvas test course remains the release gate.

### Per-Phase Test Guidance

- Phase 1: 8 checks for release layout, version identifier, dated authoritative-source entries, no-go capability claims, and synthetic-data fixtures.
- Phase 2: 18 checks covering every alias, natural-language routing, workflow header, context statement, stage progression, unknown command fallback, protected-data stop behavior, approval gates, and visible-chat estimate wording.
- Phase 3: 8 checks for the four-document ownership model, embedded Class Learning Snapshot, required fields, course selection, concepts-not-yet-introduced guard, and copy-ready record proposals.
- Phase 4: 8 checks for all requested guides, every command example, installation steps, lesson → assignment → rubric → review → record alignment, privacy guidance, and nontechnical wording.
- Phase 5: 12 checks for Quiz Transfer Block validation, five QTI item types, manifest and assessment XML, ZIP entries, privacy confirmation, unsupported-type fallback, Apps Script bundle integrity, browser-only processing claims, and the desktop/mobile demo path.

## Implementation Roadmap

### New Source Files (pin path + extension)

- [ ] `package.json` — repository validation commands with no faculty-facing dependency
- [ ] `src/gem/bergen-memory-bank-instructions.md` — complete classic Gem custom instructions
- [ ] `src/templates/faculty-profile.md` — Faculty Profile source template
- [ ] `src/templates/course-memory.md` — Course Memory source template
- [ ] `src/templates/active-workbench.md` — Active Workbench source template with replaceable Learning Snapshot section
- [ ] `src/templates/decisions-reflections-reusable-practices.md` — shared durable-practices source template
- [ ] `src/templates/class-learning-snapshot.md` — reusable de-identified section source synchronized with Active Workbench
- [ ] `src/guides/command-reference.md` — `bergen:<workflow>` protocol reference
- [ ] `src/guides/installation-guide.md` — five-minute, eight-step installation guide
- [ ] `src/guides/faculty-quick-start.md` — faculty quick-start guide
- [ ] `src/guides/presentation-script.md` — ten-minute presentation script
- [ ] `src/guides/sample-prompts.md` — sample prompts for every command
- [ ] `src/guides/end-to-end-demonstration.md` — lesson → assignment → rubric → review → record demonstration
- [ ] `src/guides/privacy-checklist.md` — safe-data and recovery checklist
- [ ] `src/guides/troubleshooting.md` — capability, context, QTI, and fallback guidance
- [ ] `src/guides/qti-canvas-handoff.md` — faculty QTI generation, Canvas import, review, and fallback instructions
- [ ] `src/sources/authoritative-source-register.md` — dated primary-source register and claim mapping
- [ ] `src/release/version.md` — visible Bergen Memory Bank v1.0 identifier and source-review date
- [ ] `src/testing/scenario-matrix.md` — human-readable workflow and safeguard verification matrix
- [ ] `dist/google-docs/Bergen Memory Bank - Faculty Profile.docx` — Google Docs-ready Faculty Profile
- [ ] `dist/google-docs/Bergen Memory Bank - Course Memory.docx` — Google Docs-ready Course Memory
- [ ] `dist/google-docs/Bergen Memory Bank - Active Workbench.docx` — Google Docs-ready Workbench with Learning Snapshot
- [ ] `dist/google-docs/Bergen Memory Bank - Decisions Reflections and Reusable Practices.docx` — Google Docs-ready shared practices document
- [ ] `apps/qti-packager/Code.gs` — Apps Script web-app entry point and domain access configuration surface
- [ ] `apps/qti-packager/Index.html` — accessible packager page shell
- [ ] `apps/qti-packager/Styles.html` — Apps Script HTML-service styles include
- [ ] `apps/qti-packager/Script.html` — browser-only validation, QTI 1.2 XML, ZIP generation, and UI behavior
- [ ] `apps/qti-packager/appsscript.json` — minimal Apps Script manifest
- [ ] `apps/qti-packager/README.md` — authorized deployment, access restriction, verification, and rollback guide
- [ ] `demo/Bergen-QTI-Packager-Demo.html` — self-contained presentation fallback
- [ ] `demo/bergen-qti-compatibility-check-qti.zip` — prebuilt synthetic Canvas import fallback
- [ ] `tests/content/release-structure.test.mjs` — release inventory and version checks
- [ ] `tests/content/gem-workflows.test.mjs` — workflow and safety contract checks
- [ ] `tests/content/template-contracts.test.mjs` — document ownership and snapshot checks
- [ ] `tests/content/guide-alignment.test.mjs` — guide and demonstration consistency checks
- [ ] `tests/content/source-register.test.mjs` — authoritative-source and review-date checks
- [ ] `tests/qti/qti-packager.test.mjs` — core QTI validation and package checks
- [ ] `tests/qti/apps-script-bundle.test.mjs` — deployment bundle and privacy checks
- [ ] `tests/qti/browser-smoke.mjs` — local presentation journey smoke check
- [ ] `tests/fixtures/workflow-scenarios.json` — synthetic command and natural-language scenarios
- [ ] `tests/fixtures/sample-quiz.json` — synthetic supported-item quiz fixture
- [ ] `scripts/build-google-docs.mjs` — deterministic source-to-DOCX orchestration entry point
- [ ] `scripts/build-qti-demo.mjs` — standalone demo and fallback artifact builder
- [ ] `scripts/validate-release.mjs` — aggregate release validation command

### Phases

- [x] Phase 1: Establish the release contract, dated authoritative-source register, synthetic fixtures, repository validation harness, and v1.0 artifact inventory.
  - **Test Results**: 8/8 focused tests passing; build, lint, and aggregate validation PASS
  - **Code Review**: APPROVED — 0 blocking, recommended, or optional findings; security PASS; 0 third-party dependencies
- [x] Phase 2: Author and scenario-test the layered Gem safety kernel, command router, context selector, stage engine, approval gates, course selection, privacy recovery, and conservative visible-chat estimate.
  - **Test Results**: RED confirmed at 18 intended missing-artifact failures; 18/18 focused Phase 2 scenarios and 26/26 full repository tests passing; build, lint, and aggregate validation PASS
  - **Code Review**: APPROVED — 0 blocking, recommended, optional, security, dependency, or scope findings; 12/12 aliases and all 16 Phase 2-applicable MUST Gem-side contracts represented
- [x] Phase 3: Build and validate the four-document hybrid memory model and embedded de-identified Class Learning Snapshot, then produce visually verified Google Docs-ready files.
  - **Test Results**: RED confirmed at 8 intended missing-artifact failures; remediation RED confirmed at 1/8 Phase 3 plus 1/18 Phase 2 consistency; final 8/8 focused Phase 3 and 34/34 full repository tests passing; build and lint PASS
  - **Code Review**: APPROVED — final independent review found 0 blocking, recommended, optional, security, dependency, or scope findings
  - **Document QA**: Title sanitizer, privacy scrub, accessibility audit, source-to-DOCX parity, and package-wide OOXML/preset checks PASS for 4/4 files; PNG visual QA is DONE_WITH_CONCERNS because the bundled runtime has no LibreOffice/`soffice`
- [x] Phase 4: Produce and cross-check every faculty guide, command example, privacy checklist, troubleshooting path, presentation script, and complete aligned demonstration.
  - **Test Results**: RED confirmed at 8/8 intended missing-guide failures; review remediation RED confirmed at 5/8 and 4/8; final 8/8 focused Phase 4 and 42/42 full repository tests passing; build, lint, and aggregate validation PASS
  - **Code Review**: APPROVED on iteration 3 — 0 blocking, recommended, optional, security, dependency, upgrade, or scope findings
  - **Faculty Guide QA**: Nine guides cross-checked for exact eight-step installation, all twelve command examples and natural-language parity, privacy/context boundaries, a timed ten-minute presentation, approval-ordered demonstration, and optional manual QTI-to-Canvas fallback without a Phase 5 availability or compatibility claim
- [ ] Phase 5: Productionize the client-side Bergen QTI Packager for Bergen-controlled Apps Script hosting, preserve the self-contained demo and ZIP fallback, verify supported QTI 1.2 packages, and complete the manual Canvas test-course compatibility gate.

## Creative Phases

- [x] Architecture design → completed through the approved brainstorm; recorded in `memory-bank/creative/bergen-memory-bank-v1-design.md`
- [x] User Journey design → completed through the approved brainstorm; recorded in `memory-bank/creative/bergen-memory-bank-v1-design.md`
- [x] UI/UX design → QTI Packager proof-of-concept validated on desktop and mobile; production refinements remain in Phase 5

---

## Build Execution State

**Build Status**: IDLE
**Current Phase**: 5 of 5
**Auto-Build Mode**: YES
**Current Step**: Phase 5 queued
**Step Status**: COMPLETE
**Step Started**: 2026-08-04T18:09:53Z
**Last Completed**: Phase 4 — Faculty guides and aligned demonstration
**Phase 1 Boundary**: COMPLETE — Step 10 Memory Bank update finished 2026-08-04T16:18:04Z
**Phase 2 Boundary**: COMPLETE — Step 10 Memory Bank update finished 2026-08-04T16:58:25Z
**Phase 3 Boundary**: COMPLETE — Step 10 Memory Bank update finished 2026-08-04T17:57:14Z
**Phase 4 Boundary**: COMPLETE — Step 10 Memory Bank update finished 2026-08-04T18:52:37Z
**BRAINSTORM CRITIQUE**: skipped — unresolved:no-companion (glob=C:\Users\alexa\.claude\plugins\**\codex-companion.mjs; matches=0)

### Resumption Notes

**Can Resume**: NO
**Resume From**: Phase 5 - production QTI Packager and manual compatibility gate
**Notes**: Phase 4 is complete and independently approved. `poc/` remains authorized prior Phase 5 work and was untouched. No remote is configured; the Phase 4 commit remains local until an origin is added. Phase 3 renderer and Google Drive deviations remain recorded below.

### Halt State

**Halt Trigger**: N/A
**Halted At Phase**: N/A
**Halted At Step**: N/A
**Resumption Point**: N/A
**Halt Timestamp**: N/A

### Deviations

- Discovery ran in `--offline` mode because no `origin` remote is configured; push was skipped and the phase commit remains local.
- The configured Codex review companion resolved `unresolved:no-companion`; the required Anthropic fallback review approved the phase with no findings.
- The packaged ALA `commit-guard.sh` was absent. Step 11 used a deterministic equivalent over the committed file list; the clean-tree check allowed only the user-authorized untracked `poc/` tree, which could not be removed or staged.
- Phase 4 Step 11 repeated that deterministic commit-guard equivalent: all 18 expected files were staged, production validation-script changes included content tests, and `poc/` remained the only authorized unstaged path.
- Phase 3 used the Documents skill's explicit missing-`soffice` fallback: no rendered pages or visual inspection were possible, so document QA is `DONE_WITH_CONCERNS`; sanitizer, privacy, accessibility, content-parity, and package-wide OOXML/preset gates passed for all four DOCX files.
- Phase 3 | `dist/google-docs/*.docx` | The Google Drive connector was unavailable, so the phase produced four import-ready DOCX files instead of live native Drive documents and made no automatic-creation claim.
- Cross-phase consistency correction: AC-ERROR-2, the Phase 2 Gem snapshot label/test, and the scenario matrix now use the exact approved field name `Concepts already introduced`.
- Phase 4 review recovery: the independent review required two bounded TDD remediation rounds to correct approval ordering, complete the manual Canvas import path, remove internal release language from faculty prose, and strengthen the guide-alignment suite before final approval.

### Active Sub-Agents

(none)

### Completed Steps

- Approved product and document architecture
- Approved conservative visible-chat context estimate guidance
- Approved manual Canvas Publishing Packet workflow
- Approved privacy-first client-side QTI Packager proof of concept
- Created build-ready five-phase roadmap
- Spec Writer Agent authored 19 canonical acceptance criteria
- Taxonomy lint: CLEAN
- Concrete End-User Feature specification gate: PASS
- Glossary loader: skipped because `memory-bank/c4/c4-glossary.md` is not built
- Phase 1 TDD: RED confirmed with 8 intended missing-artifact failures, then GREEN at 8/8
- Phase 1 focused batches: release contract 4/4 and source register 4/4; lint PASS
- Phase 1 integration verification: tests 8/8, build PASS, lint PASS
- Phase 1 review: APPROVED; security PASS; no dependencies or upgrades
- Phase 1 documentation: `techContext.md` and `systemPatterns.md` updated for the developer-only validation lane and planned QTI companion separation
- Phase 1 Memory Bank boundary: only Phase 1 checked; execution advanced to Phase 2
- Phase 2 TDD: RED confirmed with 18 intended missing-instruction failures, then GREEN at 18/18 focused scenarios
- Phase 2 focused batch: Gem workflow contracts 18/18; lint PASS; no fixes required
- Phase 2 integration verification: full tests 26/26, build PASS, lint PASS, aggregate validation PASS
- Phase 2 acceptance verification: 12/12 aliases and all 16 Phase 2-applicable MUST Gem-side contracts represented by static content checks
- Phase 2 review: APPROVED with 0 findings; security and privacy contract PASS; no dependencies or upgrades
- Phase 2 documentation: `techContext.md` and `systemPatterns.md` updated for the implemented layered Gem engine and text-only Quiz Transfer Block boundary
- Phase 2 Memory Bank boundary: only Phase 2 checked; execution advanced to Phase 3
- Phase 3 TDD: RED confirmed with 8 intended missing-artifact failures, then GREEN at 8/8 focused template contracts
- Phase 3 focused batch: template contracts 8/8; lint PASS; no fixes required
- Phase 3 integration verification: full tests 34/34, build PASS, lint PASS
- Phase 3 review remediation: RED confirmed at 1/8 for package-wide rsid residue and 1/18 for the snapshot-label consistency correction; GREEN at 8/8, 18/18, and 34/34
- Phase 3 document QA: four DOCX files sanitized and privacy-scrubbed; accessibility audits 0 high/0 medium/0 low; source-to-DOCX parity and package-wide OOXML/preset audits PASS; visual rendering `DONE_WITH_CONCERNS` because bundled `soffice` is unavailable
- Phase 3 final review: APPROVED with 0 findings; security/privacy PASS; no dependencies or upgrades; Phase 4/5 scope excluded
- Phase 3 documentation: `techContext.md` and `systemPatterns.md` updated for the implemented hybrid memory model and deterministic bundled source-to-DOCX pipeline
- Phase 3 Memory Bank boundary: only Phase 3 checked; execution advanced to Phase 4
- Phase 4 TDD: RED confirmed with 8 intended missing-guide failures, then GREEN at 8/8 focused guide contracts
- Phase 4 focused batch: guide alignment 8/8 and lint PASS; no fixes required at the batch gate
- Phase 4 integration verification: full tests 42/42, build PASS, lint PASS, aggregate validation PASS; 17/17 Phase 4-applicable MUST contracts mapped
- Phase 4 review remediation: two TDD rounds confirmed RED at 5/8 and 4/8 before GREEN; corrected demonstration approval ordering, QTI import steps, faculty-facing language, release framing, and exact installation verification
- Phase 4 final review: APPROVED on iteration 3 with 0 findings; security, privacy, dependencies, upgrades, and scope PASS
- Phase 4 documentation: `techContext.md` and `systemPatterns.md` updated for the nine-guide faculty layer and eight-check guide-alignment suite while preserving Phase 3 limitations
- Phase 4 Memory Bank boundary: only Phase 4 checked; execution advanced to Phase 5

## Plan Critique

- **Backend**: skipped — unresolved:no-companion (glob=`C:\Users\alexa\.claude\plugins\**\codex-companion.mjs`; matches=0)
- **Verdict**: not run; the configured default Codex critique backend could not be resolved
- **Summary**: The required use-time resolution was performed and recorded. Under the brainstorm contract, this non-usable backend outcome does not block finalization.
- **Findings**: none because no critique backend was available
