# System Architecture Patterns

## Guiding Principles

| Principle | Description |
|-----------|-------------|
| Privacy by Design | Process teaching context and de-identified class-level observations only. Stop when protected or identifiable student data appears and guide the faculty member toward a safe Class Learning Snapshot. |
| Canvas Is the Student-Record System | Student submissions, grades, and student-specific feedback stay in Canvas. Bergen Memory Bank never becomes a shadow student-record system. |
| No-Code Faculty Experience | Faculty workflows use plain language, a classic Gem, Google Docs, Google Drive, and Canvas. Git, code, APIs, terminals, and developer terminology remain behind the scenes. |
| Human Approval at Consequential Steps | Review and drafting may be assisted, but revision, proposed memory updates, and Canvas publication require explicit faculty approval. |
| Transparent Capability Boundaries | Prompt aliases are conversational routing conventions, not native commands or integrations. The Gem never claims to save, edit, publish, or synchronize automatically. |
| Minimum Necessary Context | State which attached documents and supplied facts are being used, ask only for missing information required to continue, and do not infer protected or unsupported details. |
| Source-Dated Claims | Tie policy and platform assertions to the dated authoritative source register, and re-review them when the source or release date changes. |
| Alignment Without Prerequisite Creep | Lessons, assignments, rubrics, and reinforcement activities align to outcomes and already introduced concepts. Never assume concepts marked as not yet introduced. |
| Accessible and Bias-Aware Outputs | Review materials for clarity, accessibility, cognitive load, quality, prerequisite creep, and bias before approved revision or publication. |

## High-Level Architecture

```text
Faculty lane (no-code)
  Faculty request or bergen:<workflow>
    → command and privacy-boundary check
    → relevant attached memory context
    → Remember → Frame → Plan → Draft → Review
    → faculty approval
    → Revise → proposed Record update
    → faculty copies approved material to Google Docs or Canvas

Developer release-validation lane
  Release contract + source register + synthetic/de-identified fixtures
    → dependency-free Node.js .mjs validation and tests
    → content, inventory, privacy, and claim-boundary evidence

Optional QTI companion (planned Phase 5; absent through Phase 2)
  Faculty-approved synthetic or non-student quiz content
    → text-only Bergen Quiz Transfer Block from the Gem
    → client-side browser validation and packaging
    → manual Canvas import and compatibility approval
```

The developer lane verifies repository artifacts but is not part of faculty installation or daily use. The optional Phase 5 QTI companion is architecturally separate from the Gem and Google Docs memory workflow; it must not become a server, student-record store, Canvas API integration, or prerequisite for the core no-code experience.

## Component Responsibilities

- **Classic Gemini Gem**: Routes commands and natural-language requests, enforces behavioral and privacy instructions, guides the staged workflow, and produces copy-ready text.
- **Faculty Profile**: Holds stable, non-student-specific faculty preferences and teaching context.
- **Course Memory**: Holds course-level outcomes, structure, concepts, constraints, and approved course context.
- **Active Workbench**: Holds current, temporary work-in-progress context for the active teaching task.
- **Decisions, Reflections, and Reusable Practices**: Holds approved decisions and reusable faculty practices with enough context to judge future applicability.
- **Class Learning Snapshot**: Holds only de-identified, class-level observations needed to design reinforcement.
- **Canvas**: Holds protected student records and receives final faculty-approved publishing actions.
- **Release Contract**: Defines the v1.0 scope, safeguard boundary, exact artifact inventory, phase ownership, and Ready/Pending state in `src/release/release-contract.md`.
- **Authoritative Source Register**: Holds dated official-source pointers and narrow claim mappings in `src/sources/authoritative-source-register.md`; Memory Bank documents reference this register rather than duplicate its source details.
- **Scenario Matrix and Fixtures**: Define observable Phase 2 Gem behavior and later-phase contracts while supplying synthetic or de-identified workflow and quiz inputs without claiming unimplemented packaging behavior.
- **Validation Harness and Tests**: Use dependency-free Node.js `.mjs` files to check release structure, inventory state, source discipline, fixture safety, Gem workflow contracts, and capability boundaries for repository contributors.
- **QTI Packager**: Planned optional Phase 5 client-side companion that will validate a faculty-approved text-only transfer block and prepare a package for manual Canvas import; no QTI application exists through Phase 2.

## Conversational Routing Pattern

1. Match case-insensitive input shaped like `bergen:<workflow> [optional request or parameters]`.
2. Display `Bergen Memory Bank · <Workflow Name>` for recognized commands.
3. Identify relevant attached memory documents and state the context being used.
4. Check supplied information against the privacy boundary before substantive processing.
5. Ask only for information required to continue.
6. Follow the staged workflow and pause at applicable approval gates.
7. End with the current stage and recommended next command.
8. For an unknown command, do not guess; display help and suggest the closest supported commands.

Natural-language requests use the same routing and safeguards. Commands are optional aliases.

## Memory Ownership and Update Pattern

- Each fact should have one primary document home; other documents reference rather than duplicate stable context when practical.
- The Gem may propose an update only through the Record stage.
- A proposed update identifies the target document and supplies copy-ready text.
- The faculty member approves and manually applies the update.
- The Gem must not claim that an attached knowledge document changed automatically.
- Shared Faculty Profile and Decisions, Reflections, and Reusable Practices documents combine with a course-specific Course Memory and Active Workbench pair. The replaceable Class Learning Snapshot remains a section inside Active Workbench rather than a fifth knowledge document.

## Ordered Safety Kernel and Workflow Engine Pattern

The classic Gem applies its behavioral layers in a fixed order: privacy and capability checks precede routing; routing precedes course and context selection; context selection precedes the seven-stage workflow engine; and workflow-specific output remains bounded by the response contract. Protected-data detection short-circuits the sequence before substantive processing.

This ordering keeps aliases from acquiring authority, prevents retrieval or drafting from bypassing the Canvas student-record boundary, and makes course selection, stage state, approval state, and safe next steps observable. The source contract lives in `src/gem/bergen-memory-bank-instructions.md`, with scenario-based checks in `tests/content/gem-workflows.test.mjs` and `tests/fixtures/workflow-scenarios.json`.

## Text-Only Quiz Handoff Pattern

- The Gem may emit a Bergen Quiz Transfer Block only for an approved, reviewed, synthetic or non-student quiz with complete supported item and scoring information.
- The block is structured text, not a QTI file or ZIP, and creating it does not claim validation, packaging, import, or compatibility.
- The separate Phase 5 browser tool owns transfer-block validation and local packaging; the faculty member owns the manual unpublished-course import, review, and publication decision.
- Unsupported or incomplete items fall back to copy-ready Canvas quiz content so the core Assignment workflow does not depend on the optional packager.

## Safety and Error Patterns

### Protected or Identifiable Information

- Stop processing the protected content.
- Explain the boundary without echoing or transforming the sensitive details unnecessarily.
- Offer the Class Learning Snapshot fields needed for a de-identified replacement.
- Resume only from the safe replacement supplied by the faculty member.

### Unknown Command

- Do not invent a workflow.
- Show `bergen:help` content.
- Suggest the closest supported commands and allow a natural-language restatement.

### Missing or Conflicting Context

- Name the missing or conflicting context.
- Ask the minimum question needed to proceed.
- Do not silently choose between conflicting memory documents.

### Unsupported Action

- State the limitation plainly.
- Provide copy-ready instructions or content for the faculty member to apply manually.
- Preserve the applicable approval gate.

## Content Organization Patterns

- Repository source artifacts are expected to use Markdown unless planning establishes a justified alternative.
- Faculty-facing documents must be copy-ready and avoid repository paths, Markdown mechanics, or developer workflow language.
- Version identifiers and source-review dates must be visible in release-facing material where policy or platform drift matters.
- Demonstrations and tests use synthetic, de-identified examples only.
- The release contract is the complete artifact inventory. `Ready` means present and verified in the current phase; `Pending` means assigned to a later phase and intentionally absent. Validation checks both conditions so inventory rows cannot imply unimplemented capability.
- Detailed policy and platform citations live in the authoritative source register. Other Memory Bank and release documents point to that register and summarize only the boundary they need.

## Release Validation Pattern

- Repository validation uses Node.js ECMAScript modules (`.mjs`) and built-in modules only. `package.json` intentionally has no `dependencies` or `devDependencies`.
- `scripts/validate-release.mjs` provides build and lint modes and composes them with the focused tests in aggregate mode.
- `tests/content/release-structure.test.mjs` maps the release contract, version stamp, package scripts, artifact existence, and fixture safety rules to executable checks.
- `tests/content/source-register.test.mjs` maps the authoritative source register to dated-source completeness and bounded policy, Gemini, Canvas, QTI, and Apps Script claims.
- `tests/content/gem-workflows.test.mjs` maps the complete Gem instruction source and its 18 synthetic scenarios to routing, context, stage, approval, privacy, prerequisite, handoff, and capability-boundary checks.
- The human-readable `src/testing/scenario-matrix.md` records which Gem behaviors are verified in Phase 2 and which template, guide, packaging, or compatibility checks remain later-phase work.

### Fixture Rules

- Fixtures must declare the `synthetic/de-identified` data classification and state that they contain no real student data.
- Fixtures must not contain names, email addresses, student IDs, individual grades, accommodations, disability or health information, disciplinary records, credentials, identifying filenames, or raw student work.
- Workflow scenarios are Phase 2 content-contract evidence. The sample quiz remains a seed for later packaging tests, and its metadata must not imply that the QTI application or Canvas compatibility is complete.

## Testing Patterns

### Organization

- Keep source-to-test ownership explicit: the release contract and fixtures map to the release-structure suite, while dated claims map to the source-register suite.
- Use scenario-based acceptance checks organized by workflow and cross-cutting safeguard.
- Maintain at least one happy-path scenario for every command and representative natural-language equivalent.
- Add focused scenarios for privacy rejection and recovery, unknown commands, concepts not yet introduced, review-before-revise, record proposals, and manual Canvas publication.

### Verification Style

- Prefer observable outputs: workflow header, context statement, minimum necessary question, stage label, approval pause, safe-data guidance, and next-command recommendation.
- Verify internal alignment across the lesson → assignment → rubric → review → record demonstration.
- Review installation and faculty guides with a nontechnical-reader lens.
- Validate current policy and platform claims against dated authoritative sources before version 1.0 release.

### Deliberately Excluded

- No tests involving real student records or credentials.
- No API, automated Canvas, or autonomous document-edit testing because those capabilities are version 1.0 non-goals.

<!-- AUTO-MANAGED: c4-architecture-start -->
## C4 Architecture

C4 architecture documentation has not been generated. Phases 1 and 2 include developer-only validation plus the Markdown Gem instruction source, and Phase 5 plans an optional client-side QTI companion, but no C4 manifest exists and the QTI application is not implemented through Phase 2.

<!-- AUTO-MANAGED: c4-architecture-end -->

## Recent Architecture Changes

### 2026-08-04 - Implemented the ordered Gem safety kernel and workflow engine

- **What Changed**: Added the complete classic Gem instruction component with an always-on privacy and capability kernel, case-insensitive and natural-language routing, explicit course and context selection, the seven-stage workflow engine, independent approval gates, protected-data recovery, prerequisite safeguards, and manual Google Docs, Canvas, and text-only quiz handoffs.
- **Reason**: Turn the planned no-code safety and workflow boundaries into one inspectable instruction contract with scenario-based verification.
- **Trade-offs**: Static content-contract tests cannot execute live Gemini behavior, but they make the intended observable contract deterministic without adding a faculty runtime, API, or third-party dependency.
- **Affected Components**: Classic Gemini Gem, scenario matrix and fixtures, validation harness and tests, and the future QTI Packager boundary.

### 2026-08-04 - Added the release-contract validation lane

- **What Changed**: Added a developer-only release contract, dated source register, artifact-state inventory, synthetic fixtures, and dependency-free Node.js content-validation harness alongside the no-code faculty workflow.
- **Reason**: Make privacy, capability, provenance, and release-state boundaries executable before later deliverables are built.
- **Trade-offs**: The repository now contains a small software-validation component, but keeping it isolated prevents Node.js and developer commands from becoming faculty prerequisites.
- **Affected Components**: Release foundation, source register, scenario matrix, fixtures, validation harness, and content tests. The planned QTI Packager remains pending Phase 5.

### 2026-08-04 - Greenfield workflow baseline

- **What Changed**: Established the no-code, privacy-safe, approval-gated architecture from the supplied v1.0 request.
- **Reason**: Make the product boundaries enforceable before detailed design begins.
- **Trade-offs**: Manual copy and publication reduce automation but keep capabilities transparent and student records in Canvas.
- **Affected Components**: All planned version 1.0 deliverables.
