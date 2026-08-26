# Bergen Memory v2 Contract

This is the normative Bergen Memory Bank v2 contract for atomic Google Keep notes. It defines observable conversational behavior; it is not Google Keep API code and does not claim access to an unobserved Google capability.

## Authority and privacy boundary

Canvas remains the student-record system. A privacy check runs before any Keep retrieval or note creation. If submitted or proposed content may contain protected or identifiable student information, credentials, grades, accommodations, individual feedback, or raw student work, processing stops without echoing or transforming that content. No note is retrieved or created, and no success is reported.

Only the record types in the following table are allowed. Automatic authority is narrow and never promotes a temporary record into durable memory. A faculty approval applies only to the exact displayed record and revision; approval to review, revise, replace, archive, or record something else is not reusable authority.

| Record type | Memory class | Required authority | Allowed content |
|---|---|---|---|
| Workflow checkpoint | Temporary | Automatic low-risk | Current workflow stage and recommended next step after a meaningful change |
| Temporary idea | Temporary | Automatic low-risk | A de-identified course-development idea that has not been adopted |
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

Revision numbers must be consecutive. A gap, cycle, duplicate revision, duplicate active head, broken link, competing title for one revision, or link to another course is unresolved. No latest record is selected until the minimum faculty decision resolves the conflict.

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

Retrieval starts from the explicitly selected course. It accepts only exact BMB titles whose `COURSE` segment and body `Course` field match that course, and it must exclude every note for any other course before grouping records or following revision chains. Visible chat context is not evidence that Keep retrieval occurred.

For each stable `Record ID`, retrieval validates every required body field and the complete `Supersedes` chain. It may select the deterministic effective head and its `Active` or `Archived` status only when there is one complete, unambiguous chain. Malformed or conflicting notes remain visible by exact title and are not silently merged, repaired, or promoted.

## Required write verification

Every attempted write follows this observable order:

1. Retrieve relevant course notes and classify the intended record.
2. Obtain faculty approval when the record is durable.
3. Create one new atomic note.
4. Retrieve the exact title that was just created.
5. Compare every body field and the full content with the intended note.
6. Report the result only after comparison finishes.

Success requires one exact-title match and a full title-and-body match. The response then reports `Memory action: Created`, `Keep note: <exact title>`, the memory class, the authority, and a successful `Verification:` result. Repository structure evidence or a create confirmation alone is not verification.

## Conflicts and conservative failure states

Creation failure, no exact-title match, multiple exact-title matches, incomplete retrieval, any field or content mismatch, unavailable connected-app access, or a privacy stop produces `Memory action: Failed`. A failed note is not active memory, is not listed as verified, and cannot be used by resume behavior.

The intended safe content remains visible in the current Gemini conversation. The only persistence recovery choices are `Retry memory write` and `Continue without persistence`. The workflow must not direct faculty to open, rename, label, merge, or repair Keep manually, and it must not convert an unavailable or unverified action into a success claim.

## External verification gate

This contract can be checked for structure in the repository. A v2 Keep success claim additionally requires an authorized Bergen account in which the connected action is observed, the exact title is retrieved, and the complete content is compared. Until that live gate passes, the repository establishes the protocol only—not Bergen tenant availability or successful persistence.
