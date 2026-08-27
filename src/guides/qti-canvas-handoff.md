# Bergen Memory Bank QTI-to-Canvas Handoff Guide

This is the assessment-only path for an approved exam or quiz. It produces a local QTI ZIP and does not require or generate a whole-course `.imscc`. Assignment text can still use manual copy into Canvas after review and separate faculty approval.

## Choose the handoff

- Regular assignment text uses manual copy through a reviewed Canvas Publishing Packet.
- `bergen:package assessment` may emit a **Bergen Quiz Transfer Block** for an approved exam or quiz.
- `bergen:package course` uses the separate Bergen Course Transfer Block and whole-course `.imscc` guide.
- Use the browser-only packager only when an institution link is available.
- The institution-provided packager link is not currently available, so use manual Canvas entry. Use the same fallback when an item is unsupported, validation fails, or import is uncertain.

## Before preparing a quiz

- Use synthetic teaching examples only and confirm **no student data** is present.
- Obtain explicit approval of the quiz content before preparing the transfer handoff.
- Include the quiz title, directions, settings, stable item identifiers, prompts, point values, and answer information where appropriate.
- Do not place quiz content in the address bar or web address of any link. Open only the institution-provided page and paste the reviewed transfer block into the page itself.

## Five supported item types

- Multiple choice
- True/false
- Multiple answer
- Short answer
- Essay

An unsupported item uses the fallback: identify the unsupported type and provide reviewed copy-ready content for manual entry. Do not force it into a different type or create a misleading package.

## When the institution packager is available

- Paste the approved Bergen Quiz Transfer Block into the institution-provided page.
- Confirm again that it contains no student data.
- Correct any displayed validation issue before packaging.
- Create and download the local ZIP in the active browser session.
- Do not expect an account or remote quiz storage. The tool does not connect directly to Canvas.

## Canvas import and publication gate

- Open the authorized **unpublished Canvas test course** and select **Settings**.
- Select **Import Course Content**.
- For content type, select **QTI .zip file**.
- Select **Choose File**, choose the local ZIP, and then select **Import**.
- Wait until Canvas reports **Import complete** before you open or review the unpublished quiz.
- For an ordinary quiz, review every item type actually present, along with the title, directions, settings, points, and answer information.
- For the separate synthetic compatibility package, verify all five supported item types and settings as part of the required manual compatibility check.
- Review before publish. Keep the quiz unpublished until an authorized faculty or support user confirms the result.
- A successful local package is not proof of Bergen Canvas compatibility. Record the authorized manual test result separately.

If import fails or anything looks different from the approved quiz, stop. Keep the quiz unpublished, preserve the reviewed text, and use manual entry while seeking institutional support.

## Current availability boundary

Use the institution-provided assessment packager only when it is available to your authorized account; otherwise use manual Canvas entry. Use with Bergen Canvas has not been approved. This guide defines the faculty-controlled handoff and fallback; local QTI checks do not establish a live page, import result, compatibility, or publication.

## Source note

Canvas import statements were reviewed on 2026-08-26 against the dated official QTI and Canvas sources recorded for Bergen Memory Bank. Those sources document the import route but do not establish Bergen-specific compatibility.
