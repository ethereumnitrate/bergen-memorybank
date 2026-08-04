# Bergen Memory Bank Faculty Quick Start

Bergen Memory Bank helps you keep course context organized, draft aligned materials, review before changing them, and prepare copy-ready handoffs. You remain the decision-maker. Canvas remains the student-record system and final publishing destination.

## Start a safe conversation

- Open the classic custom Gem named **Bergen Memory Bank** while signed in with your `bergen.edu` account.
- Start a new chat by explicitly selecting one course: `bergen:course COM-101: Public Speaking Fundamentals`.
- Use only teaching context and synthetic or de-identified class-level observations. Never paste student records.
- Ask with an alias or ordinary language. Aliases are optional text conventions. A natural-language request uses the same workflow and safeguards.

For example, `bergen:lesson Draft a short lesson for the selected course` and “Help me draft a short lesson for the selected course” use the same Lesson workflow.

## Read the response before continuing

Every recognized response makes these items visible:

```text
Course: <selected course or Not required for this request>
Context used: <documents actually used or None>
Faculty-supplied facts: <minimum facts used or None yet>
Missing or conflicting context: <specific gap or None>
```

The Gem asks at most one blocking question. It also shows `Current stage:` and `Recommended next command:` at the end. Check that the named course and context are correct before acting on the draft.

## Use the approval gates

Review does not revise. Give explicit approval before revision, recording, or publishing guidance. Approve each action separately: approval to revise is not approval to record, and approval to record is not approval to publish. You manually paste approved memory text into one named Google Doc and manually transfer approved publishing content into Canvas.

## Watch long-chat context conservatively

If asked, Bergen Memory Bank may offer a **low-confidence conservative visible-chat estimate**. It uses **32,000 tokens only as an unverified Education Fundamentals working denominator**. This is not actual remaining capacity. The estimate covers only defensibly measured visible chat and excludes hidden instructions, system instructions, Gem instructions, retrieved knowledge, and actual model capacity. It uses rounded bands, never false precision.

- Below approximately 50% may continue if the course and decisions remain clear.
- Approximately 50–70% means record soon by using `bergen:record` for any approved durable decision.
- Above approximately 70% means record approved durable decisions and begin a new chat.
- Restart earlier if courses mix or decisions are lost.
- Hallucinations are possible at any percentage; always review generated material.

## Finish with manual control

Use `bergen:review` before approving changes. Use `bergen:revise` only with a specific approved change list. Use `bergen:record` to propose one copy-ready memory update, approve it separately, and paste it manually. For Canvas, review the Canvas Publishing Packet, approve the handoff, and transfer it yourself.

## Source note

Policy and platform boundaries were reviewed on 2026-08-04 against Bergen's [AI Acceptable Use Policy](https://bergen.edu/wp-content/uploads/Artificial-Intelligence-AI-Acceptable-Use-Policy.pdf), [Google Drive and Docs Usage Guidelines](https://bergen.edu/wp-content/uploads/IT-001-001.2019-BCC-Google-Drive-Docs-Usage-Guidelines-and-Support-Agreement.pdf), and [Canvas LMS page](https://bergen.edu/faculty-staff/citl/instructional-technology/lms/). The 32,000-token denominator is an explicitly unverified working assumption, not a sourced statement about actual Gemini capacity.
