# Bergen QTI Packager deployment handoff

This folder is the deployable Google Apps Script source for the optional Bergen Memory Bank QTI companion. An authorized Bergen support person or administrator deploys it to a Bergen-controlled Apps Script project. Faculty use the resulting institution-provided page in a browser; they do not install or run repository tools.

## Privacy and capability boundary

- `Code.gs` serves the static page and its included styles and browser script only.
- Quiz content is parsed, checked, converted to XML, and placed in a ZIP in the active browser session.
- Quiz content is not sent to Apps Script functions, a server, database, account, telemetry service, Canvas, or any other service.
- The page uses no remote data request, browser storage, cookie, or Canvas API.
- The transfer block must contain only approved course content and no student-identifying or protected information.
- Canvas remains the student-record system. Import, review, saving, and publication are manual faculty actions.

## Authorized deployment

1. Sign in with the approved Bergen Workspace account and create a new Apps Script project in the authorized Bergen Drive location.
2. Replace `Code.gs`, add the three HTML files with their matching names, and use the project settings to show and replace `appsscript.json`. `README.md` is deployment guidance and is not copied into the Apps Script editor.
3. Save the project. Do not add services, triggers, storage, data requests, or a Canvas connection.
4. Choose **Deploy**, **New deployment**, and **Web app**.
5. Use the Bergen-approved execution identity. Under access, choose the organization-only or `bergen.edu`-only option approved by the Bergen administrator.
6. If an organization-only option is unavailable, stop and ask an authorized Workspace administrator. Do not deploy the page publicly as a substitute.
7. Deploy, record the institution-provided page location in the approved faculty guide, and test only with the supplied synthetic sample.

Domain restriction is a deployment setting controlled by the Bergen Workspace environment. The manifest does not restrict access, and `appsscript.json` cannot guarantee domain-restricted web-app access. An authorized administrator must review the actual deployment setting whenever the deployment is created or updated.

## Verification before faculty use

- Open the deployed page while signed in with an authorized Bergen account and confirm that an unapproved account cannot open it.
- Load the safe sample, select **Check quiz**, and confirm that download remains disabled until the privacy checkbox is selected.
- Generate the local ZIP and confirm that the page shows: `QTI package ready. Download your ZIP and import it into an unpublished Canvas test course.`
- Import the synthetic ZIP manually through **Settings** → **Import Course Content** → **QTI .zip file** in an unpublished Bergen Canvas test course.
- Wait for Canvas to report the import complete. Review all five item types, answer behavior, 12 total points, shuffle setting, allowed attempts, and time-limit setting.
- Record the test result without student data. Keep the quiz unpublished.

Automated checks establish package structure only. The packager is not yet approved or verified for Bergen Canvas compatibility until an authorized Bergen faculty or support user completes and records that manual test.

## Faculty fallback

If the page is unavailable, validation reports a problem, an item type is unsupported, or Canvas import is uncertain, keep the quiz unpublished and use the reviewed copy-ready quiz content for manual Canvas entry. Do not force an unsupported item into a different type.

## Update and rollback

Create a new Apps Script deployment version for each reviewed update; do not overwrite the last known version without a rollback path. If verification fails, disable the affected deployment, restore the previous reviewed deployment version, remove the institution-provided page location from faculty material, and use manual Canvas entry while the issue is reviewed.
