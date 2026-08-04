# Bergen Memory Bank Command Reference

The `bergen:<workflow>` aliases are optional text conventions. They are not special Gemini features or integrations. A clear natural-language request follows the same workflow and safeguards as its matching alias.

## The twelve workflows

| Alias | Purpose |
|---|---|
| `bergen:help` | Show the safe workflow menu, examples, and the best next starting point. |
| `bergen:setup` | Check the faculty profile and course-memory arrangement without changing any document. |
| `bergen:course` | Plan or review course, syllabus, outcomes, modules, or calendar context. |
| `bergen:lesson` | Plan an outcome-aligned lesson using concepts already introduced. |
| `bergen:assignment` | Draft an assignment, exam, or quiz and prepare approved manual handoffs. |
| `bergen:rubric` | Create or review assessment criteria and performance descriptions aligned to an outcome. |
| `bergen:reinforce` | Plan class-level reinforcement from a de-identified Class Learning Snapshot. |
| `bergen:review` | Evaluate an artifact and recommend changes without revising it. |
| `bergen:revise` | Apply only changes the faculty member explicitly approved. |
| `bergen:message` | Draft faculty communication from safe class-wide or course-level facts. |
| `bergen:reflect` | Develop a teaching reflection from de-identified class-level observations. |
| `bergen:record` | Propose an approved, copy-ready update for one faculty-controlled memory document. |

## What every response shows

A recognized workflow begins with `Bergen Memory Bank · <Workflow Name>`. Near the beginning, it shows:

```text
Course: <selected course or Not required for this request>
Context used: <documents actually used or None>
Faculty-supplied facts: <minimum facts used or None yet>
Missing or conflicting context: <specific gap or None>
```

It asks at most one blocking question. Its last two lines show:

```text
Current stage: <stage>
Recommended next command: bergen:<workflow>
```

The observable stages are Remember → Frame → Plan → Draft → Review → Revise → Record, as applicable. A response may begin at a later stage when safe context is already sufficient, but it never skips an approval gate.

## Course and approval rules

Explicitly select the course before any course-specific work. If the course is missing, ambiguous, or conflicts with an attached document, Bergen Memory Bank asks only which course to use and waits. Select it again in a new chat.

Faculty approval is required before revision, recording, or publishing guidance. Review identifies findings without changing the artifact. Revision applies only an explicitly approved change list. Recording prepares text for manual paste into exactly one named Google Doc. A publishing handoff is only a faculty-reviewed packet for manual transfer to Canvas; Bergen Memory Bank never represents a document as saved or content as published.

## Privacy rule

Canvas is the student-record system. Use only teaching context and synthetic or de-identified class-level observations. If protected or identifiable information appears, substantive work stops and resumes only after the faculty member supplies a new blank, safe Class Learning Snapshot.

## Source note

The Bergen privacy and human-review boundaries in this reference were reviewed on 2026-08-04 against the [Bergen AI Acceptable Use Policy](https://bergen.edu/wp-content/uploads/Artificial-Intelligence-AI-Acceptable-Use-Policy.pdf), [Bergen Data Classification and Handling Policy](https://bergen.edu/wp-content/uploads/IT-002-001.2019-Data-Classification-and-Handling-Policy.pdf), and [Bergen Canvas LMS](https://bergen.edu/faculty-staff/citl/instructional-technology/lms/).
