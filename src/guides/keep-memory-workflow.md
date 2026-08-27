# Bergen Memory Bank Keep Memory Workflow

This no-code guide explains how to start, resume, inspect, and record course memory from your Bergen Memory Bank conversation. You do not need to open Google Keep for routine work or repair notes yourself.

## Privacy comes first

The privacy check happens before Keep retrieval, creation, or any other persistence attempt. Canvas is the student-record system. Keep names, student identifiers, grades, accommodations, individual feedback, raw student work, and identifiable quotations in Canvas.

If protected or identifiable information may be present, Bergen Memory Bank stops without using Keep. It does not echo, summarize, or transform the information. Continue only after supplying a new de-identified class-level summary.

This guide describes only results you can observe in the conversation; it does not invent or claim hidden or unobserved Keep behavior. These instructions do not prove Keep availability. Verify Keep in your authorized Bergen account by observing the connected action, retrieving the exact note, and confirming that its complete content matches.

## Initialize a course with `bergen:init`

Use a named course and a supplied syllabus, for example:

```text
bergen:init CIS-277
```

Bergen Memory Bank confirms the course, reads only the safe syllabus information needed for the task, and shows missing or conflicting facts. Durable syllabus facts remain proposed until you give explicit faculty approval for each record and revision.

After a meaningful change, initialization may create one automatic temporary Active Workbench checkpoint. That checkpoint may contain only the workflow stage and next step, temporary lesson or assignment ideas, open questions or missing facts, and a de-identified summary. It cannot automatically save faculty details, course facts, outcomes, policies, decisions, reusable practices, promoted reflections, replacements, or archives.

The checkpoint is reported as created only after the Gem completes create, retrieve, compare, and report in that order. A verified temporary result looks like this:

```text
Memory action: Created
Keep note: <exact title>
Memory class: Temporary
Approval: Automatic low-risk
Verification: Retrieved exactly one exact-title note; required fields and content match.
```

## Resume one course with `bergen:resume`

Use the course name again in a new conversation:

```text
bergen:resume CIS-277
```

Resume filters titles for the selected course first and excludes other-course titles before grouping or following links. It then checks that each selected-course title has a matching `Course` field in its body. A missing or different body course is shown as unresolved by exact title, and its content is not used. For each clear revision chain, Resume uses only the newest verified active record and lists the exact Keep note titles used. Archived records remain visible but are not restored as active memory.

If a note or link is missing or ambiguous, the Gem shows the safe exact titles involved and pauses work that depends on the disputed context. It never guesses or silently combines records.

## Inspect memory with `bergen:memory`

After selecting a course in the current conversation, enter:

```text
bergen:memory
```

The report uses these labels so you can see the evidence without opening Keep:

```text
Selected course: <course>
Active Keep notes: <exact active note titles used, with Temporary or Durable class>
Memory class: <Temporary, Durable, or Mixed>
Superseded records: <exact titles and their active successors, or None>
Conflicts or missing information: <exact safe evidence or None>
Last verified write: <exact title and verification result observable in this chat, or None observed>
```

A failed write is never listed as active memory. The report does not claim a hidden context meter, complete account coverage, background synchronization, or a retrieval result that was not observed.

## Record durable memory with `bergen:record`

Use `bergen:record` only after the Gem has displayed the complete proposed record, exact title, revision, and prior title. It asks for explicit approval for that exact record and revision. Approval to revise course material, approve a different record, replace a record, or archive a record does not carry over.

After approval, the Gem creates one new immutable note. A new revision leaves the prior note unchanged and places the exact prior note title in `Supersedes`. Replacements keep the stable record identity and remain active; an approved archive creates a new archived revision. Neither action changes an older note.

A verified durable result looks like this:

```text
Memory action: Created
Keep note: <exact title>
Memory class: Durable
Approval: Faculty approved
Verification: Retrieved exactly one exact-title note; required fields and content match.
```

## Resolve a conflict in the conversation

A valid replacement can contain R001 and R002 notes that both still say `Active`: the exact `Supersedes` link makes R002 the one current head. A clear archived head is shown but is not used as active memory. A broken `Supersedes` link, cycle, revision gap, competing heads, duplicate exact title, duplicate revision identity, malformed required field, or cross-course link makes the record unresolved.

| What Gemini finds | What happens now | What can persist for a future conversation |
|---|---|---|
| A clear active replacement chain | Use the newest active note even though the earlier note still says Active | The verified chain already provides one current head |
| A clear archived head | Show it as archived and do not use it as active memory | The verified chain already records the archive |
| Broken link, cycle, gap, competing heads, duplicate exact title, or course mismatch | Do not use the disputed note content; you may approve a newly stated safe fact for this chat only | Only a separately approved and verified clean record; the old conflict remains visible |

A current-chat decision does not fix the stored conflict. For a durable result, Gemini displays a separate clean record and exact content for approval. The new clean record starts at R001 and does not claim to repair the old immutable notes. Only after Gemini creates, retrieves, and compares that record may a future conversation use it; the old conflict is still reported. Conflict handling stays inside Gemini, with no manual Keep repair.

## Retry or continue without persistence

Creation failure, no exact-title result, multiple exact-title results, incomplete retrieval, or any title, field, or content mismatch produces:

```text
Memory action: Failed
Recovery choices:
- Retry memory write
- Continue without persistence
```

The safe proposed content stays visible in the current Gemini conversation but is not treated as saved, verified, or active memory. Before every retry, Gemini repeats the privacy check, retrieves the selected course, confirms the record class and exact intended title, and checks that exact title before creating anything.

| Retry finds | Gemini action |
|---|---|
| One exact note whose full body matches | Verify it and do not create another note |
| No exact note | Create once, then retrieve and compare |
| One exact title with different content | Do not create; report failure |
| Multiple exact titles or Keep is unavailable | Do not create; report failure |

A confirmed creation failure still checks first and may create once only when the exact title is absent. When creation may have succeeded but retrieval or comparison failed, this check prevents a duplicate. `Continue without persistence` keeps working only from the visible conversation.

All recovery stays inside Gemini. You never need to open, rename, label, merge, delete, or otherwise repair a Keep note manually.

## Source note

Connected Google Keep claims were reviewed on 2026-08-26 against the dated official sources recorded for Bergen Memory Bank. This guide remains conditional on an authorized account exposing the connected action and on observing the exact verification sequence.
