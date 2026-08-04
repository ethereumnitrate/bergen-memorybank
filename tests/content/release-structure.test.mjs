import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

const repositoryFile = (relativePath) => new URL(`../../${relativePath}`, import.meta.url);

async function readText(relativePath) {
  try {
    return await readFile(repositoryFile(relativePath), 'utf8');
  } catch (error) {
    assert.fail(`Expected Phase 1 artifact ${relativePath} to exist: ${error.message}`);
  }
}

async function readJson(relativePath) {
  const source = await readText(relativePath);

  try {
    return JSON.parse(source);
  } catch (error) {
    assert.fail(`Expected ${relativePath} to contain valid JSON: ${error.message}`);
  }
}

async function pathExists(relativePath) {
  try {
    await access(repositoryFile(relativePath));
    return true;
  } catch {
    return false;
  }
}

const expectedInventory = new Map([
  ['package.json', { status: 'Ready', phase: 1 }],
  ['src/release/release-contract.md', { status: 'Ready', phase: 1 }],
  ['src/release/version.md', { status: 'Ready', phase: 1 }],
  ['src/sources/authoritative-source-register.md', { status: 'Ready', phase: 1 }],
  ['src/testing/scenario-matrix.md', { status: 'Ready', phase: 1 }],
  ['scripts/validate-release.mjs', { status: 'Ready', phase: 1 }],
  ['tests/content/release-structure.test.mjs', { status: 'Ready', phase: 1 }],
  ['tests/content/source-register.test.mjs', { status: 'Ready', phase: 1 }],
  ['tests/fixtures/workflow-scenarios.json', { status: 'Ready', phase: 1 }],
  ['tests/fixtures/sample-quiz.json', { status: 'Ready', phase: 1 }],
  ['src/gem/bergen-memory-bank-instructions.md', { status: 'Pending', phase: 2 }],
  ['tests/content/gem-workflows.test.mjs', { status: 'Pending', phase: 2 }],
  ['src/templates/faculty-profile.md', { status: 'Pending', phase: 3 }],
  ['src/templates/course-memory.md', { status: 'Pending', phase: 3 }],
  ['src/templates/active-workbench.md', { status: 'Pending', phase: 3 }],
  ['src/templates/decisions-reflections-reusable-practices.md', { status: 'Pending', phase: 3 }],
  ['src/templates/class-learning-snapshot.md', { status: 'Pending', phase: 3 }],
  ['dist/google-docs/Bergen Memory Bank - Faculty Profile.docx', { status: 'Pending', phase: 3 }],
  ['dist/google-docs/Bergen Memory Bank - Course Memory.docx', { status: 'Pending', phase: 3 }],
  ['dist/google-docs/Bergen Memory Bank - Active Workbench.docx', { status: 'Pending', phase: 3 }],
  ['dist/google-docs/Bergen Memory Bank - Decisions Reflections and Reusable Practices.docx', { status: 'Pending', phase: 3 }],
  ['scripts/build-google-docs.mjs', { status: 'Pending', phase: 3 }],
  ['tests/content/template-contracts.test.mjs', { status: 'Pending', phase: 3 }],
  ['src/guides/command-reference.md', { status: 'Pending', phase: 4 }],
  ['src/guides/installation-guide.md', { status: 'Pending', phase: 4 }],
  ['src/guides/faculty-quick-start.md', { status: 'Pending', phase: 4 }],
  ['src/guides/presentation-script.md', { status: 'Pending', phase: 4 }],
  ['src/guides/sample-prompts.md', { status: 'Pending', phase: 4 }],
  ['src/guides/end-to-end-demonstration.md', { status: 'Pending', phase: 4 }],
  ['src/guides/privacy-checklist.md', { status: 'Pending', phase: 4 }],
  ['src/guides/troubleshooting.md', { status: 'Pending', phase: 4 }],
  ['src/guides/qti-canvas-handoff.md', { status: 'Pending', phase: 4 }],
  ['tests/content/guide-alignment.test.mjs', { status: 'Pending', phase: 4 }],
  ['apps/qti-packager/Code.gs', { status: 'Pending', phase: 5 }],
  ['apps/qti-packager/Index.html', { status: 'Pending', phase: 5 }],
  ['apps/qti-packager/Styles.html', { status: 'Pending', phase: 5 }],
  ['apps/qti-packager/Script.html', { status: 'Pending', phase: 5 }],
  ['apps/qti-packager/appsscript.json', { status: 'Pending', phase: 5 }],
  ['apps/qti-packager/README.md', { status: 'Pending', phase: 5 }],
  ['demo/Bergen-QTI-Packager-Demo.html', { status: 'Pending', phase: 5 }],
  ['demo/bergen-qti-compatibility-check-qti.zip', { status: 'Pending', phase: 5 }],
  ['scripts/build-qti-demo.mjs', { status: 'Pending', phase: 5 }],
  ['tests/qti/qti-packager.test.mjs', { status: 'Pending', phase: 5 }],
  ['tests/qti/apps-script-bundle.test.mjs', { status: 'Pending', phase: 5 }],
  ['tests/qti/browser-smoke.mjs', { status: 'Pending', phase: 5 }],
]);

test('repository scripts provide dependency-free test, build, lint, and aggregate validation', async () => {
  const packageJson = await readJson('package.json');

  assert.deepEqual(packageJson.scripts, {
    test: 'node --test tests/content/release-structure.test.mjs tests/content/source-register.test.mjs',
    build: 'node scripts/validate-release.mjs --mode build',
    lint: 'node scripts/validate-release.mjs --mode lint',
    validate: 'node scripts/validate-release.mjs --mode all',
  });
  assert.equal(packageJson.private, true);
  assert.equal(packageJson.type, 'module');
  assert.equal('dependencies' in packageJson, false);
  assert.equal('devDependencies' in packageJson, false);
});

test('release version identifies Bergen Memory Bank v1.0 and the 2026-08-04 source review', async () => {
  const version = await readText('src/release/version.md');

  assert.match(version, /^# Bergen Memory Bank v1\.0$/m);
  assert.match(version, /\*\*Release identifier\*\*: `Bergen Memory Bank v1\.0`/);
  assert.match(version, /\*\*Source review date\*\*: `2026-08-04`/);
  assert.match(version, /QTI compatibility remains pending/i);
});

test('release contract inventories every v1.0 artifact and keeps later phases pending', async () => {
  const releaseContract = await readText('src/release/release-contract.md');
  const rows = [...releaseContract.matchAll(/^\|\s*`([^`]+)`\s*\|\s*(Ready|Pending)\s*\|\s*(\d)\s*\|/gm)];
  const actualInventory = new Map(rows.map(([, artifact, status, phase]) => [artifact, {
    status,
    phase: Number(phase),
  }]));

  assert.equal(rows.length, expectedInventory.size, 'inventory must contain one row per v1.0 artifact');
  assert.equal(actualInventory.size, expectedInventory.size, 'inventory must not contain duplicate artifact paths');
  assert.deepEqual(actualInventory, expectedInventory);

  for (const [artifact, entry] of expectedInventory) {
    if (entry.status === 'Pending') {
      assert.equal(await pathExists(artifact), false, `${artifact} belongs to a later phase and must not exist yet`);
    }
  }
});

test('foundation fixtures are explicitly synthetic and contain no student-record fields', async () => {
  const workflowScenarios = await readJson('tests/fixtures/workflow-scenarios.json');
  const sampleQuiz = await readJson('tests/fixtures/sample-quiz.json');
  const serializedFixtures = JSON.stringify({ workflowScenarios, sampleQuiz });
  const forbiddenFieldNames = [
    'studentName',
    'studentEmail',
    'studentId',
    'individualGrade',
    'accommodation',
    'disability',
    'healthRecord',
    'disciplinaryRecord',
  ];

  for (const fixture of [workflowScenarios, sampleQuiz]) {
    assert.equal(fixture.metadata.dataClassification, 'synthetic/de-identified');
    assert.equal(fixture.metadata.containsRealStudentData, false);
  }
  assert.ok(workflowScenarios.scenarios.length >= 4, 'workflow fixture should seed later safeguard scenarios');
  assert.ok(sampleQuiz.items.length >= 1, 'quiz fixture should seed later packaging checks');
  for (const fieldName of forbiddenFieldNames) {
    assert.equal(serializedFixtures.includes(`\"${fieldName}\"`), false, `${fieldName} must not appear in fixtures`);
  }
  assert.doesNotMatch(serializedFixtures, /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
});
