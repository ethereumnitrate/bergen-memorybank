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

async function loadCourseTransferValidator() {
  return import('../../src/contracts/bergen-course-transfer-validator.mjs');
}

function clone(value) {
  return structuredClone(value);
}

function compareCodePoints(left, right) {
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}

function assertInvalid(result, expectedErrors) {
  assert.equal(result.ok, false);
  assert.equal('value' in result, false, 'invalid input must not expose a partial course value');
  assert.ok(Array.isArray(result.errors) && result.errors.length > 0);
  assert.deepEqual(
    result.errors,
    [...result.errors].sort((left, right) => compareCodePoints(
      `${left.path}\u0000${left.code}\u0000${left.message}`,
      `${right.path}\u0000${right.code}\u0000${right.message}`,
    )),
    'validation errors must be deterministic',
  );
  for (const expected of expectedErrors) {
    assert.ok(
      result.errors.some(({ path, code }) => path === expected.path && code === expected.code),
      `expected ${expected.path} to report ${expected.code}; received ${JSON.stringify(result.errors)}`,
    );
  }
  assert.doesNotMatch(JSON.stringify(result), /Course package ready|packageReady|\.imscc/i);
}

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

test('validator accepts two complete, materially different, input-derived course designs', async () => {
  const { parseBergenCourseTransferBlock, validateBergenCourseTransfer } = await loadCourseTransferValidator();
  const { source: cis277Source, value: cis277 } = await readJson('tests/fixtures/sample-course-transfer.json');
  const { value: eng102 } = await readJson('tests/fixtures/sample-course-transfer-eng-102.json');

  const parsedCis277 = parseBergenCourseTransferBlock(cis277Source);
  const parsedFencedCis277 = parseBergenCourseTransferBlock(`\`\`\`json\n${cis277Source}\n\`\`\``);
  const cis277Result = validateBergenCourseTransfer(parsedCis277);
  const eng102Result = validateBergenCourseTransfer(eng102);

  assert.equal(cis277Result.ok, true, JSON.stringify(cis277Result.errors));
  assert.deepEqual(parsedFencedCis277, parsedCis277);
  assert.equal(eng102Result.ok, true, JSON.stringify(eng102Result.errors));
  assert.equal(cis277Result.value.metadata.courseCode, 'CIS-277');
  assert.equal(eng102Result.value.metadata.courseCode, 'ENG-102');
  assert.notEqual(cis277Result.value.course.title, eng102Result.value.course.title);
  assert.notDeepEqual(
    cis277Result.value.modules.flatMap(({ items }) => items.map(({ ref }) => ref)),
    eng102Result.value.modules.flatMap(({ items }) => items.map(({ ref }) => ref)),
  );
});

test('validator rejects malformed JSON, unsupported versions, and strict nested schema violations', async () => {
  const { validateBergenCourseTransfer } = await loadCourseTransferValidator();
  const { value: fixture } = await readJson('tests/fixtures/sample-course-transfer.json');
  const invalid = clone(fixture);
  invalid.unexpected = true;
  invalid.metadata.locale = 'english';
  invalid.course.credits = 13;
  invalid.pages[0].body = '   ';
  invalid.pages[0].unexpected = true;
  invalid.pages[1].body = '<a href="javascript:alert(1)">Unsafe link</a>';
  invalid.assignments[0].submissionType = 'email';

  assertInvalid(validateBergenCourseTransfer('{"format":'), [
    { path: '$', code: 'invalid_json' },
  ]);
  assertInvalid(validateBergenCourseTransfer({ ...fixture, version: '9.9' }), [
    { path: '$.version', code: 'unsupported_version' },
  ]);
  assertInvalid(validateBergenCourseTransfer(invalid), [
    { path: '$.unexpected', code: 'additional_property' },
    { path: '$.metadata.locale', code: 'pattern' },
    { path: '$.course.credits', code: 'maximum' },
    { path: '$.pages[0].body', code: 'blank_text' },
    { path: '$.pages[0].unexpected', code: 'additional_property' },
    { path: '$.pages[1].body', code: 'unsafe_markup' },
    { path: '$.assignments[0].submissionType', code: 'enum' },
  ]);
});

test('validator enforces unique deterministic module and item order with complete type-matched placement', async () => {
  const { validateBergenCourseTransfer } = await loadCourseTransferValidator();
  const { value: fixture } = await readJson('tests/fixtures/sample-course-transfer.json');
  const invalid = clone(fixture);
  invalid.modules[1].position = 1;
  invalid.modules[0].items[0].position = 2;
  invalid.modules[0].items[0].type = 'assignment';
  invalid.modules[1].items.push({ position: 4, type: 'page', ref: 'page-agent-boundaries' });

  assertInvalid(validateBergenCourseTransfer(invalid), [
    { path: '$.modules', code: 'position_sequence' },
    { path: '$.modules[0].items', code: 'position_sequence' },
    { path: '$.modules[0].items[0].type', code: 'reference_type_mismatch' },
    { path: '$.modules[1].items[3].ref', code: 'duplicate_module_item_ref' },
  ]);
});

test('validator checks page, assignment, discussion, and rubric semantics and point relationships', async () => {
  const { validateBergenCourseTransfer } = await loadCourseTransferValidator();
  const { value: fixture } = await readJson('tests/fixtures/sample-course-transfer.json');
  const invalid = clone(fixture);
  invalid.pages[0].title = '\t';
  invalid.assignments[0].rubricRef = 'rubric-missing';
  invalid.discussions[0].pointsPossible = 5;
  invalid.rubrics[1].criteria[1].id = invalid.rubrics[1].criteria[0].id;

  assertInvalid(validateBergenCourseTransfer(invalid), [
    { path: '$.pages[0].title', code: 'blank_text' },
    { path: '$.assignments[0].rubricRef', code: 'unresolved_reference' },
    { path: '$.discussions[0].pointsPossible', code: 'rubric_points_mismatch' },
    { path: '$.rubrics[1].criteria[1].id', code: 'duplicate_identifier' },
  ]);
});

test('validator enforces assessment question conditionals, answer indexes, and score consistency', async () => {
  const { validateBergenCourseTransfer } = await loadCourseTransferValidator();
  const { value: fixture } = await readJson('tests/fixtures/sample-course-transfer.json');
  const invalid = clone(fixture);
  invalid.quizzes[0].pointsPossible = 4;
  invalid.quizzes[0].questions[0].correctChoiceIndexes = [8];
  invalid.quizzes[0].questions[0].acceptedAnswers = ['uncontracted answer'];
  invalid.exams[0].questions[0].choices = ['A', 'B'];

  assertInvalid(validateBergenCourseTransfer(invalid), [
    { path: '$.quizzes[0].pointsPossible', code: 'question_points_mismatch' },
    { path: '$.quizzes[0].questions[0].correctChoiceIndexes[0]', code: 'choice_index_out_of_range' },
    { path: '$.quizzes[0].questions[0].acceptedAnswers', code: 'forbidden_question_field' },
    { path: '$.exams[0].questions[0].choices', code: 'forbidden_question_field' },
  ]);
});

test('validator enforces completion-rule membership and typed relationship integrity', async () => {
  const { validateBergenCourseTransfer } = await loadCourseTransferValidator();
  const { value: fixture } = await readJson('tests/fixtures/sample-course-transfer.json');
  const invalid = clone(fixture);
  invalid.completionRules[0].moduleRef = 'module-evaluation';
  delete invalid.completionRules[2].minimumScore;
  invalid.modules[0].completionRuleRefs.push('completion-missing');
  invalid.references[0].relation = 'uses-rubric';
  invalid.references = invalid.references.filter(({ from }) => from !== 'assignment-evaluation-plan');

  assertInvalid(validateBergenCourseTransfer(invalid), [
    { path: '$.completionRules[0].itemRef', code: 'completion_item_not_in_module' },
    { path: '$.completionRules[2].minimumScore', code: 'minimum_score_required' },
    { path: '$.modules[0].completionRuleRefs[2]', code: 'unresolved_reference' },
    { path: '$.references[0]', code: 'relationship_type_mismatch' },
    { path: '$.assignments[1].rubricRef', code: 'missing_relationship' },
  ]);
});

test('privacy signals short-circuit before JSON parsing or structural validation without echoing protected content', async () => {
  const { validateBergenCourseTransfer, parseBergenCourseTransferBlock } = await loadCourseTransferValidator();
  const { value: fixture } = await readJson('tests/fixtures/sample-course-transfer.json');
  const protectedMalformedInput = '{"studentEmail":"private.person@example.edu",';
  const expectedPrivacyError = [{
    path: '$',
    code: 'protected_information',
    message: 'Protected or identifiable student information is not accepted. Keep student records in Canvas and retry with de-identified course-design content.',
  }];

  assert.deepEqual(validateBergenCourseTransfer(protectedMalformedInput), {
    ok: false,
    errors: expectedPrivacyError,
  });
  assert.deepEqual(validateBergenCourseTransfer({
    ...fixture,
    privacy: { ...fixture.privacy, containsProtectedInformation: true },
  }), {
    ok: false,
    errors: expectedPrivacyError,
  });
  assert.throws(
    () => parseBergenCourseTransferBlock(protectedMalformedInput),
    (error) => error.code === 'BERGEN_COURSE_TRANSFER_INVALID'
      && error.errors[0].code === 'protected_information'
      && !error.message.includes('private.person@example.edu'),
  );
});

test('natural-language protected phrasing short-circuits malformed raw JSON before parsing', async () => {
  const { validateBergenCourseTransfer } = await loadCourseTransferValidator();
  const protectedMalformedInput = '{"body":"Student: Example Learner has diabetes, requested an accommodation, and received an individual grade of 78.",';

  const result = validateBergenCourseTransfer(protectedMalformedInput);

  assert.deepEqual(result, {
    ok: false,
    errors: [{
      path: '$',
      code: 'protected_information',
      message: 'Protected or identifiable student information is not accepted. Keep student records in Canvas and retry with de-identified course-design content.',
    }],
  });
  assert.doesNotMatch(JSON.stringify(result), /Example Learner|diabetes|accommodation|grade of 78/i);
});

test('valid transfer fields containing student identity, health, accommodation, or grade phrasing never return course content', async () => {
  const { validateBergenCourseTransfer } = await loadCourseTransferValidator();
  const { value: fixture } = await readJson('tests/fixtures/sample-course-transfer.json');
  const protectedCases = [
    ['student identity', (course) => { course.pages[0].title = 'Student: Example Learner'; }],
    ['student health', (course) => { course.pages[0].body = 'The student has diabetes.'; }],
    ['student accommodation', (course) => { course.assignments[0].instructions = 'The student requested an accommodation.'; }],
    ['individual grade', (course) => { course.discussions[0].prompt = "The student's grade is 78 percent."; }],
  ];

  for (const [label, mutate] of protectedCases) {
    const input = clone(fixture);
    mutate(input);
    const result = validateBergenCourseTransfer(input);

    assert.equal(result.ok, false, `${label} must stop validation`);
    assert.equal('value' in result, false, `${label} must not expose accepted course content`);
    assert.deepEqual(result.errors, [{
      path: '$',
      code: 'protected_information',
      message: 'Protected or identifiable student information is not accepted. Keep student records in Canvas and retry with de-identified course-design content.',
    }]);
    assert.doesNotMatch(JSON.stringify(result), /Example Learner|diabetes|accommodation|78 percent/i);
  }
});

test('null-bearing JSON returns deterministic validation errors instead of throwing during semantic checks', async () => {
  const { validateBergenCourseTransfer } = await loadCourseTransferValidator();
  const { value: fixture } = await readJson('tests/fixtures/sample-course-transfer.json');
  const nullCases = [
    ['module', '$.modules[0]', (course) => { course.modules[0] = null; }],
    ['module item', '$.modules[0].items[0]', (course) => { course.modules[0].items[0] = null; }],
    ['rubric criterion', '$.rubrics[0].criteria[0]', (course) => { course.rubrics[0].criteria[0] = null; }],
    ['assessment question', '$.quizzes[0].questions[0]', (course) => { course.quizzes[0].questions[0] = null; }],
    ['completion rule', '$.completionRules[0]', (course) => { course.completionRules[0] = null; }],
    ['relationship', '$.references[0]', (course) => { course.references[0] = null; }],
  ];

  for (const [label, expectedPath, mutate] of nullCases) {
    const input = clone(fixture);
    mutate(input);
    let result;
    assert.doesNotThrow(() => { result = validateBergenCourseTransfer(input); }, `${label} must not throw`);
    assertInvalid(result, [{ path: expectedPath, code: 'type' }]);
  }
});

test('student identifiers and credential-like content short-circuit raw and parsed validation', async () => {
  const { validateBergenCourseTransfer } = await loadCourseTransferValidator();
  const { value: fixture } = await readJson('tests/fixtures/sample-course-transfer.json');
  const protectedCases = [
    ['student id text', (course) => { course.pages[0].body = 'Student ID 123456'; }],
    ['student name text', (course) => { course.pages[0].body = 'Student name is Example Learner'; }],
    ['API key text', (course) => { course.pages[0].body = 'API key: sk-private-example-123456'; }],
    ['password text', (course) => { course.pages[0].body = 'Password: SyntheticSecret123!'; }],
    ['student_id key', (course) => { course.pages[0].student_id = '123456'; }],
  ];

  for (const [label, mutate] of protectedCases) {
    const input = clone(fixture);
    mutate(input);
    const result = validateBergenCourseTransfer(input);
    assert.equal(result.ok, false, `${label} must stop validation`);
    assert.equal('value' in result, false, `${label} must not return content`);
    assert.deepEqual(result.errors, [{
      path: '$',
      code: 'protected_information',
      message: 'Protected or identifiable student information is not accepted. Keep student records in Canvas and retry with de-identified course-design content.',
    }]);
    assert.doesNotMatch(JSON.stringify(result), /123456|Example Learner|SyntheticSecret|API key|Password/i);
  }

  for (const rawInput of [
    '{"body":"Student ID 123456",',
    '{"body":"API key: sk-private-example-123456",',
  ]) {
    const result = validateBergenCourseTransfer(rawInput);
    assert.equal(result.errors[0].code, 'protected_information');
    assert.doesNotMatch(JSON.stringify(result), /123456|sk-private/i);
  }
});

test('privacy detection permits faculty contact details and ordinary pedagogical language', async () => {
  const { validateBergenCourseTransfer } = await loadCourseTransferValidator();
  const { value: fixture } = await readJson('tests/fixtures/sample-course-transfer.json');
  const safe = clone(fixture);
  safe.metadata.sourceSummary = 'For course questions, contact the faculty office at faculty-support@example.edu.';
  safe.pages[0].body = 'Students compare how a fictional learner solves a bounded problem. Compare 2 < 3 and 5 > 4.';
  safe.assignments[0].instructions = 'Explain how grading criteria support course outcomes without discussing individual records.';
  safe.discussions[0].prompt = 'Discuss accessible course design and general accommodation policies without personal records.';
  safe.course.description = 'A synthetic course that can include general health-education topics without individual information.';

  const result = validateBergenCourseTransfer(safe);

  assert.equal(result.ok, true, JSON.stringify(result.errors));
  assert.equal(result.value.metadata.sourceSummary, safe.metadata.sourceSummary);
});

test('plain-text-only transfer content rejects tags and active constructs while allowing comparison operators', async () => {
  const { validateBergenCourseTransfer } = await loadCourseTransferValidator();
  const { value: fixture } = await readJson('tests/fixtures/sample-course-transfer.json');
  const unsafeValues = [
    '<style>@import url(https://invalid.example/style.css);</style>',
    '<base href="https://invalid.example/">',
    '<svg><a href="jav&#x61;script:alert(1)">link</a></svg>',
    '<p>HTML content</p>',
    '@import url(https://invalid.example/style.css)',
    'background-image: url(jav&#x61;script:alert(1))',
  ];

  for (const unsafeValue of unsafeValues) {
    const input = clone(fixture);
    input.pages[0].body = unsafeValue;
    const result = validateBergenCourseTransfer(input);
    assertInvalid(result, [{ path: '$.pages[0].body', code: 'unsafe_markup' }]);
    assert.doesNotMatch(JSON.stringify(result), /invalid\.example|javascript|HTML content/i);
  }

  const safe = clone(fixture);
  safe.pages[0].body = 'Compare 2 < 3 and 5 > 4. Explain why A is not equal to B.';
  assert.equal(validateBergenCourseTransfer(safe).ok, true);
});

test('plain-text-only validation rejects XML constructs and bounded nested entity obfuscation without echoing content', async () => {
  const { validateBergenCourseTransfer } = await loadCourseTransferValidator();
  const { value: fixture } = await readJson('tests/fixtures/sample-course-transfer.json');
  const unsafeValues = [
    '<?xml version="1.0"?>',
    '<?processing instruction?>',
    '<!-- active comment -->',
    '<!DOCTYPE course>',
    '<![CDATA[plain]]>',
    '<!ENTITY xxe SYSTEM "file:///synthetic">',
    'jav&amp;#x61;script:alert(1)',
  ];

  for (const unsafeValue of unsafeValues) {
    const input = clone(fixture);
    input.pages[0].body = unsafeValue;
    const result = validateBergenCourseTransfer(input);

    assertInvalid(result, [{ path: '$.pages[0].body', code: 'unsafe_markup' }]);
    assert.doesNotMatch(JSON.stringify(result), /CDATA|ENTITY|synthetic|javascript|processing instruction/i);
  }

  const safe = clone(fixture);
  safe.pages[0].body = 'Research and practice: compare 2 < 3, 5 > 4, and R&D examples.';
  assert.equal(validateBergenCourseTransfer(safe).ok, true);
});

test('plain-text-only validation fails closed at the decode bound and rejects unterminated tag starters', async () => {
  const { validateBergenCourseTransfer } = await loadCourseTransferValidator();
  const { value: fixture } = await readJson('tests/fixtures/sample-course-transfer.json');
  const unsafeValues = [
    '&amp;amp;amp;amp;lt;script',
    '&amp;amp;amp;amp;amp;lt;img src=x onerror=alert(1)',
    '<script',
    '</script',
    '<img src=x onerror=alert(1)',
  ];

  for (const unsafeValue of unsafeValues) {
    const input = clone(fixture);
    input.pages[0].body = unsafeValue;
    const result = validateBergenCourseTransfer(input);

    assertInvalid(result, [{ path: '$.pages[0].body', code: 'unsafe_markup' }]);
    assert.doesNotMatch(JSON.stringify(result), /script|img|onerror|alert/i);
  }

  const safe = clone(fixture);
  safe.pages[0].body = 'Compare A < B, 2 < 3, 5 > 4, and R&D without markup.';
  assert.equal(validateBergenCourseTransfer(safe).ok, true);
});

test('ungraded discussions still require an exact uses-rubric relationship', async () => {
  const { validateBergenCourseTransfer } = await loadCourseTransferValidator();
  const { value: fixture } = await readJson('tests/fixtures/sample-course-transfer.json');
  const ungraded = clone(fixture);
  ungraded.discussions[0].graded = false;
  ungraded.discussions[0].pointsPossible = 0;

  assert.equal(validateBergenCourseTransfer(ungraded).ok, true);

  ungraded.references = ungraded.references.filter(({ from, relation }) => (
    from !== ungraded.discussions[0].id || relation !== 'uses-rubric'
  ));
  assertInvalid(validateBergenCourseTransfer(ungraded), [
    { path: '$.discussions[0].rubricRef', code: 'missing_relationship' },
  ]);
});

test('decimal rubric, assessment, and minimum-score comparisons use stable precision', async () => {
  const { validateBergenCourseTransfer } = await loadCourseTransferValidator();
  const { value: fixture } = await readJson('tests/fixtures/sample-course-transfer.json');
  const decimals = clone(fixture);
  decimals.assignments[1].pointsPossible = 0.3;
  decimals.rubrics[1].criteria[0].points = 0.1;
  decimals.rubrics[1].criteria[1].points = 0.2;
  const quizQuestion = decimals.quizzes[0].questions[0];
  quizQuestion.points = 0.1;
  decimals.quizzes[0].questions.push({
    ...clone(quizQuestion),
    id: 'question-foundations-evidence',
    prompt: 'Which second choice supplies observable evidence?',
    points: 0.2,
  });
  decimals.quizzes[0].pointsPossible = 0.3;
  decimals.exams[0].pointsPossible = 0.3;
  decimals.exams[0].questions[0].points = 0.3;
  decimals.completionRules[2].minimumScore = 0.1 + 0.2;

  const result = validateBergenCourseTransfer(decimals);

  assert.equal(result.ok, true, JSON.stringify(result.errors));
});

test('validation error ordering is code-point deterministic and locale-independent', async () => {
  const { source } = await readJson('src/contracts/bergen-course-transfer-v0.1.json');
  const validatorSource = await readFile(repositoryFile('src/contracts/bergen-course-transfer-validator.mjs'), 'utf8');

  assert.ok(source.length > 0);
  assert.doesNotMatch(validatorSource, /localeCompare\s*\(/);
});

test('validator requires unpublished coherent approved input-derived content and rejects placeholders', async () => {
  const { validateBergenCourseTransfer } = await loadCourseTransferValidator();
  const { value: fixture } = await readJson('tests/fixtures/sample-course-transfer.json');
  const invalid = clone(fixture);
  invalid.metadata.courseCode = 'ENG-102';
  invalid.metadata.courseTitle = 'Different title';
  invalid.metadata.finalReviewApproved = false;
  invalid.metadata.packageApproved = false;
  invalid.privacy.inputDerived = false;
  invalid.course.published = true;
  invalid.pages[0].published = true;
  invalid.pages[0].body = 'TODO placeholder content';

  assertInvalid(validateBergenCourseTransfer(invalid), [
    { path: '$.metadata.courseCode', code: 'course_mismatch' },
    { path: '$.metadata.courseTitle', code: 'course_mismatch' },
    { path: '$.metadata.finalReviewApproved', code: 'final_review_approval_required' },
    { path: '$.metadata.packageApproved', code: 'package_approval_required' },
    { path: '$.privacy.inputDerived', code: 'input_derived_required' },
    { path: '$.course.published', code: 'must_be_unpublished' },
    { path: '$.pages[0].published', code: 'must_be_unpublished' },
    { path: '$.pages[0].body', code: 'placeholder_content' },
  ]);
});
