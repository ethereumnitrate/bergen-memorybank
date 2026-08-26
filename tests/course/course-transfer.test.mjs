import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const repositoryFile = (relativePath) => new URL(`../../${relativePath}`, import.meta.url);

async function readJson(relativePath) {
  let source;
  try {
    source = await readFile(repositoryFile(relativePath), 'utf8');
  } catch (error) {
    assert.fail(`Expected Phase 1 course contract artifact ${relativePath}: ${error.message}`);
  }

  try {
    return { source, value: JSON.parse(source) };
  } catch (error) {
    assert.fail(`Expected valid JSON in ${relativePath}: ${error.message}`);
  }
}

const contentCollections = ['pages', 'assignments', 'discussions', 'rubrics', 'quizzes', 'exams'];

test('course-transfer schema and CIS-277 fixture align on version, strict privacy, and complete required categories', async () => {
  const { value: schema } = await readJson('src/contracts/bergen-course-transfer-v0.1.json');
  const { value: fixture } = await readJson('tests/fixtures/sample-course-transfer.json');
  const requiredTopLevel = [
    'format',
    'version',
    'metadata',
    'privacy',
    'course',
    'modules',
    ...contentCollections,
    'completionRules',
    'references',
  ];

  assert.equal(schema.$schema, 'https://json-schema.org/draft/2020-12/schema');
  assert.equal(schema.$id, 'https://bergen.edu/bergen-memory-bank/contracts/bergen-course-transfer-v0.1.schema.json');
  assert.equal(schema.type, 'object');
  assert.equal(schema.additionalProperties, false);
  assert.deepEqual(schema.required, requiredTopLevel);
  assert.equal(schema.properties.format.const, 'bergen-course-transfer');
  assert.equal(schema.properties.version.const, '0.1');
  assert.equal(schema.properties.privacy.properties.containsProtectedInformation.const, false);
  assert.equal(schema.properties.privacy.properties.containsIdentifiableStudentInformation.const, false);
  assert.equal(schema.properties.privacy.properties.containsCredentials.const, false);
  assert.equal(schema.properties.privacy.properties.containsRawStudentWork.const, false);
  assert.equal(schema.properties.course.properties.published.const, false);
  for (const collection of ['modules', ...contentCollections, 'completionRules', 'references']) {
    assert.equal(schema.properties[collection].type, 'array', `${collection} must be an array contract`);
    assert.ok(schema.properties[collection].minItems >= 1, `${collection} must require complete linked content`);
  }

  assert.equal(fixture.format, schema.properties.format.const);
  assert.equal(fixture.version, schema.properties.version.const);
  assert.deepEqual(Object.keys(fixture), requiredTopLevel);
  assert.equal(fixture.metadata.courseCode, 'CIS-277');
  assert.equal(fixture.metadata.dataClassification, 'synthetic/de-identified');
  assert.equal(fixture.metadata.containsRealStudentData, false);
  assert.equal(fixture.privacy.inputDerived, true);
  assert.equal(fixture.course.published, false);
  assert.ok(fixture.modules.length >= 2);
  for (const collection of contentCollections) {
    assert.ok(fixture[collection].length >= 1, `${collection} must be represented`);
  }
});

test('synthetic course fixture is unpublished, internally linked, ordered, and free of protected-record signals', async () => {
  const { source, value: fixture } = await readJson('tests/fixtures/sample-course-transfer.json');
  const moduleIds = new Set(fixture.modules.map(({ id }) => id));
  const rubricIds = new Set(fixture.rubrics.map(({ id }) => id));
  const completionRuleIds = new Set(fixture.completionRules.map(({ id }) => id));
  const moduleItemRefs = new Map(fixture.modules.map((module) => [
    module.id,
    new Set(module.items.map(({ ref }) => ref)),
  ]));
  const ids = new Set([
    ...fixture.modules,
    ...contentCollections.flatMap((collection) => fixture[collection]),
    ...fixture.completionRules,
  ].map(({ id }) => id));

  assert.equal(ids.size, fixture.modules.length
    + contentCollections.reduce((count, collection) => count + fixture[collection].length, 0)
    + fixture.completionRules.length, 'all identifiers must be unique');
  assert.deepEqual(fixture.modules.map(({ position }) => position), fixture.modules.map((_, index) => index + 1));
  for (const module of fixture.modules) {
    assert.equal(module.published, false);
    assert.deepEqual(module.items.map(({ position }) => position), module.items.map((_, index) => index + 1));
    for (const item of module.items) {
      assert.ok(ids.has(item.ref), `module item ${item.ref} must resolve`);
    }
    for (const completionRuleRef of module.completionRuleRefs) {
      assert.ok(completionRuleIds.has(completionRuleRef), `module completion rule ${completionRuleRef} must resolve`);
    }
  }
  for (const item of [...fixture.assignments, ...fixture.discussions]) {
    assert.ok(rubricIds.has(item.rubricRef), `${item.id} rubric ${item.rubricRef} must resolve`);
  }
  for (const completionRule of fixture.completionRules) {
    assert.ok(moduleIds.has(completionRule.moduleRef), `${completionRule.id} module ${completionRule.moduleRef} must resolve`);
    assert.ok(
      moduleItemRefs.get(completionRule.moduleRef)?.has(completionRule.itemRef),
      `${completionRule.id} item ${completionRule.itemRef} must resolve within ${completionRule.moduleRef}`,
    );
  }
  for (const collection of contentCollections) {
    for (const item of fixture[collection]) {
      assert.equal(item.published, false, `${item.id} must default unpublished`);
    }
  }
  for (const reference of fixture.references) {
    assert.ok(ids.has(reference.from), `reference source ${reference.from} must resolve`);
    assert.ok(ids.has(reference.to), `reference target ${reference.to} must resolve`);
  }
  assert.equal(fixture.privacy.containsProtectedInformation, false);
  assert.equal(fixture.privacy.containsIdentifiableStudentInformation, false);
  assert.equal(fixture.privacy.containsCredentials, false);
  assert.equal(fixture.privacy.containsRawStudentWork, false);
  assert.doesNotMatch(source, /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  assert.doesNotMatch(source, /student(Name|Id|Email)|individualGrade|accommodation|disability|healthRecord|disciplinaryRecord|password|accessToken|apiKey/i);
});
