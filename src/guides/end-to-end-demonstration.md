# Bergen Memory Bank End-to-End Demonstration

This walkthrough uses only synthetic course material. It keeps one course, outcome, introduced-concept set, and rubric criteria aligned from lesson through verified Keep memory, local whole-course packaging, and manual review in an unpublished Canvas sandbox.

## Demonstration contract

- **Course:** COM-101: Public Speaking Fundamentals
- **Outcome:** Construct a clear central claim supported by relevant evidence
- **Concepts already introduced:** central claim, audience, and credible evidence
- **Rubric criteria:** Central claim; Evidence relevance; Audience adaptation; Organization
- **Safety:** No student records, individual results, identifying quotations, or real submissions appear.

## Step 1 — Lesson

**Faculty prompt:** `bergen:lesson For COM-101: Public Speaking Fundamentals, draft a 25-minute lesson aligned to “Construct a clear central claim supported by relevant evidence.” Use only central claim, audience, and credible evidence, which are already introduced.`

**Aligned lesson draft:** Students examine a synthetic topic, choose a clear central claim for a general audience, compare three synthetic evidence notes, and explain which two are credible and relevant. The closing check asks each student to write a claim-and-evidence outline. It introduces no new theory.

**Observable state:** Course is **COM-101: Public Speaking Fundamentals**. The goal, context used, faculty-supplied facts, missing context, current stage, and next command remain visible.

## Step 2 — Assignment

**Faculty prompt:** `bergen:assignment For COM-101: Public Speaking Fundamentals, turn the approved lesson frame into a two-minute speech outline assignment aligned to “Construct a clear central claim supported by relevant evidence.”`

**Assignment draft:** Prepare a two-minute speech outline for a synthetic campus improvement topic. State one central claim, identify the audience, and add two credible evidence points. Explain the relevance of each evidence point in one sentence. Organize the outline as opening, claim, support, and close.

The assignment uses only central claim, audience, and credible evidence. It prepares the same four rubric criteria: **Central claim**, **Evidence relevance**, **Audience adaptation**, and **Organization**.

## Step 3 — Rubric

**Faculty prompt:** `bergen:rubric For COM-101: Public Speaking Fundamentals, draft an outcome-aligned rubric for the synthetic assignment.`

**Rubric draft:**

| Criterion | Meets | Developing | Revise |
|---|---|---|---|
| Central claim | Claim is specific, clear, and appropriate to the topic. | Claim is present but broad or partly unclear. | Claim is missing or cannot guide the speech. |
| Evidence relevance | Two credible evidence points directly support the claim, and relevance is explained. | Evidence is partly relevant, insufficiently explained, or incomplete. | Evidence is absent, not credible, or unrelated to the claim. |
| Audience adaptation | Choices are appropriate for the stated audience. | Audience is named but choices are only partly adapted. | Audience is missing or not reflected in the outline. |
| Organization | Opening, claim, support, and close form a usable sequence. | Sequence is present but one part is unclear. | Major parts are missing or difficult to follow. |

The rubric remains aligned to **Construct a clear central claim supported by relevant evidence** and contains no individual grading information.

## Step 4 — Review

**Faculty prompt:** `bergen:review Review the COM-101: Public Speaking Fundamentals lesson, assignment, and rubric without changing them.`

The review does not revise. It checks alignment, clarity, accessibility, cognitive load, quality, prerequisite creep, and bias. It reports that the lesson, assignment, and rubric share the outcome **Construct a clear central claim supported by relevant evidence** and the introduced concepts **central claim, audience, and credible evidence**. It identifies that the assignment does not offer an accessible submission choice and recommends adding one sentence that permits either text or an accessible document. The artifact remains unchanged at the Review stage.

## Step 5 — Revision approval

**Revision faculty decision:** “I approve this one revision: add a sentence permitting submission as text or as an accessible document. Do not change anything else.”

This is explicit faculty approval before revision. It does not approve recording or publication.

## Step 6 — Revise

**Faculty prompt:** `bergen:revise Apply only the approved accessible-submission clarification to the COM-101: Public Speaking Fundamentals assignment.`

**Approved revision:** Add this sentence: “You may submit the outline as text or as an accessible document.”

The rest of the assignment, the introduced concepts, and the criteria **Central claim**, **Evidence relevance**, **Audience adaptation**, and **Organization** remain unchanged. A second review is recommended.

## Step 7 — Record proposal

**Faculty prompt:** `bergen:record Propose the approved COM-101 assignment decision as a durable memory revision.`

**Record proposal summary:** Target **COM-101: Public Speaking Fundamentals**. Proposed durable decision: retain the aligned speech-outline pattern, four rubric criteria, and accessible submission choice. The Gem displays the exact BMB note title, revision, complete content, and prior title before asking for approval.

**Record-proposal faculty decision:** “I approve this exact durable COM-101 record and revision.”

After this separate approval, Bergen Memory Bank may create the immutable Keep note. It reports success only after exact-title retrieval and full-content comparison:

```text
Memory action: Created
Keep note: <exact BMB title>
Memory class: Durable
Approval: Faculty approved
Verification: Retrieved exactly one exact-title note; required fields and complete content match.
```

If any step fails, the safe proposal remains in the current Gemini conversation, `Memory action: Failed` is shown, and the only choices are `Retry memory write` or `Continue without persistence`. Google Docs remain an optional curated archive, not this daily memory step.

## Step 8 — Whole-course transfer approval

After the synthetic COM-101 course contains reviewed modules, pages, assignments, discussions, rubrics, quizzes, and completion rules, enter `bergen:package course`.

**Publication-handoff faculty decision:** “I approve Bergen Memory Bank to prepare this whole-course handoff. I will review the block before packaging or any Canvas action.”

After that separate approval, Bergen Memory Bank emits exactly one versioned **Bergen Course Transfer Block** from the current approved course. It defaults Canvas-facing content to unpublished and contains no placeholder, credential, student, or hidden-memory data.

## Step 9 — Local Course Packager

Open the Bergen Course Packager page, paste the block into **Bergen Course Transfer Block**, validate it, confirm that it contains no student data, and wait for `Course package ready`. Only then select `Download .imscc`. Validation or generation failure keeps download disabled and cannot expose an older package.

## Step 10 — Unpublished Canvas sandbox

In an authorized unpublished Canvas sandbox, select **Settings → Import Course Content**, choose **Common Cartridge 1.x Package**, select the local `.imscc`, and add the import to the queue. Wait until the import job reports **Completed** before reviewing **Modules**. Compare module and item order, pages, links, assignments, discussions, rubrics, assessments, completion rules, points, accessibility, and unpublished states with the approved course.

Keep the course unpublished. A successful local package is not a successful Canvas import or proof of Bergen compatibility. Publication remains a later faculty decision.

## Optional quiz/QTI branch

If the faculty member later wants only the synthetic quiz or exam, `bergen:package assessment` may prepare an approved text-only Bergen Quiz Transfer Block after review and separate handoff approval. This assessment-only QTI route does not require or create a whole-course `.imscc`. When the institution-provided packager link is unavailable, use manual Canvas entry. Bergen compatibility is not approved. Do not place quiz content in a web address, and do not include student data.

## Source note

The Google Keep, Common Cartridge, Canvas, QTI, privacy, and human-review boundaries were reviewed on 2026-08-26 against the dated official sources recorded for Bergen Memory Bank.
