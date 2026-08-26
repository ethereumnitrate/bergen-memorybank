---
slug: bergen-memory-bank-v2
feature: bergen-memory-bank-v2
status: PLANNING_COMPLETE
---

# bergen-memory-bank-v2: Bergen Memory Bank v2

**Complexity**: Level 4
**Status**: PLANNING_COMPLETE
**Roadmap**: bergen-memory-bank-v2
**Branch**: feature/bergen-memory-bank-v2
**Worktree**: C:/Users/alexa/source/repos/bergen-memorybank

## Task Description

Replace the v1 manual Google Docs memory-recording path with a no-code Google Keep read/write protocol inside the classic Bergen Memory Bank Gemini Gem. Google Keep becomes the active memory brain and uses immutable, atomic, course-scoped notes. Google Docs remain the curated long-term archive, and Canvas remains the protected student-record and final publication system.

Add professor-facing initialization, resumption, memory inspection, and packaging workflows. Low-risk Active Workbench checkpoints save automatically after meaningful state changes. Durable faculty, course, policy, decision, practice, reflection, and replacement records require explicit faculty approval. Every write must be retrieved and content-verified before the Gem reports success; failed persistence remains visible in Gemini and never becomes a false success claim.

Extend syllabus-driven course development so faculty can design modules, pages, assignments, discussions, rubrics, quizzes, and exams entirely in Gemini. After whole-course review and approval, the Gem emits one versioned Bergen Course Transfer Block. A separate browser-only Bergen Course Packager validates the block and creates one unpublished Common Cartridge (`.imscc`) for manual import and review in a Canvas sandbox. Preserve the existing assessment-only Bergen Quiz Transfer Block and QTI Packager.

The design intentionally changes the v1 Transparent Capability Boundary: v2 may claim a Keep write only when the connected Google Keep action was observed and the exact new note was retrieved for verification. It still cannot claim autonomous Canvas publication, Common Cartridge compatibility before sandbox evidence, or persistence when Keep retrieval fails.

## Specification

**Feature Type**: End-User Feature
**Primary Persona**: Bergen Community College faculty member with no assumed technical background who needs to build and reuse aligned course materials without repeatedly supplying context or handling developer tooling.
**Creative Exploration Needed**: Yes — the required Level 4 Architecture, User Journey, and Algorithm exploration is complete in the approved v2 design; no unresolved design gate remains for planning.

### Invocation Method

- **Primary location**: The faculty member's Bergen Memory Bank classic custom Gem conversation at `gemini.google.com`, with the connected Google Keep capability enabled for the faculty member's Bergen account.
- **Discoverable element**: Enter `bergen:help` in the Gem conversation to see `bergen:init <course>`, `bergen:resume <course>`, `bergen:memory`, `bergen:package course`, and `bergen:package assessment` alongside the preserved v1 workflows. A clear natural-language request, such as “Resume CIS-277 and continue building Module 2,” invokes the same route and safeguards.
- **Memory entry points**: `bergen:init <course>` starts syllabus-grounded course memory; `bergen:resume <course>` reloads one course from Keep; `bergen:memory` reports the records actually used, conflicts, and the last verified write; `bergen:record` proposes a durable record and waits for explicit approval.
- **Course-package entry point**: After staged whole-course review and faculty approval, `bergen:package course` emits one versioned text-only `Bergen Course Transfer Block`. The faculty then uses the separate Bergen Course Packager browser page, whose primary textarea is labeled `Bergen Course Transfer Block`, to validate the block and download one `.imscc`.
- **Assessment-only entry point**: `bergen:package assessment` preserves the existing approved `Bergen Quiz Transfer Block` handoff to `apps/qti-packager/`; it does not replace the whole-course package route.
- **Final external boundary**: The downloaded `.imscc` is manually imported through Canvas **Settings → Import Course Content** into an authorized unpublished sandbox. Canvas review and publication remain faculty-controlled and outside the Gem and packagers.

### Success Criteria

- A faculty member can initialize a named course from an attached or pasted syllabus, work on its modules and artifacts entirely in Gemini, start a new Gem conversation, and resume only that course from verified Google Keep records without opening Keep or manually copying memory.
- Every successful Keep write is an atomic immutable note in the faculty member's connected Keep account with a title shaped exactly as `BMB | <COURSE> | <TYPE> | <RECORD-SLUG> | R<NNN> | <DATE>`. A later revision creates a new note whose body identifies the prior note in `Supersedes`; it never silently overwrites the earlier note.
- Low-risk workflow stage/next-step checkpoints, temporary lesson or assignment ideas, open questions or missing facts, and de-identified Active Workbench summaries may save automatically after a meaningful state change. Faculty profile, course fact, policy, decision, reusable practice, reflection, replacement, and archive records never save without explicit faculty approval.
- The same Gemini response that completes a verified memory write displays all of these observable fields: `Memory action: Created`, `Keep note: <exact title>`, `Memory class: Temporary` or `Memory class: Durable`, `Approval: Automatic low-risk` or `Approval: Faculty approved`, and a `Verification:` result confirming retrieval and comparison of the exact note.
- `bergen:resume <course>` follows revision chains, selects the newest verified active record for each record ID, lists the exact Keep note titles used, and surfaces missing, ambiguous, or conflicting records rather than guessing. Notes for any other course are excluded.
- After complete syllabus-driven design, alignment review, and faculty approval, the Gem emits one syntactically valid, versioned `Bergen Course Transfer Block` containing course metadata, ordered modules and items, pages, assignments, discussions, rubrics, quizzes/exams, completion rules, and unpublished defaults. Output is derived from the current approved course rather than placeholder or sample content.
- The separate browser-only Bergen Course Packager validates the real transfer block, keeps course content in browser memory, deterministically generates one local `.imscc`, displays the exact status `Course package ready`, and enables the exact action `Download .imscc` in the same browser session.
- The generated Common Cartridge contains internally linked representations of the approved modules, pages, assignments, discussions, rubrics, assessments, and completion rules; embedded assessment material uses the established QTI handoff patterns where applicable. Two different valid course blocks produce appropriately different course artifacts, while identical input produces byte-stable output under repository tests.
- The existing Bergen QTI Packager continues to generate an assessment-only local QTI ZIP from a valid approved `Bergen Quiz Transfer Block`; whole-course packaging does not regress its five supported item types, privacy gate, or manual unpublished-Canvas import boundary.
- Protected student records never enter Keep, a transfer block, or a generated package. Canvas remains the only student-record system, and successful local packaging never constitutes a claim of Bergen Canvas compatibility or publication.

### Acceptance Criteria

#### AC-ENTRY-1: Faculty can discover and invoke v2 workflows in the Gem
**Priority**: MUST

**Given** a faculty member has opened the Bergen Memory Bank classic custom Gem at `gemini.google.com`
**When** the faculty member enters `bergen:help` or states a clear natural-language intent to initialize, resume, inspect memory, or package a course or assessment
**Then** the Gem lists or routes to `bergen:init <course>`, `bergen:resume <course>`, `bergen:memory`, `bergen:package course`, or `bergen:package assessment` while preserving the existing professor workflows, natural-language parity, privacy check, course selection, stage display, and recommended-next-command contract in `src/gem/bergen-memory-bank-instructions.md`.

**Verification**:
- [ ] Automated repository checks in `tests/content/gem-workflows.test.mjs` confirm every new alias, the preserved aliases, unknown-command fallback, and natural-language equivalents.
- [ ] `src/guides/command-reference.md` and the Gem's `bergen:help` contract show the same names and faculty-facing purposes.
- [ ] An authorized non-production Gem scenario confirms each typed alias reaches its named workflow; this live gate is not replaced by static Markdown assertions.

#### AC-HAPPY-1: Course initialization creates only a verified low-risk checkpoint automatically
**Priority**: MUST

**Given** the faculty member's connected Google Keep capability is enabled, no BMB notes exist for `CIS-277`, and a synthetic or faculty-owned CIS-277 syllabus is supplied in the Gem conversation
**When** the faculty member enters `bergen:init CIS-277`
**Then** the Gem selects `CIS-277`, extracts syllabus-grounded proposed context, identifies missing or conflicting facts, and may automatically create only a meaningful temporary Active Workbench checkpoint; it retrieves the exact new Keep note, compares its content with the intended record, and reports `Memory action: Created`, the exact `BMB | CIS-277 | <TYPE> | <RECORD-SLUG> | R001 | <DATE>` title, `Memory class: Temporary`, `Approval: Automatic low-risk`, and a successful `Verification:` result in the same response. Durable syllabus facts remain proposed until faculty approval.

**Verification**:
- [ ] `tests/content/gem-workflows.test.mjs` and `tests/keep/memory-contract.test.mjs` cover course selection, low-risk classification, exact title/schema fields, and the retrieve/compare/report ordering.
- [ ] Synthetic scenarios in `tests/fixtures/workflow-scenarios.json` confirm durable syllabus facts do not ride on the automatic checkpoint authority.
- [ ] An authorized live Google Keep gate confirms the exact R001 note exists in the faculty test account and its retrieved body matches the intended checkpoint.

#### AC-HAPPY-2: Durable recording requires approval and creates an immutable revision
**Priority**: MUST

**Given** `CIS-277` has an active verified course-policy note at revision R001 and the faculty member has approved a changed late-work policy in the Gem conversation
**When** the faculty member invokes `bergen:record` and explicitly approves saving the displayed durable record
**Then** the Gem creates a distinct R002 note with the exact atomic title pattern, records R001 in `Supersedes`, leaves R001 unchanged, retrieves the exact R002 note, compares all required fields and content, and reports `Memory class: Durable`, `Approval: Faculty approved`, and successful verification only after the comparison passes.

**Verification**:
- [ ] `tests/keep/memory-contract.test.mjs` verifies monotonically incremented revisions, required `Supersedes`, immutable prior content, and approval evidence for every durable memory type.
- [ ] `tests/content/gem-workflows.test.mjs` confirms approval for revision does not authorize recording and approval for one durable record does not authorize another.
- [ ] An authorized live Keep gate confirms both R001 and R002 remain retrievable and that R002 names R001 as superseded.

#### AC-HAPPY-3: A new conversation resumes the correct course from verified Keep memory
**Priority**: MUST

**Given** verified notes exist for both `CIS-277` and `CIS-165`, including more than one revision for at least one CIS-277 record
**When** the faculty member opens a new Gem conversation and enters `bergen:resume CIS-277`
**Then** the Gem retrieves only CIS-277 BMB notes, follows valid `Supersedes` chains, selects the newest verified active revisions, lists the exact note titles used, reconstructs the current workflow stage and next step, and excludes CIS-165 content.

**Verification**:
- [ ] `tests/keep/memory-contract.test.mjs` covers deterministic latest-revision selection, course isolation, inactive/superseded handling, and duplicate-slug edge cases.
- [ ] `tests/content/gem-workflows.test.mjs` verifies the resume response exposes context, exact note titles, current stage, and next command.
- [ ] An authorized new-chat Keep scenario confirms real retrieval is course-specific and is not satisfied by prior visible-chat state.

#### AC-HAPPY-4: Faculty can inspect the active memory basis without opening Keep
**Priority**: MUST

**Given** a course has verified temporary and durable notes and at least one superseded revision
**When** the faculty member enters `bergen:memory`
**Then** the Gem reports the selected course, exact active note titles used, temporary versus durable status, superseded records, unresolved conflicts or missing information, and the last verified write, without claiming hidden context-meter or Google retrieval information it cannot observe.

**Verification**:
- [ ] `tests/content/gem-workflows.test.mjs` checks all required memory-report fields and the conservative capability boundary.
- [ ] `src/guides/keep-memory-workflow.md` gives a no-code example whose output matches the Gem contract.
- [ ] An authorized Gem scenario verifies the displayed titles correspond to notes actually retrievable from the faculty test account.

#### AC-HAPPY-5: An approved syllabus-driven course produces a real course transfer block
**Priority**: MUST

**Given** a synthetic CIS-277 syllabus has been developed in Gemini into reviewed and faculty-approved course metadata, ordered modules, pages, assignments, discussions, rubrics, quizzes/exams, and completion rules
**When** the faculty member enters `bergen:package course` and explicitly approves the final handoff
**Then** the Gem emits exactly one versioned `Bergen Course Transfer Block` whose course-specific values match the approved CIS-277 design, whose Canvas items default to unpublished, and whose structure passes the validator contract without placeholder, sample, student, credential, or hidden-memory data.

**Verification**:
- [ ] `tests/content/gem-workflows.test.mjs` verifies final review and package approval are separate gates and the block uses the versioned contract.
- [ ] `tests/course/course-transfer.test.mjs` parses the synthetic CIS-277 block and checks every required content category, ordering, references, completion rules, and unpublished defaults.
- [ ] A second synthetic course fixture produces materially different metadata and module items, detecting hard-coded or sample output.

#### AC-HAPPY-6: The browser packager creates one deterministic local Common Cartridge
**Priority**: MUST

**Given** the faculty member has opened the separate Bergen Course Packager page and has a valid approved `Bergen Course Transfer Block`
**When** the faculty member pastes the block into the textarea labeled `Bergen Course Transfer Block`, selects the validation action, confirms the no-student-data statement, and selects `Download .imscc`
**Then** the page validates the real block, displays the exact status `Course package ready`, enables the exact `Download .imscc` action, and downloads one deterministic `.imscc` containing the approved unpublished course structure without sending or storing course content outside the active browser session.

**Verification**:
- [ ] `tests/course/course-transfer.test.mjs` and `tests/course/common-cartridge.test.mjs` verify input-derived metadata, manifest/resources, internal links, XML/HTML escaping, embedded QTI, completion rules, unpublished defaults, and byte stability for identical input.
- [ ] `tests/course/apps-script-bundle.test.mjs` rejects `fetch`, `XMLHttpRequest`, `WebSocket`, `google.script.run`, browser storage, telemetry, and course-content server transfer patterns.
- [ ] `tests/course/browser-smoke.mjs` completes the exact desktop and mobile paste → validate → privacy confirm → success → local download journey using the generated self-contained demo.

#### AC-HAPPY-7: Assessment-only QTI packaging remains available
**Priority**: MUST

**Given** the faculty member has a reviewed and approved supported quiz or exam in Gemini
**When** the faculty member enters `bergen:package assessment` and transfers the emitted `Bergen Quiz Transfer Block` to the existing Bergen QTI Packager
**Then** the existing browser-only assessment journey validates and downloads a local QTI ZIP with its privacy gate and unpublished Canvas test-course instruction intact, without requiring or generating a whole-course `.imscc`.

**Verification**:
- [ ] Existing checks in `tests/qti/qti-packager.test.mjs`, `tests/qti/apps-script-bundle.test.mjs`, and `tests/qti/browser-smoke.mjs` continue to pass unchanged or with deliberate command-alignment extensions.
- [ ] `src/guides/qti-canvas-handoff.md` clearly distinguishes assessment-only QTI from the whole-course cartridge route.
- [ ] The v2 Gem content-contract test confirms the five supported QTI item types and manual Canvas boundary are preserved.

#### AC-ERROR-1: A Keep write or verification failure cannot become a false success
**Priority**: MUST

**Given** the Gem has prepared a low-risk checkpoint or an approved durable record but Keep creation, exact-title retrieval, or content comparison fails
**When** the memory operation returns no exact match, a mismatched body, multiple exact-title matches, or another unavailable result
**Then** the Gem reports `Memory action: Failed`, does not report the record as saved or verified, preserves the proposed content visibly in the current Gemini conversation, and offers only `Retry memory write` or `Continue without persistence`; it does not direct the faculty member to open, rename, label, or repair Keep manually.

**Verification**:
- [ ] `tests/content/gem-workflows.test.mjs` covers create failure, retrieval failure, mismatch, duplicate exact title, both recovery choices, and the prohibited false-success/manual-repair language.
- [ ] Synthetic failure scenarios confirm a later `bergen:memory` response does not list the failed record as active memory.
- [ ] An authorized non-production Gem scenario exercises an unavailable/denied Keep result when safely reproducible; otherwise this external failure remains an explicit manual release gate, not a claimed automated pass.

#### AC-ERROR-2: Protected information stops before retrieval, memory, or packaging
**Priority**: MUST

**Given** a request, syllabus attachment, proposed memory, or transfer input contains possible protected or identifiable student information
**When** the Gem or browser packager performs its ordered privacy check
**Then** substantive processing stops before Keep retrieval/write, course drafting, transfer validation, or package creation; the response does not echo or transform the content, states that Canvas is the student-record system, offers a blank de-identified Class Learning Snapshot where appropriate, clears rejected browser input where applicable, and creates no note, transfer block, QTI ZIP, or `.imscc`.

**Verification**:
- [ ] `tests/content/gem-workflows.test.mjs` verifies privacy short-circuit precedence for every new route.
- [ ] `tests/keep/memory-contract.test.mjs` and course-packager tests use only synthetic/de-identified fixtures and reject prohibited fields and representative privacy signals before parsing or persistence.
- [ ] Browser smoke tests confirm rejected content is cleared, privacy confirmation resets, download remains disabled, and no object URL is created.

#### AC-ERROR-3: Ambiguous or conflicting memory remains visible and unresolved
**Priority**: MUST

**Given** a course has a broken `Supersedes` link, competing active revisions, a revision gap, malformed required fields, or conflicting syllabus facts
**When** the faculty member enters `bergen:resume <course>` or `bergen:memory`
**Then** the Gem identifies the exact conflicting note titles and missing relationship, does not silently select or merge a winner, asks only for the minimum faculty decision needed, and does not create a replacement or archive record without explicit approval.

**Verification**:
- [ ] `tests/keep/memory-contract.test.mjs` deterministically detects broken chains, cycles, gaps, duplicate active revisions, malformed titles/bodies, and cross-course links.
- [ ] `tests/content/gem-workflows.test.mjs` confirms the conflict response pauses context-dependent work and preserves the approval gate.
- [ ] An authorized Keep scenario with synthetic conflicting notes verifies the Gem surfaces the real titles rather than a generic warning.

#### AC-ERROR-4: Invalid course-transfer input cannot produce a partial or misleading package
**Priority**: MUST

**Given** the Bergen Course Packager receives malformed JSON, an unsupported version, missing required content, broken internal references, invalid scoring, protected information, or unsafe markup
**When** the faculty member selects the validation action
**Then** the page displays specific correction messages without echoing protected content, keeps `Download .imscc` disabled, creates no object URL or ZIP, and preserves only safe correctable input in the current browser session; it never labels a partial artifact `Course package ready`.

**Verification**:
- [ ] `tests/course/course-transfer.test.mjs` covers schema, version, reference, scoring, completion-rule, unpublished-default, and privacy failures.
- [ ] `tests/course/browser-smoke.mjs` verifies exact disabled-download and zero-object-URL behavior for malformed and protected inputs.
- [ ] `tests/course/common-cartridge.test.mjs` rejects incomplete manifests, unresolved resources, and unsafe/unescaped generated content.

#### AC-ASYNC-1: Completion is observable across Keep, packaging, and Canvas handoffs
**Priority**: MUST

**Given** the faculty member starts a Keep write, local course-package generation, or manual Canvas sandbox import
**When** each operation completes or fails
**Then** the Gem waits to claim persistence until exact-note retrieval and comparison finish in the same response; the packager displays `Course package ready` and enables `Download .imscc` only after validation and local generation finish in the same browser session; and the faculty member treats Canvas content as available for review only after the Canvas import job reports completion in the authorized unpublished sandbox.

**Verification**:
- [ ] Repository content-contract tests enforce create → retrieve → compare → report ordering and prevent early success language.
- [ ] Browser smoke tests verify download remains disabled before validation/privacy completion and becomes available only with `Course package ready`.
- [ ] An authorized Canvas sandbox gate records the import job's completed state before reviewers inspect Modules; repository tests do not claim to automate or replace this external gate.

### Scope Boundaries

**In scope**:

- Extend `src/gem/bergen-memory-bank-instructions.md` and the synthetic scenario/content-contract layer so a classic Gem can use the faculty member's enabled Google Keep connection through explicit conversational instructions, while never inventing an API, credential, hidden tool result, or persistence claim.
- Define the versioned memory-note contract in `src/contracts/bergen-memory-v2.md`, including allowed record types, exact title/body fields, automatic-versus-approved classification, immutable revisions, `Supersedes` chains, course isolation, retrieval, verification, conflict behavior, and failure recovery.
- Preserve Google Docs as an optional curated archive; v2 daily memory use must not require opening Docs or Keep, copying records, renaming notes, or applying Keep labels outside Gemini.
- Extend the professor workflows and aligned guides under `src/guides/` for initialization, resumption, memory inspection, syllabus-driven course design, durable approval, retry/continue-without-persistence, and whole-course/assessment packaging.
- Define and validate a versioned `Bergen Course Transfer Block` using repository-owned contracts and synthetic fixtures. Course structure includes metadata, ordered modules/items, pages, assignments, discussions, rubrics, quizzes/exams, completion rules, internal references, and unpublished defaults.
- Add a separate `apps/course-packager/` that follows the static Apps Script shell and bounded client-only core patterns in `apps/qti-packager/`, plus deterministic build/test patterns in `scripts/build-qti-demo.mjs`, `tests/qti/`, and `scripts/validate-release.mjs`.
- Generate exactly one browser-local `.imscc` per approved whole-course block. Retain the existing assessment-only QTI packager and its supported item contract.
- Use dependency-free Node.js `.mjs` repository validation and only synthetic/de-identified fixtures. Automated checks prove the instruction, schema, browser, ZIP, XML/HTML, privacy, and deterministic-output contracts; authorized live tests separately prove connected Keep behavior and Canvas sandbox compatibility.

**Out of scope**:

- A Google Keep REST API, Apps Script Keep service, custom Gemini extension, credential storage, autonomous background memory process, or guarantee about unobservable Google retrieval internals.
- Automatic editing or synchronization of the four Google Docs, automated Keep cleanup/labeling, or requiring faculty to repair memory outside the Gemini conversation.
- Canvas API access, autonomous course creation/import/publication, automatic grading, individual student profiling, or any claim that a local `.imscc` is Bergen-compatible before authorized sandbox evidence.
- Student submissions, names, identifiers, grades, individual feedback, accommodations, disability/health/advising/disciplinary information, identifiable quotations, or identifying combinations in Gemini, Keep, repository fixtures, transfer blocks, or packages.
- Production deployment, Bergen-domain authorization, institutional policy approval, or publication of Canvas content; these remain owner-controlled release and operational gates.

**Dependencies and non-functional implications**:

- The faculty member's Bergen Google Workspace account must expose the connected Google Keep action to the classic Gem. When it does not, v2 must fail conservatively and continue only in visible chat without persistence.
- Current official Google Keep/Gemini, Common Cartridge/Canvas import, Bergen privacy, accessibility, and Apps Script hosting claims must be source-dated in `src/sources/authoritative-source-register.md`; repository instructions must not exceed what an authorized live environment demonstrates.
- The browser packager must remain accessible and responsive, client-only for course content, deterministic for identical input, explicit about unpublished review, and free of telemetry, accounts, databases, browser persistence, network content transfer, or third-party runtime dependencies.
- Common Cartridge and embedded QTI structure can be validated automatically, but actual Bergen Canvas interpretation is accepted only through a synthetic authorized import into an unpublished sandbox. Production publication remains a separate faculty decision.

### Creative Exploration Needed

The Level 4 creative requirement is satisfied by the faculty-approved v2 design: Google Keep is the active read/write memory, Google Docs are the curated archive, and Canvas is the protected-record/final-publication system; notes are atomic immutable revisions; only narrowly defined temporary Active Workbench records auto-save; durable records require explicit approval; every claimed write is retrieved and compared; ambiguous chains stop for faculty resolution; one approved whole-course transfer block produces one unpublished `.imscc`; and QTI remains the assessment-only route. Implementation must treat these decisions as constraints rather than reopen them. Any newly discovered limitation in classic Gem access to Keep or in Canvas cartridge interpretation is a release gate to surface, not authority to invent an integration.

### Implementation Guide Required

Yes. Extend `src/guides/command-reference.md`, `src/guides/faculty-quick-start.md`, `src/guides/privacy-checklist.md`, `src/guides/troubleshooting.md`, and `src/guides/end-to-end-demonstration.md`; add `src/guides/keep-memory-workflow.md` and `src/guides/canvas-course-handoff.md`; and keep `src/guides/qti-canvas-handoff.md` aligned. The faculty guidance must remain plain-language and no-code, identify the exact commands and observable verification fields, explain automatic versus approved memory, keep all recovery inside Gemini, distinguish `.imscc` whole-course packaging from QTI assessment packaging, and preserve manual unpublished Canvas review and publication.

## User Journey Definition

**Feature Type**: End-User Feature
**Creative Phase Required**: Yes - Architecture, User Journey, and Algorithm completed during approved brainstorm

### Invocation Method (End-User Features)
- **Location**: The Bergen Memory Bank custom Gem conversation at gemini.google.com, followed only at final handoff by the Bergen Course Packager browser page and Canvas Course Import.
- **Element**: `bergen:init <course>`, `bergen:resume <course>`, `bergen:memory`, `bergen:record`, `bergen:package course`, and `bergen:package assessment`, with equivalent natural-language requests.
- **Visibility**: Commands are listed by `bergen:help`; natural language remains available at all times.
- **Navigation**: Open the Gem, initialize or resume a named course, attach or reference the syllabus, complete staged authoring and review, approve durable records and the final course handoff, paste the generated transfer block into the external packager, download one `.imscc`, and import it into an unpublished Canvas sandbox.

### Success Criteria (End-User Features)
- **User sees**: Exact memory action, Keep note title, memory class, approval mode, and verification result after persistence; `Bergen Course Transfer Block` after whole-course approval; and `Course package ready` with an enabled `Download .imscc` action after successful external validation.
- **User can verify at**: A new Gemini conversation using `bergen:resume <course>` for memory; the Course Packager validation summary for the transfer block; and the unpublished Canvas sandbox Modules view after import.
- **Data persisted**: Atomic immutable notes in the professor's Google Keep account; generated `.imscc` only as a local browser download; final imported course content only in Canvas.
- **Observable within**: The same Gemini response for Keep verification and transfer generation, the same browser session for packaging, and the completed Canvas import job for sandbox content.

### Acceptance Criteria
- AC-ENTRY-1: Faculty can discover the memory and packaging workflows through `bergen:help` or natural language.
- AC-HAPPY-1: Faculty initializes from a syllabus, resumes from verified Keep memory, completes course review, and produces an importable unpublished-course handoff.
- AC-ERROR-1: Keep, transfer validation, packaging, and privacy failures preserve safe progress and never produce false success claims.

## Test Strategy

### Approach
- **Emphasis**: balanced content-contract, unit, integration, browser-smoke, package-structure, privacy, and authorized manual Canvas sandbox verification.
- **Target test count**: 40 new or materially extended checks across six phases; the count exceeds 20 because the feature has two independent persistence/package boundaries, immutable revision behavior, five new professor workflows, full course-content coverage, and protected-data short-circuit requirements.

### File Organization
- **New test files**: `tests/keep/memory-contract.test.mjs` for note schemas and revision selection; `tests/course/course-transfer.test.mjs` for transfer parsing and validation; `tests/course/common-cartridge.test.mjs` for manifest/content/QTI structure; `tests/course/apps-script-bundle.test.mjs` for client-only hosting; `tests/course/browser-smoke.mjs` for responsive packaging journeys.
- **Extend existing**: `tests/content/gem-workflows.test.mjs`, `tests/content/guide-alignment.test.mjs`, `tests/content/release-structure.test.mjs`, `tests/content/source-register.test.mjs`, and `tests/fixtures/workflow-scenarios.json`.

### What NOT to Test
- Live Bergen credentials or real student records — prohibited test data.
- Autonomous Canvas publication — out of scope; Canvas import and publication remain faculty-controlled.
- Google Keep internals or uptime — external Google behavior; verify only the Gem's observable invocation, result, retry, and conservative failure contract.
- Full visual parity across every browser — browser smoke tests cover supported responsive journeys, while authorized Canvas compatibility remains a manual release gate.

### Per-Phase Test Guidance
- Phase 1: 6 checks for source-dated Google Keep and Canvas claims, v2 inventory, schemas, and safe fixtures.
- Phase 2: 10 checks for new commands, natural-language parity, auto versus approved writes, verification, retrieval, conflicts, and privacy stops.
- Phase 3: 6 checks for immutable note titles, record bodies, revision chains, course isolation, and deterministic latest-record selection.
- Phase 4: 8 checks for course-transfer validation across modules, pages, assignments, discussions, rubrics, assessments, completion rules, and unpublished defaults.
- Phase 5: 8 checks for deterministic Common Cartridge/QTI ZIP members, XML/HTML escaping, browser-only processing, Apps Script bundle, and desktop/mobile packaging.
- Phase 6: 2 aggregate checks plus the authorized synthetic end-to-end Gemini → Keep → packager → unpublished Canvas sandbox journey.

## Implementation Roadmap

### New Source Files (pin path + extension)
- [ ] `src/contracts/bergen-memory-v2.md` — atomic Keep note schema, record types, approval classes, retrieval, revision, and verification protocol.
- [ ] `src/contracts/bergen-course-transfer-v0.1.json` — machine-readable course-transfer schema fixture.
- [ ] `src/guides/keep-memory-workflow.md` — professor-facing initialization, resumption, memory, retry, and privacy guidance.
- [ ] `src/guides/canvas-course-handoff.md` — whole-course review, packaging, sandbox import, and publication boundary.
- [ ] `tests/fixtures/sample-course-transfer.json` — synthetic CIS-277 complete-course fixture.
- [ ] `tests/keep/memory-contract.test.mjs` — deterministic Keep note-contract tests.
- [ ] `tests/course/course-transfer.test.mjs` — course-transfer validation tests.
- [ ] `tests/course/common-cartridge.test.mjs` — Common Cartridge and embedded assessment structure tests.
- [ ] `tests/course/apps-script-bundle.test.mjs` — static Apps Script and no-server-content checks.
- [ ] `tests/course/browser-smoke.mjs` — desktop and mobile course-packaging journeys.
- [ ] `apps/course-packager/appsscript.json` — Apps Script project manifest.
- [ ] `apps/course-packager/Code.gs` — static HTML Service entry point.
- [ ] `apps/course-packager/Index.html` — accessible packager shell.
- [ ] `apps/course-packager/Script.html` — client-side validation and `.imscc` packaging engine.
- [ ] `apps/course-packager/Styles.html` — responsive Bergen presentation layer.
- [ ] `apps/course-packager/README.md` — deployment, privacy, and verification boundaries.
- [ ] `scripts/build-course-demo.mjs` — deterministic self-contained demo and synthetic package builder.
- [ ] `demo/Bergen-Course-Packager-Demo.html` — generated local demonstration page.

### Phases
- [ ] Phase 1: Establish v2 source, release, schema, fixture, and dated-platform contracts.
- [ ] Phase 2: Implement professor commands and Google Keep read/write behavior in the Gem instruction and scenario contracts.
- [ ] Phase 3: Implement immutable memory revision, retrieval, verification, conflict, checkpoint, and recovery contracts plus faculty guidance.
- [ ] Phase 4: Implement the complete Bergen Course Transfer Block validator and syllabus-to-course workflow contract.
- [ ] Phase 5: Implement the browser-only Bergen Course Packager, Common Cartridge/QTI generation, Apps Script bundle, demo, and focused tests.
- [ ] Phase 6: Align all guides and release artifacts, run aggregate verification, and complete authorized synthetic Gemini/Keep and unpublished Canvas sandbox acceptance gates.

## Creative Phases

- [x] Architecture design → approved 2026-08-26
- [x] User Journey design → approved 2026-08-26
- [x] Algorithm design → approved 2026-08-26

## Plan Critique

**Backend**: skipped — codex unavailable (`unresolved:no-companion`, glob=∅)
**Verdict**: not run
**Summary**: The configured default independent critique could not run because no Codex companion installation was found. Taxonomy and concrete-spec quality gates still passed; no critique findings were produced or applied.

---

## Execution State

**Build Status**: IDLE
**Current Phase**: BUILD
**Current Step**: Step 3 - Spec Writer Agent - COMPLETE
**Step Started**: 2026-08-26
**Completed**: 2026-08-26
**Last Completed**: Build-ready specification, plan, and approved creative design
**Can Resume**: NO
**BRAINSTORM CRITIQUE**: skipped — unresolved:no-companion (glob=∅)

### Active Sub-Agents
(none)

### Completed Steps
- Full design approved: architecture, commands, memory flow, failure handling, course packaging, and verification strategy.
- Spec Writer produced 13 concrete acceptance criteria; taxonomy lint and the concrete end-user specification gate passed.
- Independent plan critique seam checked and recorded as unavailable (`unresolved:no-companion`, glob=∅).
