import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const sourceRegisterUrl = new URL('../../src/sources/authoritative-source-register.md', import.meta.url);

async function readSourceRegister() {
  try {
    return await readFile(sourceRegisterUrl, 'utf8');
  } catch (error) {
    assert.fail(`Expected Phase 1 source register to exist: ${error.message}`);
  }
}

const officialSources = [
  'https://bergen.edu/about-us/college-policies/',
  'https://bergen.edu/wp-content/uploads/Artificial-Intelligence-AI-Acceptable-Use-Policy.pdf',
  'https://bergen.edu/wp-content/uploads/IT-002-001.2019-Data-Classification-and-Handling-Policy.pdf',
  'https://bergen.edu/wp-content/uploads/IT-001-001.2019-BCC-Google-Drive-Docs-Usage-Guidelines-and-Support-Agreement.pdf',
  'https://bergen.edu/faculty-staff/citl/instructional-technology/lms/',
  'https://bergen.edu/wp-content/uploads/Instructor-Guide.pdf',
  'https://support.google.com/gemini/answer/15146780?hl=en',
  'https://support.google.com/gemini/answer/15235603?hl=en',
  'https://support.google.com/a/users/answer/17010577?hl=en',
  'https://community.instructure.com/en/kb/articles/660996-how-do-i-import-quizzes-from-qti-packages',
  'https://developers.google.com/apps-script/guides/html',
  'https://developers.google.com/apps-script/guides/html/restrictions',
  'https://developers.google.com/apps-script/guides/html/best-practices',
];

const v2OfficialSources = [
  'https://support.google.com/gemini/answer/15230597?hl=en',
  'https://support.google.com/gemini/answer/14959807?hl=en',
  'https://support.google.com/a/answer/15293691?hl=en',
  'https://community.instructure.com/en/kb/articles/660732-how-do-i-import-content-from-common-cartridge-into-canvas',
  'https://community.instructure.com/en/kb/articles/660738-how-do-i-view-the-status-of-current-and-prior-course-imports',
  'https://community.instructure.com/en/kb/articles/662748-what-is-the-course-import-tool',
  'https://www.1edtech.org/standards/cc',
  'https://www.imsglobal.org/cc/ccv1p3/imscc_Implementation-v1p3.html',
];

test('source register contains one dated primary or official entry for every required source', async () => {
  const sourceRegister = await readSourceRegister();
  const rows = [...sourceRegister.matchAll(/^\|\s*\[[^\]]+\]\((https:\/\/[^)]+)\)\s*\|\s*(2026-08-04)\s*\|\s*(Primary|Official)\s*\|/gm)];
  const registeredUrls = rows.map(([, url]) => url);

  assert.deepEqual(registeredUrls, officialSources);
  assert.equal(new Set(registeredUrls).size, officialSources.length);
});

test('Bergen policy claims preserve account, classification, privacy, and human-review boundaries', async () => {
  const sourceRegister = await readSourceRegister();

  assert.match(sourceRegister, /named account associated with the user['’]s `bergen\.edu` email address/i);
  assert.match(sourceRegister, /personal and shared AI-service accounts are not authorized/i);
  assert.match(sourceRegister, /Public, Internal, Confidential, and Private/);
  assert.match(sourceRegister, /most restrictive classification/i);
  assert.match(sourceRegister, /must not upload or share confidential, proprietary, or protected data/i);
  assert.match(sourceRegister, /human review for accuracy, quality, and bias/i);
  assert.match(sourceRegister, /Private information must not be stored or shared in Google Drive/i);
});

test('Gem and Canvas claims state verified features without promising tenant access or compatibility', async () => {
  const sourceRegister = await readSourceRegister();

  assert.match(sourceRegister, /Google documents custom Gem creation with a name and instructions, optional knowledge files from Drive, and Save/i);
  assert.match(sourceRegister, /“classic custom Gem” is a Bergen project label, not Google terminology/i);
  assert.match(sourceRegister, /administrator can restrict access to Gemini or to Workspace data/i);
  assert.match(sourceRegister, /does not promise availability in the Bergen tenant/i);
  assert.match(sourceRegister, /Canvas supports QTI 1\.2 and 2\.1 imports/i);
  assert.match(sourceRegister, /structure checks do not prove Bergen compatibility/i);
  assert.match(sourceRegister, /manual import into an unpublished Bergen Canvas test course remains required/i);
});

test('Apps Script claims capture the official sandbox, HTTPS, and navigation constraints', async () => {
  const sourceRegister = await readSourceRegister();

  assert.match(sourceRegister, /HTML Service pages run in an iframe sandbox/i);
  assert.match(sourceRegister, /active content and requests must use HTTPS/i);
  assert.match(sourceRegister, /top-level navigation is restricted/i);
  assert.match(sourceRegister, /user-activated link or button/i);
  assert.match(sourceRegister, /No Apps Script application was implemented in Phase 1/i);
});

test('v2 Keep claims are dated to current official sources and stop at observable connected-app evidence', async () => {
  const sourceRegister = await readSourceRegister();
  const rows = [...sourceRegister.matchAll(/^\|\s*\[[^\]]+\]\((https:\/\/[^)]+)\)\s*\|\s*(2026-08-26)\s*\|\s*(Official)\s*\|/gm)];
  const registeredUrls = rows.map(([, url]) => url);

  assert.deepEqual(registeredUrls, v2OfficialSources);
  assert.match(sourceRegister, /Gemini Apps can create and find Google Keep notes and lists/i);
  assert.match(sourceRegister, /availability varies by account, Workspace edition, administrator settings, location, language, device, and Gemini app/i);
  assert.match(sourceRegister, /does not establish that the Bergen classic custom Gem can complete the v2 protocol/i);
  assert.match(sourceRegister, /authorized live.*create.*exact-title retrieval.*full content comparison/i);
  assert.match(sourceRegister, /failed or unverified persistence remains a failure/i);
});

test('v2 Common Cartridge claims distinguish standards and repository structure from Canvas import evidence', async () => {
  const sourceRegister = await readSourceRegister();

  assert.match(sourceRegister, /Common Cartridge 1\.x Package/i);
  assert.match(sourceRegister, /ZIP or IMSCC file/i);
  assert.match(sourceRegister, /Queued, Running, Completed, Partially Completed, and Failed/i);
  assert.match(sourceRegister, /draft-state settings are retained in course imports/i);
  assert.match(sourceRegister, /1EdTech.*packages and exchanges digital learning materials and assessments/i);
  assert.match(sourceRegister, /\.imscc/);
  assert.match(sourceRegister, /Phase 1 schema and fixture are not a generated cartridge/i);
  assert.match(sourceRegister, /authorized import into an unpublished Bergen Canvas sandbox/i);
  assert.match(sourceRegister, /does not establish compatibility, conformance, successful import, or publication/i);
});
