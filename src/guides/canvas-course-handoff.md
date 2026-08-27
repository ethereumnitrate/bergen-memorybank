# Bergen Memory Bank Whole-Course Canvas Handoff Guide

Use this no-code path only after the full course has been reviewed and approved. It creates one local whole-course `.imscc` for manual import into an authorized unpublished Canvas sandbox. It does not publish a course or prove Bergen Canvas compatibility.

## Choose the whole-course route

Enter `bergen:package course` after reviewing course metadata, ordered modules and items, pages, assignments, discussions, rubrics, quizzes or exams, completion rules, accessibility, alignment, and unpublished defaults. Final review and approval to prepare the handoff are separate decisions.

The Gem emits exactly one text-only **Bergen Course Transfer Block** from the current approved course. Review the course name and content before leaving Gemini. Do not use placeholder, sample, student, credential, or hidden-memory content.

For one approved quiz or exam without the surrounding course, use `bergen:package assessment` and the assessment-only QTI guide instead.

## Create the local `.imscc`

1. Open the institution-provided **Bergen Course Packager** page.
2. Paste the approved block into the box labeled **Bergen Course Transfer Block**.
3. Select the validation action.
4. Correct any specific safe issue shown. If protected information may be present, stop and begin again with new de-identified input.
5. Confirm the no-student-data statement.
6. Wait for the exact status `Course package ready`.
7. Confirm that the exact action `Download .imscc` is enabled, then select it once.

The page keeps course content only in the active browser session. A validation or generation failure keeps download disabled and cannot reuse an older package. The same approved input produces the same local package under the supplied checks, but a successful local package is not proof of Bergen Canvas compatibility.

## Import into an unpublished sandbox

1. Open the authorized unpublished Canvas sandbox and select **Settings**.
2. Select **Import Course Content**.
3. Choose **Common Cartridge 1.x Package**.
4. Choose the local `.imscc`, keep the destination unpublished, and add the import to the queue.
5. Watch the Canvas import status. Wait until the import job reports **Completed** before you review **Modules**.
6. If Canvas reports partially completed or failed, stop and review the issue details. Do not treat the course as available or compatible.

## Review before publication

While the sandbox remains unpublished, compare the imported course with the approved handoff:

- course title and settings;
- module order, item order, and completion rules;
- pages and internal links;
- assignments, discussions, rubrics, quizzes, and exams;
- points, answer information, accessibility, and unpublished states.

Record the authorized synthetic acceptance result separately. Only an observed completed import and reviewed course can provide Bergen-specific evidence. Publication remains a later faculty decision and is never automatic.

## If the handoff cannot be completed

Keep the approved course text in Gemini. Correct safe packaging issues in the current browser session, or use reviewed manual Canvas entry. Do not claim import, compatibility, availability, or publication when the corresponding action was not observed.

## Source note

Common Cartridge and Canvas import statements were reviewed on 2026-08-26 against the dated official sources recorded for Bergen Memory Bank.
