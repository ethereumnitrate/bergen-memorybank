# Bergen Memory Bank Command Reference

The `bergen:<workflow>` aliases are optional text conventions. They are not special Gemini features or integrations. A clear natural-language request follows the same workflow and safeguards as its matching alias.

## The seventeen workflows

| Alias | Purpose |
|---|---|
| `bergen:help` | Show the safe workflow menu, examples, and the best next starting point. |
| `bergen:setup` | Check the faculty profile and course-memory arrangement without changing any document. |
| `bergen:init <course>` | Start one named course from a safe supplied syllabus and allow only a low-risk temporary checkpoint automatically. |
| `bergen:resume <course>` | Retrieve and verify only that course's Google Keep memory before continuing. |
| `bergen:memory` | Show the exact active Keep note titles, memory classes, conflicts, and last verified write used in this conversation. |
| `bergen:course` | Plan or review course, syllabus, outcomes, modules, or calendar context. |
| `bergen:lesson` | Plan an outcome-aligned lesson using concepts already introduced. |
| `bergen:assignment` | Draft an assignment, exam, or quiz and prepare approved manual handoffs. |
| `bergen:rubric` | Create or review assessment criteria and performance descriptions aligned to an outcome. |
| `bergen:reinforce` | Plan class-level reinforcement from a de-identified Class Learning Snapshot. |
| `bergen:review` | Evaluate an artifact and recommend changes without revising it. |
| `bergen:revise` | Apply only changes the faculty member explicitly approved. |
| `bergen:message` | Draft faculty communication from safe class-wide or course-level facts. |
| `bergen:reflect` | Develop a teaching reflection from de-identified class-level observations. |
| `bergen:record` | Display one durable memory revision and create it only after approval and exact-note verification. |
| `bergen:package course` | After final course review and separate approval, emit one Bergen Course Transfer Block for a local whole-course `.imscc`. |
| `bergen:package assessment` | After assessment review and separate approval, emit one Bergen Quiz Transfer Block for an assessment-only QTI ZIP. |

## What every response shows

A recognized workflow begins with `Bergen Memory Bank · <Workflow Name>`. Near the beginning, it shows:

```text
Course: <selected course or Not required for this request>
Context used: <exact Keep note titles or other context actually used, or None>
Faculty-supplied facts: <minimum facts used or None yet>
Missing or conflicting context: <specific gap or None>
```

It asks at most one blocking question. Its last two lines show:

```text
Current stage: <stage>
Recommended next command: bergen:<workflow>
```

The observable stages are Remember → Frame → Plan → Draft → Review → Revise → Record, as applicable. A response may begin later when safe verified context is sufficient, but it never skips an approval gate.

## What a verified memory write shows

A claimed Google Keep write appears only after create → retrieve → compare → report completes. The same response shows:

```text
Memory action: Created
Keep note: <exact title>
Memory class: Temporary or Durable
Approval: Automatic low-risk or Faculty approved
Verification: <exact retrieval and full-content comparison result>
```

Automatic memory is limited to a meaningful temporary Active Workbench checkpoint: workflow stage, next step, temporary ideas, open questions, missing facts, or a de-identified summary. Durable faculty, course, policy, decision, practice, reflection, replacement, and archive records require approval for the exact displayed record and revision.

If creation, exact-title retrieval, or comparison fails, the response shows `Memory action: Failed`. The safe proposal remains in the current conversation and the only choices are `Retry memory write` or `Continue without persistence`. Recovery stays inside Gemini; do not repair Keep manually.

## Course, privacy, and handoff rules

Explicitly select the course before course-specific work. If the course is missing, ambiguous, or conflicts with a retrieved record, Bergen Memory Bank asks only which course or fact to use and waits.

Canvas is the student-record system. Use only teaching context and synthetic or de-identified class-level observations. Protected or identifiable information stops work before Keep retrieval, memory, transfer preparation, or packaging.

Faculty approval is required before revision, durable recording, or either packaging handoff. Whole-course packaging and assessment-only packaging are different routes. A local package is not a Canvas import, compatibility result, or publication. Canvas import review and publication remain manual faculty actions in an authorized unpublished course.

## Source note

The privacy, Google Keep, Common Cartridge, Canvas import, and human-review boundaries in this reference were reviewed on 2026-08-26 against the dated official sources recorded for Bergen Memory Bank.
