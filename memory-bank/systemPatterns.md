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
| Source-Dated Claims | Tie policy and platform assertions to the dated authoritative source register, and re-review them when the source or release date changes. |
| Alignment Without Prerequisite Creep | Lessons, assignments, rubrics, and reinforcement activities align to outcomes and already introduced concepts. Never assume concepts marked as not yet introduced. |
| Accessible and Bias-Aware Outputs | Review materials for clarity, accessibility, cognitive load, quality, prerequisite creep, and bias before approved revision or publication. |

## High-Level Architecture

```text
Faculty lane (no-code)
  Faculty request or bergen:<workflow>
    → command and privacy-boundary check
    → relevant attached memory context
    → Remember → Frame → Plan → Draft → Review
    → faculty approval
    → Revise → proposed Record update
    → faculty copies approved material to Google Docs or Canvas

Developer release-validation lane
  Release contract + source register + synthetic/de-identified fixtures
    → dependency-free Node.js .mjs validation and tests
    → content, inventory, privacy, and claim-boundary evidence
  Four knowledge-document Markdown sources + embedded snapshot partial
    → bundled Python/python-docx authoring
    → packaged title sanitation + privacy scrub
    → global rsid cleanup + deterministic ZIP normalization
    → four Google Docs-ready DOCX files
  Nine faculty guides
    → plain-language installation and daily-use guidance
    → observable response, privacy, alignment, and approval contracts
    → manual Google Docs, Canvas, and optional QTI handoffs

Optional QTI companion (implemented locally; deployment and compatibility remain manual)
  Faculty-approved synthetic or non-student quiz content
    → text-only Bergen Quiz Transfer Block from the Gem
    → static Apps Script page with client-side validation and QTI 1.2 ZIP creation
    → local download; no quiz-content server transfer or browser storage
    → manual Canvas import and compatibility approval
```

The developer lane verifies repository artifacts but is not part of faculty installation or daily use. The optional QTI companion is architecturally separate from the Gem and Google Docs memory workflow. Apps Script serves static HTML only; quiz content stays in browser memory and must never reach a server, student-record store, Canvas API integration, or URL. The companion is not a prerequisite for the core no-code experience.

## Component Responsibilities

- **Classic Gemini Gem**: Routes commands and natural-language requests, enforces behavioral and privacy instructions, guides the staged workflow, and produces copy-ready text.
- **Faculty Profile**: Holds stable, non-student-specific faculty preferences and teaching context.
- **Course Memory**: Holds course-level outcomes, structure, concepts, constraints, and approved course context.
- **Active Workbench**: Holds current, temporary work-in-progress context for the active teaching task.
- **Decisions, Reflections, and Reusable Practices**: Holds approved decisions and reusable faculty practices with enough context to judge future applicability.
- **Class Learning Snapshot**: A reusable Markdown partial embedded exactly once in Active Workbench; it holds only de-identified, class-level observations needed to design reinforcement and does not produce a fifth knowledge document.
- **Document Builder**: Generates four Google Docs-ready DOCX files from the primary Markdown sources with bundled `python-docx`, packaged title sanitation and privacy scrubbing, global OOXML `rsid` cleanup, and deterministic ZIP ordering and timestamps.
- **Faculty Guides**: Provide nine aligned, plain-language entry points for exact installation, commands and natural-language requests, daily use, privacy recovery, demonstration and presentation, troubleshooting, and manual Google Docs, Canvas, and optional QTI handoffs.
- **Canvas**: Holds protected student records and receives final faculty-approved publishing actions.
- **Release Contract**: Defines the v1.0 scope, safeguard boundary, exact artifact inventory, phase ownership, and Ready/Pending state in `src/release/release-contract.md`.
- **Authoritative Source Register**: Holds dated official-source pointers and narrow claim mappings in `src/sources/authoritative-source-register.md`; Memory Bank documents reference this register rather than duplicate its source details.
- **Scenario Matrix and Fixtures**: Define observable Gem, template, faculty-guide, packager, and manual compatibility contracts while supplying synthetic or de-identified workflow and quiz inputs.
- **Validation Harness and Tests**: Use dependency-free Node.js `.mjs` files to check release structure, inventory state, source discipline, fixture safety, Gem workflows, template ownership, generated OOXML, faculty-guide alignment, QTI XML/ZIP structure, Apps Script privacy boundaries, and desktop/mobile presentation journeys.
- **QTI Packager**: Optional static Apps Script companion that validates an approved text-only transfer block and creates a local QTI 1.2 ZIP in the browser. It has no quiz-content server call, database, account, telemetry, Canvas connection, or automatic publication authority.

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
- The implemented model combines shared Faculty Profile and Decisions, Reflections, and Reusable Practices documents with a course-specific Course Memory and Active Workbench pair. The replaceable Class Learning Snapshot source is embedded exactly once inside Active Workbench rather than built as a fifth knowledge document.

## Ordered Safety Kernel and Workflow Engine Pattern

The classic Gem applies its behavioral layers in a fixed order: privacy and capability checks precede routing; routing precedes course and context selection; context selection precedes the seven-stage workflow engine; and workflow-specific output remains bounded by the response contract. Protected-data detection short-circuits the sequence before substantive processing.

This ordering keeps aliases from acquiring authority, prevents retrieval or drafting from bypassing the Canvas student-record boundary, and makes course selection, stage state, approval state, and safe next steps observable. The source contract lives in `src/gem/bergen-memory-bank-instructions.md`, with scenario-based checks in `tests/content/gem-workflows.test.mjs` and `tests/fixtures/workflow-scenarios.json`.

## Text-Only Quiz Handoff Pattern

- The Gem may emit a Bergen Quiz Transfer Block only for an approved, reviewed, synthetic or non-student quiz with complete supported item and scoring information.
- The block is structured text, not a QTI file or ZIP, and creating it does not claim validation, packaging, import, or compatibility.
- The separate browser tool owns transfer-block validation and local packaging; the faculty member owns the manual unpublished-course import, review, and publication decision.
- Unsupported or incomplete items fall back to copy-ready Canvas quiz content so the core Assignment workflow does not depend on the optional packager.

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
- The release contract is the complete artifact inventory. `Ready` means present and locally verified; `Pending` is reserved for evidence requiring an authorized manual action. Validation checks artifact state without turning structural evidence into a compatibility claim.
- Detailed policy and platform citations live in the authoritative source register. Other Memory Bank and release documents point to that register and summarize only the boundary they need.
- Google Docs deliverables retain Markdown as their source of truth. The Class Learning Snapshot partial is expanded into Active Workbench during authoring, and only the four primary knowledge-document sources produce standalone DOCX files.
- The nine faculty guides are a coordinated content layer rather than independent advice: installation uses the exact eight-step setup, daily-use material shares the same twelve optional aliases and natural-language parity, and every consequential handoff preserves observable context, separate approvals, and manual faculty control.
- Faculty examples and demonstrations stay synthetic and preserve one outcome, introduced-concept set, and criteria chain across lesson, assignment, rubric, review, approved revision, record proposal, and publication handoff. QTI guidance describes only a conditional handoff and manual fallback; it never represents local packaging as Bergen Canvas compatibility.

## Bergen Memory v2 Phase 1 Contract Patterns

These patterns are normative Phase 1 contracts and test evidence, not live connected integrations. Google Keep is the approved v2 active-memory target only when a later observable connected action can satisfy the verification boundary below; Google Docs remain the curated archive.

### Atomic Immutable Memory Record Pattern

- Every record is one atomic Keep note with an exact title, ordered body fields, stable `Record ID`, memory class, authority evidence, timestamp, and complete intended content.
- Low-risk temporary checkpoints may be automatic. Durable records and every replacement or archive successor require faculty approval for the exact displayed revision.
- Revisions are append-only: replacement, archive, or content change creates the next note, retains stable record identity and record type, and points to the exact prior title through `Supersedes`. Prior notes are never edited.
- Retrieval is isolated to the explicitly selected course. Gaps, cycles, broken links, duplicate heads, or ambiguous exact-title results remain unresolved until the minimum faculty decision resolves them.
- The privacy stop runs before retrieval or creation. Protected or identifiable student information, credentials, grades, accommodations, individual feedback, and raw student work never enter the memory flow.
- Phase 1 evidence is `src/contracts/bergen-memory-v2.md` plus its structural test; no Keep retrieval, write, chain-selection, or connected-app client is implemented yet.

### Verified Write Boundary

Every later Keep write must be observable as `create → retrieve the exact title → compare every body field and the full intended content → report`. Success requires one exact-title result and a complete match. Unavailable access, creation failure, missing or duplicate retrieval, incomplete retrieval, or any mismatch is reported as failed and cannot become active memory. Repository structure and a platform-generated confirmation do not satisfy this external evidence gate.

### Versioned Whole-Course Transfer Boundary

- `src/contracts/bergen-course-transfer-v0.1.json` defines a strict, versioned input contract for approved course-design content, with a complete synthetic/de-identified fixture at `tests/fixtures/sample-course-transfer.json`.
- Course, module, page, assignment, discussion, rubric, quiz, and exam objects default to unpublished; submissions, grades, individual feedback, accommodations, identifying records, credentials, and raw student work remain excluded.
- The schema and fixture establish local structure only. Phase 1 includes no executable validator, browser packager, generated Common Cartridge or `.imscc` file, Canvas API access, import automation, compatibility evidence, or publication authority.
- Later compatibility requires an authorized import into an unpublished Bergen Canvas sandbox followed by faculty review; publication remains a separate faculty decision.

These patterns reinforce the existing Privacy by Design, Canvas Is the Student-Record System, Human Approval at Consequential Steps, Transparent Capability Boundaries, Minimum Necessary Context, and Source-Dated Claims principles. They do not require a new or contradictory guiding principle.

## Release Validation Pattern

The v2 Phase 1 foundation extends the dependency-free validation lane with atomic-memory, whole-course transfer, dated-source, and release-delta checks. The aggregate command reports 69/69 passing checks, but this evidence is limited to repository contracts, fixtures, and existing local implementation behavior; it does not establish live Keep access, successful persistence, Common Cartridge generation, Canvas compatibility, or publication.

- Repository validation uses Node.js ECMAScript modules (`.mjs`) and built-in modules only. `package.json` intentionally has no `dependencies` or `devDependencies`.
- `scripts/validate-release.mjs` provides build and lint modes and composes them with the focused tests in aggregate mode.
- `tests/content/release-structure.test.mjs` maps the release contract, version stamp, package scripts, artifact existence, and fixture safety rules to executable checks.
- `tests/content/source-register.test.mjs` maps the authoritative source register to dated-source completeness and bounded policy, Gemini, Canvas, QTI, and Apps Script claims.
- `tests/content/gem-workflows.test.mjs` maps the complete Gem instruction source and its 18 synthetic scenarios to routing, context, stage, approval, privacy, prerequisite, handoff, and capability-boundary checks.
- `tests/content/template-contracts.test.mjs` maps the five template sources and four generated DOCX files to the ownership, snapshot, privacy, explicit-selection, prerequisite, manual-record, and OOXML contracts.
- `tests/content/guide-alignment.test.mjs` maps all nine faculty guides to nontechnical language, exact installation, routing parity, observable response fields, privacy recovery, context estimates, presentation timing, synthetic alignment, approval ordering, manual handoffs, and the optional-QTI boundary.
- The three QTI suites map the production Apps Script bundle, QTI core, generated artifacts, and self-contained page to twelve browser-only privacy, validation, XML, ZIP, accessibility, and desktop/mobile journey checks.
- `scripts/build-google-docs.mjs` is a separately invocable deterministic authoring step. It resolves bundled tooling through explicit environment variables or compatible cache discovery, then sanitizes, privacy-scrubs, and normalizes each generated DOCX.
- The human-readable `src/testing/scenario-matrix.md` records verified Gem, template, guide, and packager behaviors and keeps the authorized manual Canvas compatibility gate distinct.
- Automated Phase 3 release evidence includes title-sanitizer, accessibility, OOXML, `google_docs_default`, privacy, and deterministic-package checks for all four DOCX files. Render/PNG visual QA remains `DONE_WITH_CONCERNS` when LibreOffice/`soffice` is unavailable and must not be represented as a visual pass.

### Fixture Rules

- Fixtures must declare the `synthetic/de-identified` data classification and state that they contain no real student data.
- Fixtures must not contain names, email addresses, student IDs, individual grades, accommodations, disability or health information, disciplinary records, credentials, identifying filenames, or raw student work.
- Workflow scenarios are Phase 2 content-contract evidence. The sample quiz remains a seed for later packaging tests, and its metadata must not imply that the QTI application or Canvas compatibility is complete.

## Testing Patterns

### Organization

- Keep source-to-test ownership explicit: the release contract and fixtures map to the release-structure suite, dated claims map to the source-register suite, Gem behavior maps to the Gem-workflow suite, template sources plus generated DOCX files map to the template-contract suite, and faculty guides map to the guide-alignment suite.
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

C4 architecture documentation has not been generated. The implemented topology is documented above; no C4 manifest exists.

<!-- AUTO-MANAGED: c4-architecture-end -->

## Recent Architecture Changes

### 2026-08-26 - Established v2 atomic-memory and whole-course transfer contracts

- **What Changed**: Added the immutable atomic note and verified-write boundaries for the future Keep memory layer, plus a strict versioned whole-course transfer schema with unpublished defaults and explicit external acceptance gates.
- **Reason**: Make privacy, authority, record identity, failure, and Canvas handoff constraints testable before any connected action or browser packager is implemented.
- **Trade-offs**: The repository can now validate stable contracts and synthetic reference integrity, but it intentionally cannot claim live Keep persistence, Common Cartridge output, Canvas compatibility, or a new faculty-facing workflow.
- **Affected Components**: V2 contracts, synthetic fixture, source register, release metadata, aggregate validation, and future Keep and course-packaging phases.

### 2026-08-04 - Implemented static-service, client-only QTI packaging

- **What Changed**: Added the Apps Script static page shell, browser-only QTI core, privacy-gated UI, deterministic local ZIP generation, self-contained demo, synthetic fallback ZIP, and twelve focused tests.
- **Reason**: Preserve the approved optional quiz-transfer journey while preventing quiz content from crossing a server boundary or granting automated Canvas authority.
- **Trade-offs**: The static Apps Script host still requires an authorized Bergen deployment and access review. Local structure and browser checks cannot replace the unpublished-course Canvas compatibility gate.
- **Affected Components**: QTI Packager, demo artifacts, synthetic quiz fixture, release inventory, scenario matrix, faculty QTI guidance, and aggregate validation.

### 2026-08-04 - Added the aligned faculty-guide layer

- **What Changed**: Added nine coordinated faculty guides and a focused alignment suite covering exact installation, workflow language, privacy recovery, observable response contracts, approval ordering, synthetic end-to-end alignment, and manual Google Docs, Canvas, and optional future QTI handoffs.
- **Reason**: Give faculty multiple task-specific entry points without allowing setup, demonstrations, prompts, or troubleshooting to drift from the Gem, template, privacy, and capability contracts.
- **Trade-offs**: Static alignment checks make the content contract deterministic but cannot validate a live Gem, Google Docs session, Canvas tenant, or future packager. Manual action and authorized compatibility review remain explicit boundaries.
- **Affected Components**: Faculty guides, release contract, scenario matrix, package and aggregate validation, and the future QTI handoff boundary.

### 2026-08-04 - Implemented the four-document source-to-DOCX pipeline

- **What Changed**: Added the four primary knowledge-document sources, the embedded Class Learning Snapshot partial, four generated Google Docs-ready DOCX files, and a deterministic authoring pipeline with executable source, ownership, privacy, and OOXML contracts.
- **Reason**: Make the hybrid shared/course-specific memory architecture usable by faculty while preserving one primary home per fact and preventing the snapshot from becoming a fifth document.
- **Trade-offs**: Bundled Python and document helpers are contributor build-time requirements, and deterministic package checks do not replace visual inspection in Google Docs. The faculty workflow remains no-code and manual.
- **Affected Components**: Faculty Profile, Course Memory, Active Workbench, Decisions, Reflections, and Reusable Practices, Class Learning Snapshot, document builder, release contract, scenario matrix, and content-validation suites.

### 2026-08-04 - Implemented the ordered Gem safety kernel and workflow engine

- **What Changed**: Added the complete classic Gem instruction component with an always-on privacy and capability kernel, case-insensitive and natural-language routing, explicit course and context selection, the seven-stage workflow engine, independent approval gates, protected-data recovery, prerequisite safeguards, and manual Google Docs, Canvas, and text-only quiz handoffs.
- **Reason**: Turn the planned no-code safety and workflow boundaries into one inspectable instruction contract with scenario-based verification.
- **Trade-offs**: Static content-contract tests cannot execute live Gemini behavior, but they make the intended observable contract deterministic without adding a faculty runtime, API, or third-party dependency.
- **Affected Components**: Classic Gemini Gem, scenario matrix and fixtures, validation harness and tests, and the future QTI Packager boundary.

### 2026-08-04 - Added the release-contract validation lane

- **What Changed**: Added a developer-only release contract, dated source register, artifact-state inventory, synthetic fixtures, and dependency-free Node.js content-validation harness alongside the no-code faculty workflow.
- **Reason**: Make privacy, capability, provenance, and release-state boundaries executable before later deliverables are built.
- **Trade-offs**: The repository now contains a small software-validation component, but keeping it isolated prevents Node.js and developer commands from becoming faculty prerequisites.
- **Affected Components**: Release foundation, source register, scenario matrix, fixtures, validation harness, and content tests. The planned QTI Packager remains pending Phase 5.

### 2026-08-04 - Greenfield workflow baseline

- **What Changed**: Established the no-code, privacy-safe, approval-gated architecture from the supplied v1.0 request.
- **Reason**: Make the product boundaries enforceable before detailed design begins.
- **Trade-offs**: Manual copy and publication reduce automation but keep capabilities transparent and student records in Canvas.
- **Affected Components**: All planned version 1.0 deliverables.
