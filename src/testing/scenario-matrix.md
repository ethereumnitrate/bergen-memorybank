# Scenario Verification Matrix

## Phase 1 purpose

This file is the human-readable verification contract for Bergen Memory Bank v1.0. Phase 1 supplies synthetic inputs and names the observable safeguards that later phases must implement. It does not claim that the Gem, documents, faculty guides, or QTI Packager exist.

## Foundation scenarios

| Scenario | Synthetic input | Observable contract | Implementation status | Planned automated phase |
|---|---|---|---|---:|
| Help alias with mixed case | `BeRgEn:HeLp` | Help header, safe-data boundary, examples, Remember stage, next command | Fixture only | 2 |
| Natural-language lesson request | De-identified ecology lesson request | Same routing, context, and approval safeguards as the lesson alias | Fixture only | 2 |
| Protected-data stop | Placeholder stating that identifying content was removed | Stop processing and offer a blank de-identified Class Learning Snapshot | Fixture only | 2 |
| Unsupported alias | `bergen:archive-course` | Do not guess; identify the alias as unsupported and show help | Fixture only | 2 |
| Synthetic supported quiz | Five synthetic ecology questions | Representative input for later validation and packaging checks | Fixture only | 5 |

## Safeguard coverage contract

| Safeguard | Observable output | Verification owner |
|---|---|---|
| Minimum necessary context | Selected course, named document sources, supplied facts, and one necessary question | Phase 2 content checks |
| Human approval | Review does not revise; revise and record use only approved changes; publication remains manual | Phase 2 content checks and Phase 4 guide alignment |
| Student-record boundary | Processing stops without echoing identifying content; Canvas remains the student-record system | Phase 2 content checks |
| Four-document ownership | Shared and course-specific homes plus a replaceable de-identified snapshot section | Phase 3 template checks |
| Faculty-facing language | Installation and daily work do not require repository, API, terminal, or programming knowledge | Phase 4 guide checks |
| Browser-only packaging | No server, database, account, telemetry, or Canvas API receives quiz content | Phase 5 source and browser checks |
| Canvas compatibility | Authorized manual import result in an unpublished Bergen test course | Manual v1.0 release gate |

## What is not tested here

No fixture contains a real record, credential, email address, identifying filename, grade, accommodation, health detail, or raw student work. This scaffold does not test hidden Gemini context, live tenant access, automatic Google Docs editing, Canvas automation, live APIs, or compatibility inferred from QTI structure.
