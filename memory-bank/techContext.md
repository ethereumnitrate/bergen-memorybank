# Technology Context

## Current State

This is a greenfield, content-first project. There is no application runtime, source code, package manager, build system, API integration, or automated deployment in the repository at initialization.

## Component Structure

| Component | Purpose | Current Location | Format |
|-----------|---------|------------------|--------|
| Memory Bank | Durable planning, task, decision, and verification context for producing the kit | `memory-bank/` | Markdown |
| Gemini Gem instructions | Complete custom instructions for the classic “Bergen Memory Bank” Gem | To be selected during planning | Copy-ready text, likely maintained as Markdown in the repository |
| Google Docs templates | Four memory documents plus the Class Learning Snapshot template | To be selected during planning | Copy-ready document content; final delivery targets Google Docs |
| Faculty enablement materials | Command reference, installation, quick start, presentation script, prompts, demonstration, privacy, and troubleshooting content | To be selected during planning | Copy-ready documents, likely maintained as Markdown in the repository |

## Platforms and External Services

| Platform | Role | Integration Boundary |
|----------|------|----------------------|
| Classic custom Gemini Gem | Hosts the conversational instructions and interprets prompt aliases | Manual configuration only; exact current capabilities must be confirmed from official Google documentation |
| Google Drive | Holds the faculty-created Bergen Memory Bank folder | Manual file management only |
| Google Docs | Holds reusable memory documents | Manual copy, edit, and approved update workflow |
| Canvas | Stores student records and receives final approved course content | Manual faculty workflow only; no Canvas API or autonomous publishing |

## Development Commands

No development, build, lint, type-check, or application test commands exist yet. If repository-native validation scripts are introduced during planning or build, document exact commands here before relying on them.

## Test Execution Strategy

- Run repository-level content and structure checks from the project root when such checks are introduced.
- Use scenario-based verification for every `bergen:<workflow>` alias and its natural-language equivalent.
- Include privacy-boundary, unknown-command, missing-context, approval-gate, and capability-claim scenarios.
- Use only synthetic, de-identified example data.
- Manually verify the installation path in an authorized non-production Gem and faculty-owned test documents before release; credentials and protected records must never enter repository artifacts.
- Exact automation, test file locations, and target counts are unknown until the v1.0 plan establishes the deliverable layout.

## Technology Stack

- **Repository documentation**: Markdown.
- **Faculty-facing authoring and memory**: Google Docs in Google Drive.
- **Conversational host**: Classic custom Gemini Gem created with a `bergen.edu` account.
- **Student-record and publishing system**: Canvas.
- **APIs and automation**: None in version 1.0.

<!-- AUTO-MANAGED: c4-references-start -->
## C4 References

C4 architecture documentation has not been generated. This content-only greenfield project does not currently meet the threshold for a brownfield C4 scan.

<!-- AUTO-MANAGED: c4-references-end -->

## Recent Technology Changes

### 2026-08-04 - Greenfield initialization

- **What Changed**: Recorded the user-specified no-code platform boundaries.
- **Reason**: Prevent the design from drifting toward custom software, APIs, or faculty-facing technical requirements.
- **Impact**: Version 1.0 deliverables are content and templates, not an application.
