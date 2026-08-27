# Bergen Memory Bank Faculty Quick Start

Bergen Memory Bank helps you resume safe course work, draft aligned materials, review before changing them, and prepare faculty-controlled Canvas handoffs. Canvas remains the student-record system and final publishing destination.

## Start or resume one course

- Open the classic custom Gem named **Bergen Memory Bank** while signed in with your `bergen.edu` account.
- To start from a safe syllabus, enter `bergen:init CIS-277`. To continue in a new conversation, enter `bergen:resume CIS-277`.
- Use only teaching context and synthetic or de-identified class-level observations. Never paste student records.
- Ask with an alias or ordinary language. Aliases are optional text conventions. A natural-language request uses the same workflow and safeguards.

For example, `bergen:lesson Draft a short lesson for the selected course` and “Help me draft a short lesson for the selected course” use the same Lesson workflow.

## Read the response before continuing

Every recognized response makes these items visible:

```text
Course: <selected course or Not required for this request>
Context used: <exact Keep note titles or other context actually used, or None>
Faculty-supplied facts: <minimum facts used or None yet>
Missing or conflicting context: <specific gap or None>
```

The Gem asks at most one blocking question. It also shows `Current stage:` and `Recommended next command:` at the end. Check that the named course and evidence are correct before acting on a draft.

## Recognize automatic and approved memory

Only a meaningful temporary Active Workbench checkpoint can save automatically. Durable faculty, course, policy, decision, practice, reflection, replacement, and archive memory requires your approval for the exact displayed record and revision.

A successful write is not reported until the new note is retrieved by exact title and its complete content is compared. The same response shows:

```text
Memory action: Created
Keep note: <exact title>
Memory class: Temporary or Durable
Approval: Automatic low-risk or Faculty approved
Verification: <retrieval and comparison result>
```

If the action cannot be verified, choose `Retry memory write` or `Continue without persistence`. Keep working from the visible conversation; recovery stays inside Gemini.

## Use the approval gates

Review does not revise. Give explicit approval before revision, durable recording, or packaging guidance. Approve each action separately: approval to revise is not approval to record, and approval to record is not approval to prepare a Canvas handoff. Google Docs remain an optional curated archive, not the daily memory step.

## Watch long-chat context conservatively

If asked, Bergen Memory Bank may offer a **low-confidence conservative visible-chat estimate**. It uses **32,000 tokens only as an unverified Education Fundamentals working denominator**. This is not actual remaining capacity. The estimate covers only defensibly measured visible chat and excludes hidden instructions, system instructions, Gem instructions, retrieved knowledge, and actual model capacity. It uses rounded bands, never false precision.

- Below approximately 50% may continue if the course and decisions remain clear.
- Approximately 50–70% means record soon by using `bergen:record` for any approved durable decision.
- Above approximately 70% means record approved durable decisions and begin a new chat.
- Restart earlier if courses mix or decisions are lost.
- Hallucinations are possible at any percentage; always review generated material.

## Finish with manual control

Use `bergen:review` before approving changes. Use `bergen:revise` only with a specific approved change list. Use `bergen:record` for an approved durable Keep revision. Use `bergen:package course` for the whole-course `.imscc` route or `bergen:package assessment` for the assessment-only QTI route. In both cases, review the local package in an authorized unpublished Canvas course and publish only when ready.

## Source note

Policy and platform boundaries were reviewed on 2026-08-26 against the dated official sources recorded for Bergen Memory Bank. The 32,000-token denominator is an explicitly unverified working assumption, not a sourced statement about actual Gemini capacity.
