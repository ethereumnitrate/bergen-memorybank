# Bergen Course Packager deployment handoff

This folder is the deployable Google Apps Script source for the optional Bergen Course Packager. An authorized Bergen administrator or support person deploys it to a Bergen-controlled Apps Script project. Faculty use the resulting institution-provided static HTML page; they do not install or run repository tools.

## Privacy and capability boundary

- `Code.gs` serves static HTML and its included local styles and browser script only.
- Course content is parsed, validated, converted, and placed in one `.imscc` in the active browser session.
- The `.imscc` uses the Common Cartridge 1.3 resource profile and embeds quiz and exam assessments as QTI 1.2. Every Canvas-facing representation remains unpublished.
- Course content is not sent to Apps Script functions, a content service, an account, a database, browser storage, telemetry, Canvas, or any other destination.
- The parser checks raw text before JSON parsing. Protected or identifiable content is refused without echoing it, removed from the page, and never packaged.
- Only a complete version 0.1 block from the current approved course can be packaged. Invalid content fails all-or-nothing; there is no partial cartridge.
- The page reports `Course package ready` and enables download only after all package bytes have been generated. Download reuses those bytes; input changes or generation failures clear package readiness so an earlier course cannot be downloaded by mistake.
- Canvas remains the only student-record system. Import, review, saving, and publication are manual faculty actions.

## Authorized deployment

1. Sign in with the approved Bergen Workspace account and create a new Apps Script project in the authorized Bergen Drive location.
2. Replace `Code.gs`, add `Index.html`, `Styles.html`, and `Script.html`, then replace the project manifest with `appsscript.json`. Do not copy this README into the editor.
3. Save without adding services, triggers, storage, remote requests, telemetry, or a Canvas connection.
4. Create a Web app deployment using the Bergen-approved execution identity and organization-only access setting.
5. If an organization-only option is unavailable, stop and ask an authorized administrator. Do not substitute public access.
6. Test only with a repository-supplied synthetic/de-identified block.

The project manifest cannot guarantee domain-restricted Web app access. An authorized administrator must inspect the actual deployment setting after every new deployment version.

## Verification before faculty use

- Confirm the page is restricted to approved accounts.
- Paste a complete synthetic block and select **Validate course**. Confirm **Download .imscc** remains disabled until the no-student-data confirmation is selected.
- Confirm the page reports exactly `Course package ready` and downloads one `.imscc` locally.
- Inspect the package structure with the repository tests.
- Manually import the synthetic file into an authorized unpublished Canvas sandbox, wait for the import job, and review every module, item, page, assignment, discussion, rubric, assessment, completion rule, and internal link. Keep the course unpublished.

Automated checks establish deterministic package structure. A generated file does not prove Bergen Canvas compatibility. Only the authorized unpublished sandbox review can supply that external evidence.

## Faculty fallback and rollback

If validation reports a problem or sandbox review is uncertain, preserve safe correctable input, remove any protected input, keep the current approved course content in Gemini, and use faculty-controlled manual Canvas entry. Never force a partial package.

Create a reviewed Apps Script deployment version for each update. If verification fails, disable the affected deployment, restore the previous reviewed version, and return to manual import and review. Publication always remains a separate faculty decision.
