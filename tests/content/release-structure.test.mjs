import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

const repositoryFile = (relativePath) => new URL(`../../${relativePath}`, import.meta.url);

async function readText(relativePath) {
  try {
    return await readFile(repositoryFile(relativePath), 'utf8');
  } catch (error) {
    assert.fail(`Expected ready release artifact ${relativePath} to exist: ${error.message}`);
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
  ['src/gem/bergen-memory-bank-instructions.md', { status: 'Ready', phase: 2 }],
  ['tests/content/gem-workflows.test.mjs', { status: 'Ready', phase: 2 }],
  ['src/templates/faculty-profile.md', { status: 'Ready', phase: 3 }],
  ['src/templates/course-memory.md', { status: 'Ready', phase: 3 }],
  ['src/templates/active-workbench.md', { status: 'Ready', phase: 3 }],
  ['src/templates/decisions-reflections-reusable-practices.md', { status: 'Ready', phase: 3 }],
  ['src/templates/class-learning-snapshot.md', { status: 'Ready', phase: 3 }],
  ['dist/google-docs/Bergen Memory Bank - Faculty Profile.docx', { status: 'Ready', phase: 3 }],
  ['dist/google-docs/Bergen Memory Bank - Course Memory.docx', { status: 'Ready', phase: 3 }],
  ['dist/google-docs/Bergen Memory Bank - Active Workbench.docx', { status: 'Ready', phase: 3 }],
  ['dist/google-docs/Bergen Memory Bank - Decisions Reflections and Reusable Practices.docx', { status: 'Ready', phase: 3 }],
  ['scripts/build-google-docs.mjs', { status: 'Ready', phase: 3 }],
  ['tests/content/template-contracts.test.mjs', { status: 'Ready', phase: 3 }],
  ['src/guides/command-reference.md', { status: 'Ready', phase: 4 }],
  ['src/guides/installation-guide.md', { status: 'Ready', phase: 4 }],
  ['src/guides/faculty-quick-start.md', { status: 'Ready', phase: 4 }],
  ['src/guides/presentation-script.md', { status: 'Ready', phase: 4 }],
  ['src/guides/sample-prompts.md', { status: 'Ready', phase: 4 }],
  ['src/guides/end-to-end-demonstration.md', { status: 'Ready', phase: 4 }],
  ['src/guides/privacy-checklist.md', { status: 'Ready', phase: 4 }],
  ['src/guides/troubleshooting.md', { status: 'Ready', phase: 4 }],
  ['src/guides/qti-canvas-handoff.md', { status: 'Ready', phase: 4 }],
  ['tests/content/guide-alignment.test.mjs', { status: 'Ready', phase: 4 }],
  ['apps/qti-packager/Code.gs', { status: 'Ready', phase: 5 }],
  ['apps/qti-packager/Index.html', { status: 'Ready', phase: 5 }],
  ['apps/qti-packager/Styles.html', { status: 'Ready', phase: 5 }],
  ['apps/qti-packager/Script.html', { status: 'Ready', phase: 5 }],
  ['apps/qti-packager/appsscript.json', { status: 'Ready', phase: 5 }],
  ['apps/qti-packager/README.md', { status: 'Ready', phase: 5 }],
  ['demo/Bergen-QTI-Packager-Demo.html', { status: 'Ready', phase: 5 }],
  ['demo/bergen-qti-compatibility-check-qti.zip', { status: 'Ready', phase: 5 }],
  ['scripts/build-qti-demo.mjs', { status: 'Ready', phase: 5 }],
  ['tests/qti/qti-packager.test.mjs', { status: 'Ready', phase: 5 }],
  ['tests/qti/apps-script-bundle.test.mjs', { status: 'Ready', phase: 5 }],
  ['tests/qti/browser-smoke.mjs', { status: 'Ready', phase: 5 }],
]);

test('repository scripts provide dependency-free test, build, lint, and aggregate validation', async () => {
  const packageJson = await readJson('package.json');

  assert.deepEqual(packageJson.scripts, {
    test: 'node --test tests/content/release-structure.test.mjs tests/content/source-register.test.mjs tests/keep/memory-contract.test.mjs tests/course/course-transfer.test.mjs tests/course/common-cartridge.test.mjs tests/course/apps-script-bundle.test.mjs tests/course/browser-smoke.mjs tests/content/gem-workflows.test.mjs tests/content/template-contracts.test.mjs tests/content/guide-alignment.test.mjs tests/qti/qti-packager.test.mjs tests/qti/apps-script-bundle.test.mjs tests/qti/browser-smoke.mjs',
    'build:google-docs': 'node scripts/build-google-docs.mjs',
    'build:qti-demo': 'node scripts/build-qti-demo.mjs',
    'build:course-demo': 'node scripts/build-course-demo.mjs',
    build: 'node scripts/validate-release.mjs --mode build',
    lint: 'node scripts/validate-release.mjs --mode lint',
    validate: 'node scripts/validate-release.mjs --mode all',
  });
  assert.equal(packageJson.private, true);
  assert.equal(packageJson.type, 'module');
  assert.equal('dependencies' in packageJson, false);
  assert.equal('devDependencies' in packageJson, false);
});

test('release version preserves the v1.0 baseline and its 2026-08-04 source review', async () => {
  const version = await readText('src/release/version.md');

  assert.match(version, /\*\*Baseline release identifier\*\*: `Bergen Memory Bank v1\.0`/);
  assert.match(version, /\*\*Baseline source review date\*\*: `2026-08-04`/);
  assert.match(version, /v1\.0 QTI Packager remains available/i);
  assert.match(version, /Canvas compatibility gate remains manual and unapproved/i);
});

test('release contract inventories every v1.0 artifact and keeps manual evidence distinct', async () => {
  const releaseContract = await readText('src/release/release-contract.md');
  const v1Inventory = (releaseContract.split('## Complete v1.0 artifact inventory')[1] ?? '')
    .split('## Bergen Memory Bank v2 inventory')[0];
  const rows = [...v1Inventory.matchAll(/^\|\s*`([^`]+)`\s*\|\s*(Ready|Pending)\s*\|\s*(\d)\s*\|/gm)];
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
  assert.equal(sampleQuiz.format, 'bergen-qti-transfer');
  assert.equal(sampleQuiz.version, '0.1');
  assert.equal(sampleQuiz.quiz.questions.length, 5, 'quiz fixture must exercise every supported item type');
  for (const fieldName of forbiddenFieldNames) {
    assert.equal(serializedFixtures.includes(`\"${fieldName}\"`), false, `${fieldName} must not appear in fixtures`);
  }
  assert.doesNotMatch(serializedFixtures, /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
});

test('v2 Phase 6 identifies repository readiness without overstating external acceptance', async () => {
  const version = await readText('src/release/version.md');
  const releaseContract = await readText('src/release/release-contract.md');
  const packageJson = await readJson('package.json');
  const v2Inventory = releaseContract.split('## Bergen Memory Bank v2 inventory')[1] ?? '';
  const rows = [...v2Inventory.matchAll(/^\|\s*`([^`]+)`\s*\|\s*(Ready|Pending)\s*\|\s*(\d)\s*\|/gm)];
  const inventory = new Map(rows.map(([, artifact, status, phase]) => [artifact, {
    status,
    phase: Number(phase),
  }]));
  const requiredV2Artifacts = new Map([
    ['src/contracts/bergen-memory-v2.md', { status: 'Ready', phase: 1 }],
    ['src/contracts/bergen-course-transfer-v0.1.json', { status: 'Ready', phase: 1 }],
    ['tests/fixtures/sample-course-transfer.json', { status: 'Ready', phase: 1 }],
    ['tests/keep/memory-contract.test.mjs', { status: 'Ready', phase: 1 }],
    ['tests/course/course-transfer.test.mjs', { status: 'Ready', phase: 1 }],
    ['src/gem/bergen-memory-bank-instructions.md', { status: 'Ready', phase: 2 }],
    ['src/guides/keep-memory-workflow.md', { status: 'Ready', phase: 3 }],
    ['src/guides/canvas-course-handoff.md', { status: 'Ready', phase: 6 }],
    ['apps/course-packager/Script.html', { status: 'Ready', phase: 5 }],
    ['scripts/build-course-demo.mjs', { status: 'Ready', phase: 5 }],
    ['tests/course/common-cartridge.test.mjs', { status: 'Ready', phase: 5 }],
    ['tests/course/apps-script-bundle.test.mjs', { status: 'Ready', phase: 5 }],
    ['tests/course/browser-smoke.mjs', { status: 'Ready', phase: 5 }],
  ]);

  assert.match(version, /^# Bergen Memory Bank v2\.0 development$/m);
  assert.match(version, /\*\*Release identifier\*\*: `Bergen Memory Bank v2\.0 Phase 6 repository candidate`/);
  assert.match(version, /\*\*Source review date\*\*: `2026-08-26`/);
  assert.match(version, /v1\.0 QTI Packager remains available/i);
  assert.match(version, /classic Gem and connected Google Keep acceptance gate is \*\*Pending\*\*/i);
  assert.match(version, /unpublished Canvas sandbox acceptance gate is \*\*Pending\*\*/i);
  assert.match(releaseContract, /aggregate repository gate/i);
  assert.match(releaseContract, /Classic Gem and connected Google Keep\s*\|\s*Pending/i);
  assert.deepEqual(inventory, requiredV2Artifacts);
  assert.equal(packageJson.version, '2.0.0-dev.1');
  assert.match(packageJson.scripts.test, /tests\/keep\/memory-contract\.test\.mjs/);
  assert.match(packageJson.scripts.test, /tests\/course\/course-transfer\.test\.mjs/);
});

test('v2 Phase 6 release evidence distinguishes local readiness from pending authorized acceptance', async () => {
  const [version, releaseContract, scenarioMatrix, validator] = await Promise.all([
    readText('src/release/version.md'),
    readText('src/release/release-contract.md'),
    readText('src/testing/scenario-matrix.md'),
    readText('scripts/validate-release.mjs'),
  ]);
  const v2Inventory = releaseContract.split('## Bergen Memory Bank v2 inventory')[1] ?? '';
  const inventoryRows = [...v2Inventory.matchAll(/^\|\s*`([^`]+)`\s*\|\s*(Ready|Pending)\s*\|\s*(\d)\s*\|/gm)];
  const releaseEvidence = releaseContract.split('## Phase 6 acceptance evidence')[1] ?? '';

  assert.match(version, /Bergen Memory Bank v2\.0 Phase 6 repository candidate/i);
  assert.match(version, /Phases 1 through 6 repository-verifiable work complete/i);
  assert.match(version, /authorized classic Gem and connected Google Keep.+Pending/is);
  assert.match(version, /authorized unpublished Canvas sandbox.+Pending/is);
  assert.equal(inventoryRows.length, 13);
  assert.ok(inventoryRows.every(([, , status]) => status === 'Ready'),
    'all implemented v2 repository artifacts must be Ready');

  assert.match(releaseEvidence, /Aggregate repository verification\s*\|\s*Ready/i);
  assert.match(releaseEvidence, /Classic Gem and connected Google Keep\s*\|\s*Pending/i);
  assert.match(releaseEvidence, /create.+exact-title retrieval.+full-content comparison.+report/is);
  assert.match(releaseEvidence, /Unpublished Canvas sandbox\s*\|\s*Pending/i);
  assert.match(releaseEvidence, /Common Cartridge 1\.x Package.+import job.+Completed.+Modules.+unpublished/is);
  assert.doesNotMatch(releaseEvidence, /(?:Gem|Keep|Canvas)[^\n|]*\|\s*Ready/i,
    'external services must not be marked Ready without authorized evidence');

  assert.match(scenarioMatrix, /Verification purpose through Phase 6/i);
  assert.match(scenarioMatrix, /Gemini.+Keep.+Course Packager.+unpublished Canvas sandbox/is);
  for (const criterion of [
    'AC-ENTRY-1',
    'AC-HAPPY-1',
    'AC-HAPPY-2',
    'AC-HAPPY-3',
    'AC-HAPPY-4',
    'AC-HAPPY-5',
    'AC-HAPPY-6',
    'AC-HAPPY-7',
    'AC-ERROR-1',
    'AC-ERROR-2',
    'AC-ERROR-3',
    'AC-ERROR-4',
    'AC-ASYNC-1',
  ]) assert.match(scenarioMatrix, new RegExp(criterion));
  assert.match(validator, /tests\/content\/guide-alignment\.test\.mjs/);
  assert.match(validator, /tests\/course\/common-cartridge\.test\.mjs/);
  assert.match(validator, /tests\/qti\/qti-packager\.test\.mjs/);
});
