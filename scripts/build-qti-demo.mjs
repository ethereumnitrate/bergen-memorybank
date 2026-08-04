import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import vm from 'node:vm';

const repositoryRoot = new URL('../', import.meta.url);

const [index, styles, script, fixtureSource] = await Promise.all([
  readFile(new URL('apps/qti-packager/Index.html', repositoryRoot), 'utf8'),
  readFile(new URL('apps/qti-packager/Styles.html', repositoryRoot), 'utf8'),
  readFile(new URL('apps/qti-packager/Script.html', repositoryRoot), 'utf8'),
  readFile(new URL('tests/fixtures/sample-quiz.json', repositoryRoot), 'utf8'),
]);

const fixture = JSON.parse(fixtureSource);
const sampleMatch = script.match(/const BERGEN_SAFE_SAMPLE = ([\s\S]*?);\n\nconst BergenQtiApp/);
assert.ok(sampleMatch, 'Script.html must contain the embedded safe sample');
const embeddedSample = JSON.parse(sampleMatch[1]);
assert.equal(embeddedSample.format, fixture.format, 'embedded sample format must match the fixture');
assert.equal(embeddedSample.version, fixture.version, 'embedded sample version must match the fixture');
assert.deepEqual(embeddedSample.quiz, fixture.quiz, 'embedded sample quiz must match the synthetic fixture');

const coreMatch = script.match(/\/\* BERGEN_QTI_CORE_START \*\/([\s\S]*?)\/\* BERGEN_QTI_CORE_END \*\//);
assert.ok(coreMatch, 'Script.html must contain the bounded QTI core');
const context = { TextEncoder, Uint8Array, DataView, ArrayBuffer };
vm.runInNewContext(`${coreMatch[1]}\nglobalThis.__bergenQti = BergenQti;`, context);
const packageResult = context.__bergenQti.buildQtiPackage(fixture);
assert.equal(packageResult.fileName, 'bergen-qti-compatibility-check-qti.zip');

const demo = index
  .replace("<?!= include('Styles'); ?>", styles)
  .replace("<?!= include('Script'); ?>", script)
  .replace('<base target="_top">', '<!-- Self-contained offline presentation fallback -->');
assert.doesNotMatch(demo, /<script[^>]+src=|<link[^>]+stylesheet/i, 'demo must remain self-contained');
assert.doesNotMatch(demo, /<\?!=/, 'all Apps Script includes must be resolved');

const outputDirectory = new URL('demo/', repositoryRoot);
await mkdir(outputDirectory, { recursive: true });
await Promise.all([
  writeFile(new URL('Bergen-QTI-Packager-Demo.html', outputDirectory), demo, 'utf8'),
  writeFile(new URL(packageResult.fileName, outputDirectory), packageResult.bytes),
]);

process.stdout.write('Built the self-contained QTI demo and synthetic compatibility ZIP.\n');
