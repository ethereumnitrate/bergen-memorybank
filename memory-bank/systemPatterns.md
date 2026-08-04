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
| Alignment Without Prerequisite Creep | Lessons, assignments, rubrics, and reinforcement activities align to outcomes and already introduced concepts. Never assume concepts marked as not yet introduced. |
| Accessible and Bias-Aware Outputs | Review materials for clarity, accessibility, cognitive load, quality, prerequisite creep, and bias before approved revision or publication. |

## High-Level Architecture

```text
Faculty request or bergen:<workflow>
  → command and privacy-boundary check
  → relevant attached memory context
  → Remember → Frame → Plan → Draft → Review
  → faculty approval
  → Revise → proposed Record update
  → faculty copies approved material to Google Docs or Canvas
```

## Component Responsibilities

- **Classic Gemini Gem**: Routes commands and natural-language requests, enforces behavioral and privacy instructions, guides the staged workflow, and produces copy-ready text.
- **Faculty Profile**: Holds stable, non-student-specific faculty preferences and teaching context.
- **Course Memory**: Holds course-level outcomes, structure, concepts, constraints, and approved course context.
- **Active Workbench**: Holds current, temporary work-in-progress context for the active teaching task.
- **Decisions, Reflections, and Reusable Practices**: Holds approved decisions and reusable faculty practices with enough context to judge future applicability.
- **Class Learning Snapshot**: Holds only de-identified, class-level observations needed to design reinforcement.
- **Canvas**: Holds protected student records and receives final faculty-approved publishing actions.

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
- The final document structure and cross-reference strategy remain a design decision for the v1.0 brainstorm.

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

## Testing Patterns

### Organization

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

C4 architecture documentation has not been generated. The project is a greenfield content and workflow kit with no software components to scan at initialization.

<!-- AUTO-MANAGED: c4-architecture-end -->

## Recent Architecture Changes

### 2026-08-04 - Greenfield workflow baseline

- **What Changed**: Established the no-code, privacy-safe, approval-gated architecture from the supplied v1.0 request.
- **Reason**: Make the product boundaries enforceable before detailed design begins.
- **Trade-offs**: Manual copy and publication reduce automation but keep capabilities transparent and student records in Canvas.
- **Affected Components**: All planned version 1.0 deliverables.
