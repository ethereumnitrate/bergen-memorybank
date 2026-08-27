import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

const repositoryFile = (relativePath) => new URL(`../../${relativePath}`, import.meta.url);
const readText = (relativePath) => readFile(repositoryFile(relativePath), 'utf8');

test('Course Packager Apps Script bundle is complete, static, client-only, and dependency-free', async () => {
  const files = ['appsscript.json', 'Code.gs', 'Index.html', 'Script.html', 'Styles.html', 'README.md'];
  for (const file of files) await access(repositoryFile(`apps/course-packager/${file}`));

  const [manifestSource, code, index, script, styles, readme, packageSource, demo] = await Promise.all([
    readText('apps/course-packager/appsscript.json'),
    readText('apps/course-packager/Code.gs'),
    readText('apps/course-packager/Index.html'),
    readText('apps/course-packager/Script.html'),
    readText('apps/course-packager/Styles.html'),
    readText('apps/course-packager/README.md'),
    readText('package.json'),
    readText('demo/Bergen-Course-Packager-Demo.html'),
  ]);
  const manifest = JSON.parse(manifestSource);
  const packageJson = JSON.parse(packageSource);
  const applicationSource = [code, index, script, styles].join('\n');
  const expectedDemo = index
    .replace("<?!= include('Styles'); ?>", () => styles)
    .replace("<?!= include('Script'); ?>", () => script)
    .replace('<base target="_top">', '<!-- Self-contained offline presentation fallback -->');

  assert.equal(manifest.runtimeVersion, 'V8');
  assert.equal('dependencies' in packageJson, false);
  assert.equal('devDependencies' in packageJson, false);
  assert.match(code, /HtmlService\.createTemplateFromFile\(['"]Index['"]\)/);
  assert.doesNotMatch(code, /doPost|PropertiesService|DriveApp|UrlFetchApp|Jdbc|CacheService/);
  assert.doesNotMatch(applicationSource, /google\.script\.run|\bfetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon|localStorage|sessionStorage|indexedDB|document\.cookie/i);
  assert.doesNotMatch(applicationSource, /location\.(?:href|search|hash)|URLSearchParams|<script[^>]+src=|<link[^>]+stylesheet/i);
  assert.equal(demo, expectedDemo, 'the committed demo must exactly match the deterministic source composition');
  assert.match(script, /createObjectURL/);
  assert.match(script, /application\/vnd\.ims\.imsccv1p3/);
  assert.match(readme, /course content.+active browser session/is);
  assert.match(readme, /static HTML/i);
  assert.match(readme, /authorized unpublished Canvas sandbox/i);
  assert.match(readme, /does not prove.+Bergen Canvas compatibility/is);
  assert.match(readme, /manual import.+review.+publication/is);
  assert.doesNotMatch(readme, /automatically (?:imports|publishes)|Canvas API/i);
});

test('Course Packager page exposes exact accessible actions, responsive layout, privacy gate, and honest success boundary', async () => {
  const [index, styles, script] = await Promise.all([
    readText('apps/course-packager/Index.html'),
    readText('apps/course-packager/Styles.html'),
    readText('apps/course-packager/Script.html'),
  ]);

  assert.match(index, /<html lang="en">/);
  assert.match(index, /<meta name="viewport"/);
  assert.match(index, /<label for="transfer-block">Bergen Course Transfer Block<\/label>/);
  assert.match(index, /id="privacy-confirmation"[^>]+type="checkbox"|type="checkbox"[^>]+id="privacy-confirmation"/);
  assert.match(index, /no student-identifying or protected information/i);
  assert.match(index, /id="download-imscc"[^>]*disabled[^>]*>Download \.imscc<\/button>/);
  assert.match(index, /role="status"/);
  assert.match(index, /aria-live="polite"/);
  assert.match(styles, /@media\s*\([^)]*max-width/i);
  assert.match(script, /Course package ready/);
  assert.match(script, /unpublished Canvas sandbox/i);
  assert.match(script, /A local package is not proof of Bergen Canvas compatibility/i);
  assert.doesNotMatch(script, /Canvas (?:course )?(?:created|imported|published)|Bergen Canvas compatible/i);
});
