# Bergen Memory Bank v2 Design

## Design Objective

Give Bergen faculty a no-code course-development workflow that reads and writes active memory from within Gemini, preserves faculty approval for consequential records, and produces a complete Canvas course-import handoff without moving protected student data outside Canvas.

## Approaches Considered

### Gem-native Google Keep protocol — selected

The classic custom Gem explicitly invokes connected Google Keep operations, uses structured atomic notes, and verifies writes by retrieving the exact note. This preserves the existing no-code faculty experience and uses the capability confirmed in the faculty's Bergen account. It depends on connected-app availability and therefore requires observable verification and conservative failure behavior.

### Google Keep plus Google Sheet registry

A Sheet would improve indexing and auditability but would add another faculty-facing tool, another synchronization boundary, and more manual intervention. It is deferred unless Keep retrieval proves insufficient in live acceptance testing.

### Apps Script memory service

A dedicated memory service could provide stronger querying and mutation semantics but would require deployment, permissions, and institutional administration. The professor-facing commands and record schema are intentionally storage-adapter-like so a later service can replace Keep operations without changing the workflow language.

## Approved Architecture

The Gemini Gem applies the privacy kernel and explicit course selection before memory retrieval or authoring. Google Keep is the active read/write memory brain. Google Docs remain a curated long-term archive rather than a required daily persistence step. Canvas remains the protected student-record system and final publication destination.

The workflow has three coordinated lanes:

1. Keep Memory Brain for retrieval, automatic low-risk checkpoints, approved durable records, immutable revisions, and write verification.
2. Faculty Workflow Engine using Remember → Frame → Plan → Draft → Review → Revise → Record.
3. Canvas Handoff Engine producing either a complete Bergen Course Transfer Block for `.imscc` generation or the existing assessment-only Bergen Quiz Transfer Block for QTI.

## Professor Commands

- `bergen:init <course>` initializes a course from a syllabus and creates the first temporary checkpoint.
- `bergen:resume <course>` retrieves course-scoped Keep notes and reconstructs the current state.
- `bergen:memory` reports memory titles, classes, conflicts, and the last verified action.
- `bergen:record` proposes and, after approval, writes a durable memory revision.
- `bergen:package course` emits one approved complete-course transfer block.
- `bergen:package assessment` emits the assessment-only QTI transfer block.

The existing course, lesson, assignment, rubric, reinforcement, review, revise, message, and reflection workflows continue. Natural-language requests retain parity with commands.

## Memory Model

Use one atomic note per memory revision. Titles follow:

```text
BMB | <COURSE> | <TYPE> | <RECORD-SLUG> | R<NNN> | <DATE>
```

Bodies identify schema, course, stable record ID, revision, memory class, status, superseded title, approval source, timestamp, and content. New notes supersede old notes instead of silently overwriting them. Retrieval groups notes by record ID, validates revision links, chooses the newest verified chain, and surfaces ambiguity.

Low-risk automatic writes are limited to workflow stage, next step, temporary ideas, open questions, missing course information, and de-identified Active Workbench summaries. Faculty Profile, course outcomes and policies, durable decisions, reusable practices, promoted reflections, replacements, and archives require explicit approval.

Every write follows retrieve → classify → approve if durable → create → retrieve exact title → compare intended content → report. A write is successful only after verification. Failure offers retry or in-chat continuation without persistence; it never sends the professor to Keep for manual repair.

## Course Transfer Model

After syllabus ingestion, staged design, accessibility/alignment review, and whole-course approval, the Gem emits a versioned JSON Bergen Course Transfer Block. The block contains course metadata, modules, ordered items, pages, assignments, discussions, rubrics, quizzes, exams, and explicit completion rules.

The separate browser-only Bergen Course Packager validates the block and generates one Common Cartridge (`.imscc`) with unpublished defaults. It performs all content processing locally, sends no course content to Apps Script or another server, and reports precise validation failures rather than creating a partial package. The existing QTI Packager remains the assessment-only path.

## Safety and Capability Decisions

- Protected or identifiable student information short-circuits before Keep retrieval, Keep writing, transfer generation, or packaging.
- Canvas remains the only system for student submissions, grades, individual feedback, accommodations, and identifying records.
- V2 may claim a Google Keep write only after observing the connected action and retrieving the exact note for content verification.
- The Gem and packager never claim that Canvas content was created, imported, compatible, or published before the faculty completes the corresponding sandbox or publication action.
- The sole routine work outside Gemini is the final browser packaging and manual unpublished Canvas import/review.

## Verification Design

Scenario tests cover commands, natural-language parity, automatic and approved writes, resume behavior, conflicts, failures, and privacy stops. Contract tests cover note schemas, course isolation, immutable revision chains, and latest-valid selection. Course-packager tests cover transfer validation, manifest structure, content linkage, embedded QTI, escaping, deterministic ZIP output, unpublished defaults, and browser-only processing. Final acceptance uses synthetic course material in an authorized Bergen Gem/Keep session and unpublished Canvas sandbox.

## Approved Trade-offs

Google Keep is accepted as an active memory layer despite weaker database semantics because it provides verified no-code read/write access inside Gemini. Immutable revisions and explicit verification mitigate destructive updates and false persistence. Google Docs remain available for curated archival, but faculty daily workflows do not depend on manually updating them. A Google Sheet index or Apps Script memory service remains a future fallback if live Keep retrieval cannot reliably reconstruct a course.
