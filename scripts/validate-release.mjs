import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const repositoryRoot = fileURLToPath(new URL('../', import.meta.url));
const allowedModes = new Set(['all', 'build', 'lint']);
const forbiddenFixtureFields = new Set([
  'studentName',
  'studentEmail',
  'studentId',
  'individualGrade',
  'accommodation',
  'disability',
  'healthRecord',
  'disciplinaryRecord',
]);

function repositoryPath(relativePath) {
  return path.join(repositoryRoot, ...relativePath.split('/'));
}

async function readRepositoryFile(relativePath) {
  return readFile(repositoryPath(relativePath), 'utf8');
}

async function exists(relativePath) {
  try {
    await access(repositoryPath(relativePath));
    return true;
  } catch {
    return false;
  }
}

function parseMode(argumentsList) {
  const modeIndex = argumentsList.indexOf('--mode');
  assert.notEqual(modeIndex, -1, 'Usage: node scripts/validate-release.mjs --mode <all|build|lint>');
  const mode = argumentsList[modeIndex + 1];
  assert.ok(allowedModes.has(mode), `Unsupported validation mode: ${mode ?? '(missing)'}`);
  assert.equal(argumentsList.length, 2, 'Only the --mode argument is supported');
  return mode;
}

function parseInventory(releaseContract) {
  return [...releaseContract.matchAll(/^\|\s*`([^`]+)`\s*\|\s*(Ready|Pending)\s*\|\s*(\d)\s*\|/gm)]
    .map(([, artifact, status, phase]) => ({ artifact, status, phase: Number(phase) }));
}

function findForbiddenFixtureFields(value, location = '$') {
  if (Array.isArray(value)) {
    return value.flatMap((entry, index) => findForbiddenFixtureFields(entry, `${location}[${index}]`));
  }
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, entry]) => [
      ...(forbiddenFixtureFields.has(key) ? [`${location}.${key}`] : []),
      ...findForbiddenFixtureFields(entry, `${location}.${key}`),
    ]);
  }
  return [];
}

async function validateBuild() {
  const releaseContract = await readRepositoryFile('src/release/release-contract.md');
  const inventory = parseInventory(releaseContract);
  assert.equal(inventory.length, 45, 'Release inventory must contain exactly 45 v1.0 artifacts');
  assert.equal(new Set(inventory.map(({ artifact }) => artifact)).size, inventory.length, 'Release inventory paths must be unique');

  for (const { artifact, status } of inventory) {
    const artifactExists = await exists(artifact);
    assert.equal(artifactExists, status === 'Ready', `${artifact} must be ${status === 'Ready' ? 'present' : 'absent'} for its declared release status`);
  }

  const version = await readRepositoryFile('src/release/version.md');
  assert.match(version, /^# Bergen Memory Bank v1\.0$/m);
  assert.match(version, /2026-08-04/);

  const sourceRegister = await readRepositoryFile('src/sources/authoritative-source-register.md');
  const datedSourceRows = [...sourceRegister.matchAll(/^\|\s*\[[^\]]+\]\(https:\/\/[^)]+\)\s*\|\s*2026-08-04\s*\|\s*(?:Primary|Official)\s*\|/gm)];
  assert.equal(datedSourceRows.length, 13, 'Source register must contain 13 dated official-source entries');
}

async function validateLint() {
  const releaseContract = await readRepositoryFile('src/release/release-contract.md');
  const inventory = parseInventory(releaseContract);
  const readyTextFiles = inventory
    .filter(({ artifact, status }) => status === 'Ready' && /\.(?:json|md|mjs)$/.test(artifact))
    .map(({ artifact }) => artifact);

  for (const relativePath of readyTextFiles) {
    const source = await readRepositoryFile(relativePath);
    assert.doesNotMatch(source, /\t/, `${relativePath} must not contain tab characters`);
    assert.doesNotMatch(source, /[ \t]+$/m, `${relativePath} must not contain trailing whitespace`);
  }

  for (const relativePath of ['tests/fixtures/workflow-scenarios.json', 'tests/fixtures/sample-quiz.json']) {
    const source = await readRepositoryFile(relativePath);
    const fixture = JSON.parse(source);
    assert.equal(fixture.metadata.dataClassification, 'synthetic/de-identified');
    assert.equal(fixture.metadata.containsRealStudentData, false);
    assert.deepEqual(findForbiddenFixtureFields(fixture), [], `${relativePath} contains prohibited student-record fields`);
    assert.doesNotMatch(source, /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i, `${relativePath} must not contain an email address`);
  }

  const packageJson = JSON.parse(await readRepositoryFile('package.json'));
  assert.equal('dependencies' in packageJson, false);
  assert.equal('devDependencies' in packageJson, false);
}

function runFocusedTests() {
  const result = spawnSync(process.execPath, [
    '--test',
    'tests/content/release-structure.test.mjs',
    'tests/content/source-register.test.mjs',
    'tests/content/gem-workflows.test.mjs',
    'tests/content/template-contracts.test.mjs',
  ], {
    cwd: repositoryRoot,
    encoding: 'utf8',
  });

  process.stdout.write(result.stdout);
  process.stderr.write(result.stderr);
  assert.equal(result.status, 0, 'Focused tests for completed phases must pass');
}

async function main() {
  const mode = parseMode(process.argv.slice(2));

  if (mode === 'lint' || mode === 'all') {
    await validateLint();
    process.stdout.write('Release lint validation passed.\n');
  }
  if (mode === 'build' || mode === 'all') {
    await validateBuild();
    process.stdout.write('Release contract validation passed.\n');
  }
  if (mode === 'all') {
    runFocusedTests();
  }
}

main().catch((error) => {
  process.stderr.write(`Validation failed: ${error.message}\n`);
  process.exitCode = 1;
});
