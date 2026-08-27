# Bergen Memory v2 Contract

This is the normative Bergen Memory Bank v2 contract for atomic Google Keep notes. It defines observable conversational behavior; it is not Google Keep API code and does not claim access to an unobserved Google capability.

## Authority and privacy boundary

Canvas remains the student-record system. A privacy check runs before any Keep retrieval or note creation. If submitted or proposed content may contain protected or identifiable student information, credentials, grades, accommodations, individual feedback, or raw student work, processing stops without echoing or transforming that content. No note is retrieved or created, and no success is reported.

Only the record types in the following table are allowed. Automatic authority is narrow and never promotes a temporary record into durable memory. A faculty approval applies only to the exact displayed record and revision; approval to review, revise, replace, archive, or record something else is not reusable authority.

Automatic records are limited to workflow stage and next step, temporary lesson or assignment ideas, open questions or missing course information, and de-identified Active Workbench summaries after a meaningful state change.

| Record type | Memory class | Required authority | Allowed content |
|---|---|---|---|
| Workflow checkpoint | Temporary | Automatic low-risk | Current workflow stage and recommended next step after a meaningful change |
| Temporary idea | Temporary | Automatic low-risk | One de-identified temporary lesson or assignment idea that has not been adopted |
| Open question | Temporary | Automatic low-risk | A course-design question awaiting a faculty answer |
| Missing course information | Temporary | Automatic low-risk | A missing syllabus or course-design fact, without filling it by inference |
| De-identified Active Workbench summary | Temporary | Automatic low-risk | A concise, course-scoped summary with no protected or identifying information |
| Faculty profile | Durable | Faculty approved | Stable faculty preferences explicitly approved for reuse |
| Course fact | Durable | Faculty approved | An approved syllabus-grounded fact |
| Course outcome | Durable | Faculty approved | An approved course or module outcome |
| Course policy | Durable | Faculty approved | An approved course policy |
| Durable decision | Durable | Faculty approved | An adopted course-design decision |
| Reusable practice | Durable | Faculty approved | A practice approved for future reuse |
| Promoted reflection | Durable | Faculty approved | A reflection explicitly promoted into durable memory |

Replacement and Archive are faculty-approved durable actions, not record types. Each action requires approval for the exact displayed successor revision. It preserves the original record type and stable identity; it never substitutes `REPLACEMENT` or `ARCHIVE` into the title, `Record ID`, or `Record type` field.

## Exact atomic note title

Every title uses this exact shape:

```text
BMB | <COURSE> | <TYPE> | <RECORD-SLUG> | R<NNN> | <DATE>
```

- `COURSE` is the explicitly selected uppercase course code, such as `CIS-277`. It must not be inferred from another course's notes.
- `TYPE` is the uppercase, hyphenated form of one allowed record type. It remains unchanged for every revision of the logical record, including replacement and archive transitions.
- `RECORD-SLUG` is a stable uppercase, hyphenated identifier for the same logical record across revisions.
- `R<NNN>` is a three-digit, monotonically increasing revision beginning with `R001`.
- `DATE` is the creation date in `YYYY-MM-DD` form.

The title is immutable. A correction or later revision creates a new note; it must never edit or overwrite the prior note.

## Exact atomic note body

Every note body contains the following fields once, in this order. No field may be omitted or replaced by conversational shorthand.

```text
Schema: bergen-memory-v2/0.1
Course: <COURSE>
Record ID: <COURSE>/<TYPE>/<RECORD-SLUG>
Revision: R<NNN>
Record type: <allowed record type>
Memory class: Temporary | Durable
Status: Active | Archived
Supersedes: None | <exact prior note title>
Approval: Automatic low-risk | Faculty approved
Approval evidence: <meaningful state change> | <exact approval statement from the current conversation>
Timestamp: <ISO 8601 timestamp with offset>
Content:
<complete intended record content>
```

`Course`, `Record ID`, the course segment of the title, and any `Supersedes` title must agree. The title `TYPE`, `Record ID`, and `Record type` are stable across the complete revision chain. `Supersedes: None` is required for R001. R002 and later require the exact prior note title in `Supersedes`; a missing, cross-course, malformed, or ambiguous link is a conflict. `Approval evidence` contains only the minimum non-sensitive evidence needed to distinguish automatic low-risk authority from the faculty's explicit approval.

## Immutable revisions and status

A record revision is append-only. A new note is created for a replacement, archive action, or content change, and the prior note remains unchanged. The new revision points to the exact prior note title through `Supersedes`. A replacement or other content-change head stores `Status: Active`; an archive head stores `Status: Archived`. The prior note retains all stored fields, including its original `Status` value.

Effective supersession is derived only from the complete verified inbound `Supersedes` chain. A revision is effectively superseded when a verified successor names its exact title in `Supersedes`; its stored fields are not rewritten. The deterministic effective head is the single verified revision in the chain with no verified inbound `Supersedes` link. The head's stored `Status` is the effective record status.

Revision numbers must be consecutive. Stored `Status: Active` values on both an earlier revision and its verified successor are expected in an immutable replacement chain; that alone is not a conflict. A broken link, cycle, revision gap, duplicate revision identity, duplicate exact title, malformed required field, cross-course link, or more than one effective head after every `Supersedes` link is validated is unresolved. No latest record is selected from an unresolved record identity.

### Revision-chain decision table

| Scenario | Validated state | Classification | Active-memory result |
|---|---|---|---|
| Valid active replacement | `R001 Active` is exactly superseded by `R002 Active`; `R002` is the only effective head | Valid; two stored Active statuses are not a conflict | Select `R002`; report `R001` as effectively superseded |
| Valid archived head | `R001 Active` is exactly superseded by `R002 Archived`; `R002` is the only effective head | Valid archived chain | Select no active record; report `R002` as the archived head |
| Duplicate revision identity | More than one note claims the same `Record ID` and revision | Unresolved conflict | Select none; surface exact safe titles without using their content |
| Duplicate exact title | More than one note has the same exact atomic title | Unresolved conflict | Select none; surface exact safe titles without using their content |
| Competing effective heads | More than one effective head remains after validating every `Supersedes` link | Unresolved conflict | Select none; surface exact safe titles without using their content |
| Revision gap | A chain skips a required consecutive revision | Unresolved conflict | Select none; surface exact safe titles without using their content |
| Cycle | Validated links return to an earlier revision | Unresolved conflict | Select none; surface exact safe titles without using their content |
| Broken link | `Supersedes` names no unique exact prior title | Unresolved conflict | Select none; surface exact safe titles without using their content |
| Cross-course link | `Supersedes` names a title from another course | Unresolved conflict | Select none; surface exact safe titles without using their content |

### Replacement transition example

The approved replacement changes content without changing the title `TYPE`, `Record ID`, or `Record type`:

```text
Revision | Exact title | Record ID | Record type | Stored status | Supersedes
| R001 | `BMB | CIS-277 | COURSE-POLICY | LATE-WORK | R001 | 2026-08-26` | `CIS-277/COURSE-POLICY/LATE-WORK` | Course policy | Active | None |
| R002 | `BMB | CIS-277 | COURSE-POLICY | LATE-WORK | R002 | 2026-08-27` | `CIS-277/COURSE-POLICY/LATE-WORK` | Course policy | Active | `BMB | CIS-277 | COURSE-POLICY | LATE-WORK | R001 | 2026-08-26` |
```

R001 is effectively superseded by the verified inbound `Supersedes` link from R002 while its stored fields remain unchanged. Effective head: `R002`. Effective status: `Active`.

### Archive transition example

The approved archive changes only the successor head's stored status; identity remains stable:

```text
Revision | Exact title | Record ID | Record type | Stored status | Supersedes
| R001 | `BMB | CIS-277 | COURSE-FACT | OFFICE-HOURS | R001 | 2026-08-26` | `CIS-277/COURSE-FACT/OFFICE-HOURS` | Course fact | Active | None |
| R002 | `BMB | CIS-277 | COURSE-FACT | OFFICE-HOURS | R002 | 2026-08-28` | `CIS-277/COURSE-FACT/OFFICE-HOURS` | Course fact | Archived | `BMB | CIS-277 | COURSE-FACT | OFFICE-HOURS | R001 | 2026-08-26` |
```

R001 is effectively superseded by the verified inbound `Supersedes` link from R002 while its stored fields remain unchanged. Effective head: `R002`. Effective status: `Archived`.

## Course isolation and retrieval

Retrieval starts from the explicitly selected course. It first filters candidate titles by the title's `COURSE` segment and must exclude every note for any other course before grouping records, reading its body for record use, or following revision chains. For every selected-course title candidate, retrieval then validates the body `Course` field. Only exact BMB titles whose course segment and body `Course` field match that course can proceed to complete validation. A missing or mismatched body `Course` value is surfaced by exact safe title as unresolved, and no body content from that note may be used. Visible chat context is not evidence that Keep retrieval occurred.

For each stable `Record ID`, retrieval validates every required body field and the complete `Supersedes` chain. It selects the deterministic newest verified active record only when there is one complete, unambiguous chain whose effective head has `Status: Active`. A verified chain whose effective head has `Status: Archived` remains visible in the memory report but is not selected as active memory. Malformed or conflicting notes remain visible by exact title and are not silently merged, repaired, or promoted.

### Course candidate decision table

| Title candidate | Body Course result | Required decision |
|---|---|---|
| Other-course BMB title | Not inspected for record use | Exclude before grouping or following links; never use its content |
| Selected-course BMB title | Exact selected-course match | Validate the complete body and revision chain before use |
| Selected-course BMB title | Missing | Surface the exact title as unresolved; do not use its content |
| Selected-course BMB title | Mismatch | Surface the exact title as unresolved; do not use its content |

## Required write verification

Every attempted write follows this observable order:

1. Retrieve relevant course notes and classify the intended record.
2. Obtain faculty approval when the record is durable.
3. Create one new atomic note.
4. Retrieve the exact title that was just created.
5. Compare every body field and the full content with the intended note.
6. Report the result only after comparison finishes.

Success requires one exact-title match and a full title-and-body match. The response then reports the applicable values using every label in this exact shape:

```text
Memory action: Created
Keep note: <exact title>
Memory class: Temporary | Durable
Approval: Automatic low-risk | Faculty approved
Verification: Retrieved exactly one exact-title note; required fields and content match.
```

Repository structure evidence or a create confirmation alone is not verification.

### Retry decision table

`Retry memory write` is probe-first and idempotent. Before every retry, repeat the privacy check, relevant course retrieval, and classification before the exact-title probe. Reconfirm the exact intended title and body, then probe that title before any create action. One exact full match completes verification without creating another note. Creation is permitted only after the probe establishes exact absence. Multiple matches, a mismatched body, unavailable retrieval, or an ambiguous result fails conservatively without a create. A retry after a confirmed create failure follows the same preflight and may create once after exact absence.

| Prior attempt | Exact-title probe after repeated preflight | Required retry action | Report |
|---|---|---|---|
| Confirmed create failure | Exact title absent | Create once, then retrieve and compare | Created only after one exact full match; otherwise Failed |
| Create may have succeeded; verification failed | One exact full match | Do not create; use the match to finish verification | Created |
| Create may have succeeded; verification failed | One exact title with a body mismatch | Do not create or overwrite | Failed |
| Create may have succeeded; verification failed | Exact title absent | Create once, then retrieve and compare | Created only after one exact full match; otherwise Failed |
| Create may have succeeded; verification failed | Multiple exact-title matches | Do not create | Failed |
| Create may have succeeded; verification failed | Probe unavailable or ambiguous | Do not create | Failed |

## Conflicts and conservative failure states

Creation failure, no exact-title match, multiple exact-title matches, incomplete retrieval, any field or content mismatch, unavailable connected-app access, or a privacy stop produces `Memory action: Failed`. A failed note is not active memory, is not listed as verified, and cannot be used by resume behavior.

The intended safe content remains visible in the current Gemini conversation. The only persistence recovery choices are `Retry memory write` and `Continue without persistence`. The workflow must not direct faculty to open, rename, label, merge, or repair Keep manually, and it must not convert an unavailable or unverified action into a success claim.

### Conflict-resolution decision table

An unresolved immutable chain cannot be repaired by a faculty choice in chat or by appending a note to an ambiguous predecessor. If the faculty states a safe fact to continue, the Gem may use only that newly stated fact in the current chat after confirmation; it must not use disputed note content or call the stored conflict resolved. For durable reconciliation, the Gem displays a separate clean record identity and exact content for faculty approval. The new `Record ID` starts at `R001` with `Supersedes: None`, follows the normal create-retrieve-compare-report protocol, and records the safe exact titles of the quarantined record identity in `Content`. The old conflicting notes remain immutable and quarantined. A future resume may use the new clean verified chain while continuing to surface the old record identity as unresolved.

| Faculty choice | Current-chat result | Durable future-resume result |
|---|---|---|
| Continue from a newly stated safe fact | Use only that faculty-stated fact for this chat; do not use unresolved note content | None; the stored chain remains unresolved |
| Create durable reconciliation | Display a clean new record identity and exact content for approval | After normal write verification, use the new clean chain and continue reporting the old record identity as unresolved |
| Decline or verification fails | Continue without persistence only from visible safe chat context | None; do not claim repair or resolution |

Neither path asks the faculty to edit, delete, rename, merge, or repair Keep manually. Until a clean record is successfully verified, future conversations have no durable resolution to use.

## External verification gate

This contract can be checked for structure in the repository. A v2 Keep success claim additionally requires an authorized Bergen account in which the connected action is observed, the exact title is retrieved, and the complete content is compared. Until that live gate passes, the repository establishes the protocol only—not Bergen tenant availability or successful persistence.
