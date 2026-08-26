# Authoritative Source Register

**Latest platform source review date**: `2026-08-26`
**Preserved v1.0 source review date**: `2026-08-04`

This register maps preserved v1.0 policy and platform claims plus the v2 Phase 1 platform boundary to primary or official sources. Links and claims must be reviewed again when a dated policy or platform behavior changes. Summaries below are deliberately narrow; the linked source controls.

## Source entries

| Source | Reviewed | Authority | Claim mapping |
|---|---|---|---|
| [Bergen College Policies](https://bergen.edu/about-us/college-policies/) | 2026-08-04 | Primary | Current Bergen policy index; lists the three IT policies used below and remains the check point for amendments. |
| [Bergen AI Acceptable Use Policy IT 006-003-2025](https://bergen.edu/wp-content/uploads/Artificial-Intelligence-AI-Acceptable-Use-Policy.pdf) | 2026-08-04 | Primary | Named institutional accounts, data-classification compliance, protected-data limits, and human review of generated output. |
| [Bergen Data Classification and Handling Policy](https://bergen.edu/wp-content/uploads/IT-002-001.2019-Data-Classification-and-Handling-Policy.pdf) | 2026-08-04 | Primary | Four classifications, most-restrictive rule, student-record sensitivity, and handling expectations. |
| [Bergen Google Drive and Docs Usage Guidelines](https://bergen.edu/wp-content/uploads/IT-001-001.2019-BCC-Google-Drive-Docs-Usage-Guidelines-and-Support-Agreement.pdf) | 2026-08-04 | Primary | Private information is prohibited from Bergen Google Drive and Docs. |
| [Bergen Canvas LMS](https://bergen.edu/faculty-staff/citl/instructional-technology/lms/) | 2026-08-04 | Primary | Canvas is Bergen's learning management system for course content, assessment, and tracking learning progress. |
| [Bergen Canvas Instructor Guide](https://bergen.edu/wp-content/uploads/Instructor-Guide.pdf) | 2026-08-04 | Primary | Bergen-provided instructor orientation and support context; no automated-integration claim is inferred. |
| [Use Gems in Gemini Apps](https://support.google.com/gemini/answer/15146780?hl=en) | 2026-08-04 | Official | Creating and saving a custom Gem, including a name, instructions, and optional knowledge sources. |
| [Tips for creating custom Gems](https://support.google.com/gemini/answer/15235603?hl=en) | 2026-08-04 | Official | Gem instructions, optional knowledge files or Drive files, preview behavior, and explicit Save action. |
| [What controls Gemini access to Workspace data](https://support.google.com/a/users/answer/17010577?hl=en) | 2026-08-04 | Official | Administrators and content owners can restrict Gemini or Workspace-data access. |
| [Canvas QTI import guide](https://community.instructure.com/en/kb/articles/660996-how-do-i-import-quizzes-from-qti-packages) | 2026-08-04 | Official | Canvas QTI 1.2 and 2.1 import support plus Classic Quizzes and New Quizzes workflow distinctions. |
| [Apps Script HTML Service](https://developers.google.com/apps-script/guides/html) | 2026-08-04 | Official | HTML Service can serve browser interfaces from Apps Script; this is hosting context, not a Phase 1 implementation. |
| [Apps Script HTML Service restrictions](https://developers.google.com/apps-script/guides/html/restrictions) | 2026-08-04 | Official | Iframe sandbox, HTTPS requirements for active content, and top-navigation restrictions. |
| [Apps Script HTML Service best practices](https://developers.google.com/apps-script/guides/html/best-practices) | 2026-08-04 | Official | Separate HTML, CSS, and client JavaScript; prefer asynchronous loading and HTTPS resources for a responsive interface. |
| [Capture ideas and notes with Gemini Apps](https://support.google.com/gemini/answer/15230597?hl=en) | 2026-08-26 | Official | Gemini Apps can create and find Google Keep notes and lists when the Google Workspace connected app and required settings are available; Google also warns that responses can be inaccurate. |
| [Use connected apps with a work or school account](https://support.google.com/gemini/answer/14959807?hl=en) | 2026-08-26 | Official | Work and school connected-app availability depends on qualifying access, administrator settings, account and product context; Google Keep is among the documented Workspace services. |
| [Control Gemini access to Workspace services](https://support.google.com/a/answer/15293691?hl=en) | 2026-08-26 | Official | Workspace administrators control access, disabled services remain unavailable, and Google Keep is among the supported Workspace services for eligible users. |
| [Canvas Common Cartridge import guide](https://community.instructure.com/en/kb/articles/660732-how-do-i-import-content-from-common-cartridge-into-canvas) | 2026-08-26 | Official | Canvas documents manual import of a Common Cartridge 1.x Package from a Common Cartridge ZIP or IMSCC file and exposes import progress. |
| [Canvas course import statuses](https://community.instructure.com/en/kb/articles/660738-how-do-i-view-the-status-of-current-and-prior-course-imports) | 2026-08-26 | Official | Canvas documents observable queued, running, completed, partially completed, and failed import states, including issue details for partial or failed results. |
| [Canvas Course Import Tool](https://community.instructure.com/en/kb/articles/662748-what-is-the-course-import-tool) | 2026-08-26 | Official | Course imports can include all or selected course content, draft-state settings are retained, and imports have documented limits. |
| [1EdTech Common Cartridge](https://www.1edtech.org/standards/cc) | 2026-08-26 | Official | Common Cartridge standardizes packaging and exchange of digital learning materials and assessments; the standard page distinguishes specification and certification resources. |
| [1EdTech Common Cartridge v1.3 implementation](https://www.imsglobal.org/cc/ccv1p3/imscc_Implementation-v1p3.html) | 2026-08-26 | Official | The v1.3 implementation specification describes package arrangement, ordered organization, supported resource classes, manifests, and the `.imscc` extension. |

## Claim map

### Bergen policy boundaries

- Bergen's AI policy requires a named account associated with the user's `bergen.edu` email address; personal and shared AI-service accounts are not authorized.
- AI use must follow the Data Classification and Handling Policy. Employees must not upload or share confidential, proprietary, or protected data through an AI tool.
- Generative AI output requires human review for accuracy, quality, and bias before use. The v1.0 approval gates turn that policy boundary into an observable faculty action.
- Bergen classifies information as Public, Internal, Confidential, and Private. When more than one level may apply, the most restrictive classification controls.
- Bergen's Drive guidance is stricter than a generic cloud-storage assumption: Private information must not be stored or shared in Google Drive. Therefore v1.0 memory documents contain teaching context and synthetic or de-identified class-level observations, never student records.

### Gemini capability boundary

Google documents custom Gem creation with a name and instructions, optional knowledge files from Drive, and Save. Google also documents that a Workspace administrator can restrict access to Gemini or to Workspace data.

“classic custom Gem” is a Bergen project label, not Google terminology. The release does not promise availability in the Bergen tenant; installation guidance must instruct faculty to use their named Bergen account and seek institutional support if the feature or Drive access is restricted. Prompt aliases are text conventions, not native commands, plugins, or integrations. Attaching a document as knowledge does not grant the Gem authority to edit it.

### V2 Google Keep connected-app boundary

As reviewed on 2026-08-26, Google documents that Gemini Apps can create and find Google Keep notes and lists when Google Workspace is connected. For work and school accounts, availability varies by account, Workspace edition, administrator settings, location, language, device, and Gemini app. Disabled services and required settings can prevent access, and Google warns that Gemini responses can be inaccurate or outdated.

That documentation does not establish that the Bergen classic custom Gem can complete the v2 protocol, nor does it prove a particular note was written or retrieved. An authorized live Bergen-account gate must observe create, exact-title retrieval, and full content comparison before this project can report a successful write. A create confirmation by itself, a missing or duplicate exact-title result, a content mismatch, or unavailable access is not success; failed or unverified persistence remains a failure.

### Canvas and QTI boundary

Bergen identifies Canvas as its learning management system. The official Instructure guide says Canvas supports QTI 1.2 and 2.1 imports and distinguishes the import route used by Classic Quizzes from the internal import route used by New Quizzes.

Package origin, quiz engine, institution settings, and third-party variations still matter: structure checks do not prove Bergen compatibility. A manual import into an unpublished Bergen Canvas test course remains required before v1.0 compatibility can be approved. Nothing in these sources supports a claim that Bergen Memory Bank can use the Canvas API, publish autonomously, or store student records outside Canvas.

### V2 Common Cartridge and Canvas import boundary

Instructure documents a faculty-controlled Canvas route that selects `Common Cartridge 1.x Package`, chooses a Common Cartridge ZIP or IMSCC file, adds the import to the queue, and observes the job. Canvas documents Queued, Running, Completed, Partially Completed, and Failed states. The Course Import Tool overview also states that draft-state settings are retained in course imports; the Bergen v2 contract nevertheless makes unpublished defaults explicit and requires faculty review.

1EdTech describes Common Cartridge as a standard that packages and exchanges digital learning materials and assessments. Its v1.3 implementation material describes manifests, ordered organization and resource types, and the `.imscc` extension. Phase 1 schema and fixture are not a generated cartridge and do not claim 1EdTech certification.

Repository schema and reference checks establish only local input structure. An authorized import into an unpublished Bergen Canvas sandbox must complete before reviewers inspect the resulting course. Phase 1 does not establish compatibility, conformance, successful import, or publication, and nothing authorizes Canvas API access or autonomous publication.

### Apps Script hosting boundary

Apps Script HTML Service pages run in an iframe sandbox. Active content and requests must use HTTPS. Because top-level navigation is restricted, a redirect should be presented as a user-activated link or button. The implemented packager keeps quiz transformation in client-side browser code; its local source and network behavior are inspected in Phase 5, while live deployment and domain-access behavior remain manual checks. No Apps Script application was implemented in Phase 1.
