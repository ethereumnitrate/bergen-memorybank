import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

const repositoryFile = (relativePath) => new URL(`../../${relativePath}`, import.meta.url);
const readText = (relativePath) => readFile(repositoryFile(relativePath), 'utf8');

test('Apps Script bundle is complete and documents controlled deployment without false manifest guarantees', async () => {
  const files = [
    'Code.gs', 'Index.html', 'Styles.html', 'Script.html', 'appsscript.json', 'README.md',
  ];
  for (const file of files) await access(repositoryFile(`apps/qti-packager/${file}`));
  const [manifest, readme, script] = await Promise.all([
    readText('apps/qti-packager/appsscript.json'),
    readText('apps/qti-packager/README.md'),
    readText('apps/qti-packager/Script.html'),
  ]);
  const parsed = JSON.parse(manifest);
  assert.equal(parsed.runtimeVersion, 'V8');
  assert.equal('webapp' in parsed, false, 'the manifest must not pretend to enforce web-app domain access');
  assert.match(readme, /Bergen-controlled/i);
  assert.match(readme, /bergen\.edu|organization|domain/i);
  assert.match(readme, /deployment setting.+not.+manifest|manifest.+does not.+restrict/is);
  assert.match(readme, /authorized administrator|authorized support/i);
  assert.match(readme, /rollback/i);
  assert.match(readme, /not (?:yet )?(?:approved|verified).+Bergen Canvas|compatibility.+pending/is);
  assert.match(readme, /application-owned code and storage.+(?:does not|do not).+cookies/is);
  assert.match(readme, /Google-hosted authentication.+outside.+proof boundary/is);
  assert.match(readme, /raw text before JSON parsing/i);
  assert.doesNotMatch(readme, /The page uses no remote data request, browser storage, cookie,/i);
  assert.match(script, /privacyRefused[\s\S]*?transfer\.value\s*=\s*['"]/i);
});

test('Apps Script serves static HTML while all quiz handling remains browser-only', async () => {
  const [code, script] = await Promise.all([
    readText('apps/qti-packager/Code.gs'),
    readText('apps/qti-packager/Script.html'),
  ]);
  assert.match(code, /HtmlService\.createTemplateFromFile\(['"]Index['"]\)/);
  assert.doesNotMatch(code, /doPost|PropertiesService|DriveApp|UrlFetchApp|Jdbc|CacheService/);
  assert.doesNotMatch(script, /google\.script\.run|\bfetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon|localStorage|sessionStorage|indexedDB|document\.cookie/i);
  assert.doesNotMatch(script, /location\.(?:href|search|hash)|URLSearchParams/i);
  assert.match(script, /createObjectURL/);
  assert.match(script, /application\/zip/);
});

test('page is accessible, privacy-gated, responsive, and states the exact local success and manual Canvas boundary', async () => {
  const [index, styles, script] = await Promise.all([
    readText('apps/qti-packager/Index.html'),
    readText('apps/qti-packager/Styles.html'),
    readText('apps/qti-packager/Script.html'),
  ]);
  assert.match(index, /<html lang="en">/);
  assert.match(index, /<meta name="viewport"/);
  assert.match(index, /role="status"/);
  assert.match(index, /aria-live="polite"/);
  assert.match(index, /id="privacy-confirmation"[^>]+type="checkbox"|type="checkbox"[^>]+id="privacy-confirmation"/);
  assert.match(index, /no student-identifying or protected information/i);
  assert.match(index, /unpublished Canvas test course/i);
  assert.match(styles, /@media\s*\([^)]*max-width/i);
  assert.match(script, /QTI package ready\. Download your ZIP and import it into an unpublished Canvas test course\./);
  assert.match(script, /privacy-confirmation/);
  assert.match(script, /manual entry/i);
});
