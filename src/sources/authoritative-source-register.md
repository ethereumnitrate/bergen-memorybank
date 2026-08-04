# Authoritative Source Register

**Source review date**: `2026-08-04`

This register maps v1.0 policy and platform claims to current primary or official sources. Links and claims must be reviewed again when a dated policy or platform behavior changes. Summaries below are deliberately narrow; the linked source controls.

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

### Canvas and QTI boundary

Bergen identifies Canvas as its learning management system. The official Instructure guide says Canvas supports QTI 1.2 and 2.1 imports and distinguishes the import route used by Classic Quizzes from the internal import route used by New Quizzes.

Package origin, quiz engine, institution settings, and third-party variations still matter: structure checks do not prove Bergen compatibility. A manual import into an unpublished Bergen Canvas test course remains required before v1.0 compatibility can be approved. Nothing in these sources supports a claim that Bergen Memory Bank can use the Canvas API, publish autonomously, or store student records outside Canvas.

### Apps Script hosting boundary

Apps Script HTML Service pages run in an iframe sandbox. Active content and requests must use HTTPS. Because top-level navigation is restricted, a redirect should be presented as a user-activated link or button. The implemented packager keeps quiz transformation in client-side browser code; its local source and network behavior are inspected in Phase 5, while live deployment and domain-access behavior remain manual checks. No Apps Script application was implemented in Phase 1.
