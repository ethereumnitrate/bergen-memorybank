# Bergen Memory Bank v1.0 — Approved Design

## Design Outcome

Version 1.0 will be a faculty-facing, no-code kit consisting of one classic custom Gemini Gem, four reusable Google Docs, supporting guides and demonstrations, and a Bergen-controlled client-side QTI Packager. Canvas remains the student-record system and the final manual publishing destination. Every consequential action remains visible and faculty-approved.

## Approaches Considered

### Memory document structure

1. **One document for everything** — simplest installation, but becomes difficult to scan, mixes temporary and durable context, and increases retrieval ambiguity.
2. **Four documents for every course** — strong separation, but duplicates stable faculty preferences and reusable practices across courses.
3. **Hybrid shared-and-per-course structure** — one shared Faculty Profile and one shared Decisions, Reflections, and Reusable Practices document, plus a Course Memory and Active Workbench pair for each course.

**Decision**: Use the hybrid structure. Initial installation still requires four documents. Each additional course adds only a Course Memory and Active Workbench pair. The Class Learning Snapshot is a temporary, replaceable section inside Active Workbench, not a fifth knowledge document.

### Conversational architecture

1. A single long instruction sequence.
2. Workflow-specific rules stored primarily in attached knowledge documents.
3. An always-on layered instruction architecture.

**Decision**: Use an always-on safety and capability kernel, then a command/natural-language router, explicit course and context selector, and stage engine. Knowledge documents provide course context but never own the core privacy or capability rules. Recognized commands display `Bergen Memory Bank · <Workflow Name>`, state the context used, ask only for required information, and end with the current stage and recommended next command. Unknown commands do not guess; they show help and suggest the closest aliases.

### Course selection and memory use

**Decision**: Require explicit course selection for course-specific work, echo the selected course, and ask when the course is ambiguous. Do not claim the selection persists across new Gemini chats. Treat attached documents as faculty-controlled references, not automatically editable memory.

### Context-window explanation

Gemini does not expose a reliable faculty-facing meter for hidden instructions, retrieved knowledge, or actual remaining model context.

**Decision**: Provide a conservative **visible-chat estimate**, clearly labeled low-confidence and not an actual capacity reading. For Education Fundamentals, use 32,000 tokens only as an unverified working denominator until an authorized plan-specific source establishes a better value. State that the estimate excludes hidden/system/Gem instructions, retrieved documents, and actual model capacity. Guidance: below approximately 50% may continue; approximately 50–70% should use `bergen:record` soon; above approximately 70% should record and begin a new chat. Restart earlier whenever decisions are lost or courses become mixed. Explain that hallucinations can occur at any percentage and the estimate explains only one possible source of degraded reliability.

### Canvas publishing

**Decision**: Regular assignments, announcements, lessons, exams, and other materials are delivered as copy-ready Canvas Publishing Packets for manual faculty review and transfer. The Gem never claims to publish, save, or synchronize automatically.

### QTI generation

1. Ask Gemini to create a downloadable QTI ZIP — rejected by observed proof: the classic Gem chat could supply XML text but could not create the ZIP package.
2. Add a direct Gem webhook/custom action — rejected for v1.0 because classic Gems do not provide the required institution-ready custom action path and it would introduce misleading integration claims.
3. Send quiz content to an external packaging service — rejected because it adds avoidable content transfer, hosting, retention, account, and governance risk.
4. Use a Bergen-controlled browser-only packager — selected.

**Decision**: `bergen:assignment` covers assignments, exams, and quizzes. After faculty approval, supported quizzes may be emitted as a structured Bergen Quiz Transfer Block. The faculty opens the linked Bergen QTI Packager, pastes the block, validates it, confirms it contains no student data, and downloads a QTI 1.2 ZIP. Packaging happens in the browser with no quiz-content submission to a server, database, telemetry system, account, or Canvas API. The faculty manually imports into an unpublished Canvas test course, reviews correctness, and publishes only after approval.

Initial supported item types are multiple choice, true/false, multiple answer, short answer, and essay. Unsupported types fall back to copy-ready quiz content. QTI structure tests are necessary but cannot prove compatibility with Bergen's Canvas configuration; a successful authorized test-course import is a release gate.

## Privacy Boundary

- Canvas stores student submissions, grades, individual feedback, accommodations, and other student records.
- Bergen Memory Bank stores teaching context, faculty decisions, course materials, and de-identified class-level observations.
- The Gem and examples never request, accept, or retain raw student submissions; names, emails, IDs, identifying filenames; individual grades; student-specific feedback; accommodation, disability, health, advising, or disciplinary information; identifiable quotations; or identifying combinations of details.
- If protected information appears, processing stops without echoing or transforming it unnecessarily. The faculty member is guided to replace it with a de-identified Class Learning Snapshot before the workflow resumes.

## End-to-End Journey

1. Faculty creates a **Bergen Memory Bank** Drive folder and copies the four supplied templates.
2. Faculty creates a classic custom Gem using a `bergen.edu` account, names it **Bergen Memory Bank**, pastes the supplied instructions, attaches the Drive documents as Gem knowledge, saves, and enters `bergen:help`.
3. The Gem displays the workflow header, safe-data boundary, examples, current stage, and recommended next command.
4. Faculty selects the course and completes lesson, assignment, rubric, review, revision, and record stages with explicit approvals.
5. The record stage proposes target-document updates as copy-ready text; the faculty member applies approved text manually.
6. Regular content is copied manually to Canvas. For a supported quiz, the faculty may use the Quiz Transfer Block and Bergen QTI Packager, then manually import into an unpublished test course, review, and publish.

## One-Way Doors and Guardrails

- Student-specific data must never migrate from Canvas into Gemini knowledge documents or the QTI Packager.
- The Gem must never represent prompt aliases as native commands, plugins, integrations, or system access.
- Review must not silently become revision; `bergen:revise` applies only faculty-approved changes.
- `bergen:record` proposes copy-ready updates and never claims to modify documents.
- QTI ZIP generation must remain optional, client-side, and separable from the core Gem so a packaging failure cannot block copy-ready teaching work.
- Policy, platform, and compatibility claims are dated and traceable to authoritative sources so later releases can revalidate them.

## Proof-of-Concept Evidence

The repository PoC demonstrates browser-only validation and QTI ZIP creation for five supported item types. Six Node tests pass; the generated ZIP contains well-formed `imsmanifest.xml` and `assessment.xml`, five items, and 12 points. Desktop and mobile browser flows reached the success state; missing answer keys and an unchecked privacy confirmation block packaging. A self-contained demo and prebuilt synthetic ZIP provide presentation fallbacks. The remaining manual proof is a successful import in an authorized unpublished Bergen Canvas test course.
