import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import vm from 'node:vm';

const repositoryRoot = new URL('../', import.meta.url);

const [index, styles, script, cis277Source, eng102Source] = await Promise.all([
  readFile(new URL('apps/course-packager/Index.html', repositoryRoot), 'utf8'),
  readFile(new URL('apps/course-packager/Styles.html', repositoryRoot), 'utf8'),
  readFile(new URL('apps/course-packager/Script.html', repositoryRoot), 'utf8'),
  readFile(new URL('tests/fixtures/sample-course-transfer.json', repositoryRoot), 'utf8'),
  readFile(new URL('tests/fixtures/sample-course-transfer-eng-102.json', repositoryRoot), 'utf8'),
]);

const coreMatch = script.match(/\/\* BERGEN_COURSE_CORE_START \*\/([\s\S]*?)\/\* BERGEN_COURSE_CORE_END \*\//);
assert.ok(coreMatch, 'Script.html must contain the bounded browser-only course core');
const context = { TextEncoder, Uint8Array, DataView, ArrayBuffer, structuredClone };
vm.runInNewContext(`${coreMatch[1]}\nglobalThis.__bergenCoursePackager = BergenCoursePackager;`, context);

const cis277 = JSON.parse(cis277Source);
const eng102 = JSON.parse(eng102Source);
const first = context.__bergenCoursePackager.buildCoursePackage(cis277);
const second = context.__bergenCoursePackager.buildCoursePackage(structuredClone(cis277));
const different = context.__bergenCoursePackager.buildCoursePackage(eng102);
assert.deepEqual(Array.from(first.bytes), Array.from(second.bytes), 'course output must be byte-stable');
assert.notDeepEqual(Array.from(first.bytes), Array.from(different.bytes), 'different approved courses must produce different packages');
assert.equal(first.fileName, 'cis-277-course.imscc');

const demo = index
  .replace("<?!= include('Styles'); ?>", () => styles)
  .replace("<?!= include('Script'); ?>", () => script)
  .replace('<base target="_top">', '<!-- Self-contained offline presentation fallback -->');
assert.doesNotMatch(demo, /<script[^>]+src=|<link[^>]+stylesheet/i, 'demo must remain self-contained');
assert.doesNotMatch(demo, /<\?!=/, 'all Apps Script includes must be resolved');
assert.doesNotMatch(demo, /bergen-course-transfer[\s\S]+CIS-277/i, 'the demo must not embed a course fixture');

const outputDirectory = new URL('demo/', repositoryRoot);
await mkdir(outputDirectory, { recursive: true });
await writeFile(new URL('Bergen-Course-Packager-Demo.html', outputDirectory), demo, 'utf8');

process.stdout.write('Built the self-contained Bergen Course Packager demo; validation fixtures remain external.\n');
