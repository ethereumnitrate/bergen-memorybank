# Product Brief

## Project Foundation

- **Project Name**: Bergen Memory Bank
- **Objective**: Design and package version 2.0 of a privacy-safe, no-code faculty workflow system for Bergen Community College.
- **Scope**: The repository holds the source-of-truth instructions, reusable document templates, guides, demonstrations, privacy material, and planning records used to produce the faculty-facing kit. Faculty do not interact with this repository.
- **Repository Structure**: `memory-bank/` contains durable project context and task state. The deliverable layout will be chosen during planning.
- **Key Stakeholders**: Bergen Community College faculty are the primary users. Institutional owners for AI policy, data classification, Canvas guidance, accessibility, and faculty enablement remain to be confirmed.

## Product Overview

- **Name**: Bergen Memory Bank
- **Version Target**: 2.0
- **Value Proposition**: Help faculty remember course context and create aligned teaching materials through a guided conversational workflow without exposing protected student records or requiring technical skills.
- **Product Type**: No-code workflow and document-template kit built around one classic custom Gemini Gem, connected Google Keep actions, optional Google Docs archives, browser-only packaging companions, and Canvas.
- **Stage**: Version 2.0 repository candidate complete; authorized live classic Gem/Keep verification and unpublished Canvas sandbox acceptance remain pending

## Key Functionality

- One classic custom Gemini Gem named “Bergen Memory Bank.”
- A case-insensitive `bergen:<workflow>` prompt-alias protocol with natural-language equivalents.
- Seventeen workflows spanning help, setup, course initialization and resume, memory inspection, teaching-material creation, review and revision, verified recording, and separate whole-course and assessment-only packaging handoffs.
- Atomic, course-scoped Google Keep memory with temporary and durable authority classes, immutable revisions, exact-title retrieval, full-content comparison, conflict handling, and visible recovery when persistence cannot be verified.
- Four reusable Google Docs documents retained as an optional curated archive rather than the daily memory layer.
- A de-identified Class Learning Snapshot for class-level reinforcement planning.
- A staged workflow: Remember → Frame → Plan → Draft → Review → Revise → Record.
- Human approval before revision, durable memory recording, either packaging handoff, or Canvas publication.
- Browser-only creation of a local whole-course Common Cartridge `.imscc` and a distinct assessment-only QTI ZIP after review and approval.
- Eleven coordinated installation, quick-start, presentation, sample prompt, demonstration, privacy, troubleshooting, memory, and Canvas handoff guides.

## Market and Context

- **Primary Market**: Faculty teaching at Bergen Community College.
- **Sector**: Higher education.
- **Geographic Focus**: Bergen Community College community; broader reuse is outside version 1.0 scope.
- **Alternative Approaches**: Ad hoc prompting, disconnected personal notes, generic AI assistants, or manual reuse of prior course materials.
- **Differentiators**: Bergen-specific guidance, explicit privacy boundaries, reusable course memory, transparent capability limits, and an approval-gated workflow.

## Key Personas

### Primary Persona

| Persona | Role | Goals | Pain Points | Success Measures |
|---------|------|-------|-------------|------------------|
| Faculty Member | Bergen instructor with no assumed technical background | Create coherent, aligned, accessible course materials; reuse sound decisions; reinforce class-level needs safely | Repeating context, fragmented materials, uncertainty about safe AI use, and overly technical tooling | Can install the kit, invoke or describe a workflow, understand the context used, approve changes, and move copy-ready results into Google Docs or Canvas |

### Secondary Personas

| Persona | Role | Goals |
|---------|------|-------|
| Faculty Support Partner | Instructional designer, faculty-development facilitator, or other approved support role; exact ownership is unknown | Help faculty install, understand, and use the kit consistently |
| Institutional Reviewer | Authorized policy, accessibility, Canvas, or data-governance stakeholder; exact roles are unknown | Confirm that version 1.0 guidance matches current institutional requirements |

## User Flows

- **Onboarding**: Create a Bergen Memory Bank folder in Google Drive, copy supplied templates, create a classic custom Gem with a `bergen.edu` account, paste the supplied instructions, attach the Drive documents as Gem knowledge, save, and enter `bergen:help`.
- **Primary Flow**: Faculty enters a supported command or natural-language request; the Gem identifies the workflow, states the memory context it is using, asks only for required information, follows the staged workflow, pauses at approval gates, and ends with the current stage and recommended next command.
- **Protected-Data Recovery**: If identifiable or protected student information appears, the Gem stops processing it, explains the boundary, and helps the faculty member replace it with a de-identified Class Learning Snapshot.
- **Verified Memory**: After approval when required, the Gem creates a Keep note, retrieves exactly one exact-title note, compares its complete content, and reports success only when the comparison passes. Failure leaves the proposal in the current Gemini conversation.
- **Whole-Course Handoff**: After separate final review and approval, the Gem emits one Bergen Course Transfer Block. The browser-only Course Packager creates a local `.imscc`; faculty manually imports it into an authorized unpublished Canvas sandbox and reviews it before any later publication decision.
- **Assessment Handoff**: For one approved quiz or exam, the separate assessment route creates a local QTI ZIP for manual unpublished Canvas import and review.

## Success Criteria

- All documented commands route predictably and unknown commands fall back to `bergen:help` without guessing.
- Natural-language requests remain usable when faculty do not remember command names.
- Installation uses only the eight approved Google Drive and Gemini steps and can be explained in a five-minute guide.
- Every workflow makes its context and current stage visible.
- Review does not silently become revision; revision, recording, and publication remain faculty-approved actions.
- Privacy scenarios consistently reject protected data and guide de-identification.
- The complete lesson → assignment → rubric → review → revise → verified record → whole-course package → unpublished Canvas review demonstration is internally aligned.
- Local repository artifacts and aggregate verification are Ready without claiming live Keep persistence or Bergen Canvas compatibility.
- Faculty-facing content contains no requirement for Git, programming, APIs, terminals, or developer terminology.

## Non-Functional Requirements

### Privacy and Data Safety

- Canvas stores student submissions, grades, and student-specific feedback.
- Bergen Memory Bank stores teaching context, faculty decisions, course materials, and de-identified class-level observations only.
- Never request, accept, or retain raw submissions; names, emails, IDs, or identifying filenames; individual grades; student-specific feedback; accommodation, disability, health, advising, or disciplinary information; identifiable quotations; or identifying combinations of details.
- Examples and demonstrations must use synthetic, non-identifiable information.

### Usability and Accessibility

- Assume no technical background and use plain faculty-facing language.
- Ask only questions required to continue.
- Keep commands optional and support equivalent natural-language requests.
- Review generated faculty and student-facing materials for clarity, accessibility, cognitive load, prerequisite creep, and bias.
- Applicable Bergen and Canvas accessibility requirements must be verified from current authoritative sources during planning.

### Transparency and Reliability

- Prompt aliases must never be represented as native Gemini commands, plugins, integrations, or additional system access.
- Never claim a Keep write until exact-title retrieval and full-content comparison succeed, or claim Canvas import, compatibility, or publication without the corresponding observed manual action.
- State the context being used and surface missing information rather than inventing it.
- Treat attached memory documents as reference material that may require faculty confirmation when incomplete or inconsistent.

## Integration Points

| System | Purpose | Interaction |
|--------|---------|-------------|
| Classic custom Gemini Gem | Conversational workflow host | Faculty manually creates and configures the Gem; no plugin or API integration |
| Google Drive | Faculty-owned folder for reusable documents | Faculty manually creates the folder and manages files |
| Google Keep | Active course-scoped memory | The classic Gem uses observable connected actions; no Keep API or custom client is included, and success requires create → exact-title retrieve → compare → report evidence |
| Google Docs | Optional curated memory and output archive | Faculty copies templates and manually applies approved updates; Docs are not the daily memory layer or a Keep-repair requirement |
| Canvas | Student-record system and final publishing destination | Faculty manually imports into an authorized unpublished sandbox, reviews, and later decides whether to publish; no Canvas API integration |
| Bergen QTI Packager | Optional QTI 1.2 handoff for approved supported quizzes | Static Bergen-controlled Apps Script page; quiz validation and ZIP creation remain in browser memory; faculty imports and reviews manually |
| Bergen Course Packager | Optional whole-course Common Cartridge 1.3 handoff | Static Bergen-controlled Apps Script page; validation and `.imscc` creation remain in browser memory; faculty imports and reviews manually |

## Constraints and Non-Goals

- No Canvas API integration.
- No automated grading or individual student profiling.
- No protected student records in Gemini or Gem knowledge.
- No Keep API/client, automatic document modification, Canvas import automation, or autonomous Canvas publishing.
- No Gemini Labs or Opal dependency.
- No Git, code, command-line, API, or developer-tool requirement for faculty.
- Current Bergen AI Acceptable Use Policy, Data Classification Policy, Canvas guidance, and official Google Gem documentation are authoritative and must be verified during design and content production.

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Faculty enters protected student information | Medium | High | Prominent safe-data guidance, immediate stop behavior, de-identification recovery, and scenario testing |
| The Gem implies capabilities it does not have | Medium | High | Explicit capability boundaries, copy-ready outputs, and tests for recording/publishing claims |
| Institutional or platform guidance changes | Medium | High | Cite current authoritative sources, preserve source-review dates, and provide update instructions |
| Course memory becomes inconsistent or cannot be verified | Medium | High | Use immutable revisions, exact-title retrieval, full-content comparison, conflict quarantine, and visible continue-without-persistence recovery |
| A local package is mistaken for Canvas compatibility | Medium | High | Keep repository readiness distinct from authorized unpublished sandbox evidence and require manual review before publication |
| Generated materials introduce inaccessible or biased content | Medium | High | Make review criteria explicit and retain faculty approval before revision or publishing |

## Open Questions

- [x] Which document structure best minimizes duplication while keeping the four required Google Docs usable? Resolved as two shared documents plus one Course Memory and Active Workbench pair per course.
- [x] Which Bergen policy passages and Canvas guidance must be reflected verbatim or summarized in faculty materials? Resolved through the dated authoritative-source register and bounded faculty guidance.
- [x] What current classic custom Gem knowledge-file capabilities and limits affect the installation design? Resolved as manual classic Gem configuration with four attached Drive documents and no automatic editing claim.
- [ ] Who owns version review and updates after 1.0?

## Document History

| Date | Author | Changes |
|------|--------|---------|
| 2026-08-04 | Alex and Codex | Initialized from the supplied Bergen Memory Bank v1.0 request |
| 2026-08-04 | Alex and Codex | Completed the five-phase local v1.0 build; retained live deployment and manual Canvas compatibility as explicit gates |
| 2026-08-27 | Alex and Codex | Refreshed for the completed v2 repository candidate, verified Keep semantics, separate package handoffs, and pending authorized external acceptance gates |

## Last Refreshed

2026-08-27
