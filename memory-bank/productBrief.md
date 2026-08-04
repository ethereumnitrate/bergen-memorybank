# Product Brief

## Project Foundation

- **Project Name**: Bergen Memory Bank
- **Objective**: Design and package version 1.0 of a privacy-safe, no-code faculty workflow system for Bergen Community College.
- **Scope**: The repository holds the source-of-truth instructions, reusable document templates, guides, demonstrations, privacy material, and planning records used to produce the faculty-facing kit. Faculty do not interact with this repository.
- **Repository Structure**: `memory-bank/` contains durable project context and task state. The deliverable layout will be chosen during planning.
- **Key Stakeholders**: Bergen Community College faculty are the primary users. Institutional owners for AI policy, data classification, Canvas guidance, accessibility, and faculty enablement remain to be confirmed.

## Product Overview

- **Name**: Bergen Memory Bank
- **Version Target**: 1.0
- **Value Proposition**: Help faculty remember course context and create aligned teaching materials through a guided conversational workflow without exposing protected student records or requiring technical skills.
- **Product Type**: No-code workflow and document-template kit built around one classic custom Gemini Gem, Google Docs, Google Drive, and Canvas.
- **Stage**: Concept and design planning

## Key Functionality

- One classic custom Gemini Gem named “Bergen Memory Bank.”
- A case-insensitive `bergen:<workflow>` prompt-alias protocol with natural-language equivalents.
- Workflows for help, setup, course design, lessons, assignments, rubrics, reinforcement, review, revision, messages, reflection, and proposed memory updates.
- Four reusable memory documents: Faculty Profile, Course Memory, Active Workbench, and Decisions, Reflections, and Reusable Practices.
- A de-identified Class Learning Snapshot for class-level reinforcement planning.
- A staged workflow: Remember → Frame → Plan → Draft → Review → Revise → Record.
- Human approval before revision, proposed memory recording, or Canvas publication.
- Installation, quick-start, presentation, sample prompt, demonstration, privacy, and troubleshooting materials.

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
- **Publishing**: The Gem prepares copy-ready material. The faculty member reviews and manually publishes approved content in Canvas.

## Success Criteria

- All documented commands route predictably and unknown commands fall back to `bergen:help` without guessing.
- Natural-language requests remain usable when faculty do not remember command names.
- Installation uses only the eight approved Google Drive and Gemini steps and can be explained in a five-minute guide.
- Every workflow makes its context and current stage visible.
- Review does not silently become revision; revision, recording, and publication remain faculty-approved actions.
- Privacy scenarios consistently reject protected data and guide de-identification.
- The complete lesson → assignment → rubric → review → record demonstration is internally aligned.
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
- Never claim to save, modify, publish, or synchronize documents automatically.
- State the context being used and surface missing information rather than inventing it.
- Treat attached memory documents as reference material that may require faculty confirmation when incomplete or inconsistent.

## Integration Points

| System | Purpose | Interaction |
|--------|---------|-------------|
| Classic custom Gemini Gem | Conversational workflow host | Faculty manually creates and configures the Gem; no plugin or API integration |
| Google Drive | Faculty-owned folder for reusable documents | Faculty manually creates the folder and manages files |
| Google Docs | Editable memory and output documents | Faculty copies templates and manually applies approved updates |
| Canvas | Student-record system and final publishing destination | Faculty manually reviews and publishes approved material; no Canvas API integration |

## Constraints and Non-Goals

- No Canvas API integration.
- No automated grading or individual student profiling.
- No protected student records in Gemini or Gem knowledge.
- No automatic document modification or autonomous Canvas publishing.
- No Gemini Labs or Opal dependency.
- No Git, code, command-line, API, or developer-tool requirement for faculty.
- Current Bergen AI Acceptable Use Policy, Data Classification Policy, Canvas guidance, and official Google Gem documentation are authoritative and must be verified during design and content production.

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Faculty enters protected student information | Medium | High | Prominent safe-data guidance, immediate stop behavior, de-identification recovery, and scenario testing |
| The Gem implies capabilities it does not have | Medium | High | Explicit capability boundaries, copy-ready outputs, and tests for recording/publishing claims |
| Institutional or Google guidance changes | Medium | High | Cite current authoritative sources, date the v1.0 source review, and provide update instructions |
| Memory documents become inconsistent or too burdensome | Medium | Medium | Compare viable structures during design, minimize duplication, define document ownership, and use proposed rather than automatic updates |
| Generated materials introduce inaccessible or biased content | Medium | High | Make review criteria explicit and retain faculty approval before revision or publishing |

## Open Questions

- [ ] Which document structure best minimizes duplication while keeping the four required Google Docs usable?
- [ ] Which Bergen policy passages and Canvas guidance must be reflected verbatim or summarized in faculty materials?
- [ ] What current classic custom Gem knowledge-file capabilities and limits affect the installation design?
- [ ] Who owns version review and updates after 1.0?

## Document History

| Date | Author | Changes |
|------|--------|---------|
| 2026-08-04 | Alex and Codex | Initialized from the supplied Bergen Memory Bank v1.0 request |

## Last Refreshed

2026-08-04
