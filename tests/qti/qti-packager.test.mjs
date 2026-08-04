import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const scriptUrl = new URL('../../apps/qti-packager/Script.html', import.meta.url);
const fixtureUrl = new URL('../fixtures/sample-quiz.json', import.meta.url);

async function loadCore() {
  const source = await readFile(scriptUrl, 'utf8');
  const match = source.match(/\/\* BERGEN_QTI_CORE_START \*\/([\s\S]*?)\/\* BERGEN_QTI_CORE_END \*\//);
  assert.ok(match, 'Script.html must expose the bounded browser-only QTI core');
  const context = {
    TextEncoder,
    Uint8Array,
    DataView,
    ArrayBuffer,
    structuredClone,
  };
  vm.runInNewContext(`${match[1]}\nglobalThis.__bergenQti = BergenQti;`, context);
  return context.__bergenQti;
}

async function loadFixture() {
  return JSON.parse(await readFile(fixtureUrl, 'utf8'));
}

function readStoredZip(bytes) {
  const entries = new Map();
  let offset = 0;
  while (offset + 4 <= bytes.length) {
    const view = new DataView(bytes.buffer, bytes.byteOffset + offset);
    if (view.getUint32(0, true) !== 0x04034b50) break;
    const compressedSize = view.getUint32(18, true);
    const nameLength = view.getUint16(26, true);
    const extraLength = view.getUint16(28, true);
    const nameStart = offset + 30;
    const dataStart = nameStart + nameLength + extraLength;
    const name = new TextDecoder().decode(bytes.slice(nameStart, nameStart + nameLength));
    entries.set(name, {
      crc: view.getUint32(14, true),
      data: bytes.slice(dataStart, dataStart + compressedSize),
    });
    offset = dataStart + compressedSize;
  }
  return entries;
}

function standardCrc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function assertWellFormedXml(xml) {
  const withoutDeclaration = xml.replace(/^<\?xml[^?]*\?>\s*/, '');
  const tags = [...withoutDeclaration.matchAll(/<([^!?][^>]*)>/g)].map((match) => match[1].trim());
  const stack = [];
  for (const tag of tags) {
    if (tag.endsWith('/')) continue;
    if (tag.startsWith('/')) {
      assert.equal(tag.slice(1).split(/\s/)[0], stack.pop(), `XML closing tag ${tag} must match`);
    } else {
      stack.push(tag.split(/\s/)[0]);
    }
  }
  assert.deepEqual(stack, [], 'XML tags must be balanced');
  assert.doesNotMatch(xml, /&(?!amp;|lt;|gt;|quot;|apos;)/, 'XML entities must be escaped');
}

test('parses plain and fenced Bergen Quiz Transfer Blocks', async () => {
  const [core, fixture] = await Promise.all([loadCore(), loadFixture()]);
  assert.equal(core.parseTransferBlock(JSON.stringify(fixture)).format, 'bergen-qti-transfer');
  assert.equal(core.parseTransferBlock(`\`\`\`json\n${JSON.stringify(fixture)}\n\`\`\``).version, '0.1');
  assert.throws(() => core.parseTransferBlock('{broken'), /complete block|could not be read/i);
});

test('validates all five supported types, settings, and point totals', async () => {
  const [core, fixture] = await Promise.all([loadCore(), loadFixture()]);
  const validation = core.validateTransfer(fixture);
  assert.equal(validation.valid, true, validation.errors.join(' '));
  assert.deepEqual(Array.from(core.supportedTypes).sort(), [
    'essay', 'multiple_answer', 'multiple_choice', 'short_answer', 'true_false',
  ]);
  const summary = core.summarizeQuiz(fixture);
  assert.equal(summary.questionCount, 5);
  assert.equal(summary.points, 12);
  assert.equal(summary.settings.pointsPossible, 12);
});

test('rejects missing scoring or answers and gives unsupported items a manual-entry fallback', async () => {
  const [core, fixture] = await Promise.all([loadCore(), loadFixture()]);
  const missing = structuredClone(fixture);
  delete missing.quiz.questions[0].correctChoiceIds;
  missing.quiz.questions[1].points = 0;
  const missingResult = core.validateTransfer(missing);
  assert.equal(missingResult.valid, false);
  assert.match(missingResult.errors.join(' '), /correct answer/i);
  assert.match(missingResult.errors.join(' '), /point value greater than zero/i);

  const unsupported = structuredClone(fixture);
  unsupported.quiz.questions[0].type = 'matching';
  const unsupportedResult = core.validateTransfer(unsupported);
  assert.equal(unsupportedResult.valid, false);
  assert.match(unsupportedResult.errors.join(' '), /unsupported question type/i);
  assert.match(unsupportedResult.fallback, /manual entry/i);
  assert.throws(() => core.buildQtiPackage(unsupported), /cannot be packaged/i);

  const colliding = structuredClone(fixture);
  colliding.quiz.questions[0].choices[0].id = 'answer one';
  colliding.quiz.questions[0].choices[1].id = 'answer@one';
  colliding.quiz.questions[0].correctChoiceIds = ['answer one'];
  const collisionResult = core.validateTransfer(colliding);
  assert.equal(collisionResult.valid, false);
  assert.match(collisionResult.errors.join(' '), /same packaged identifier/i);
});

test('stops packaging when likely protected identifiers are detected', async () => {
  const [core, fixture] = await Promise.all([loadCore(), loadFixture()]);
  const unsafe = structuredClone(fixture);
  unsafe.quiz.instructions = 'Send results to student.person@example.edu.';
  const validation = core.validateTransfer(unsafe);
  assert.equal(validation.valid, false);
  assert.match(validation.errors.join(' '), /possible email address|protected information/i);
  assert.throws(() => core.buildQtiPackage(unsafe), /cannot be packaged/i);

  const explicit = structuredClone(fixture);
  explicit.metadata.containsRealStudentData = true;
  const explicitResult = core.validateTransfer(explicit);
  assert.equal(explicitResult.valid, false);
  assert.match(explicitResult.errors.join(' '), /marked as containing real student data/i);

  const controlCharacter = structuredClone(fixture);
  controlCharacter.quiz.questions[0].prompt = 'Invalid XML control \u0001 character';
  const controlResult = core.validateTransfer(controlCharacter);
  assert.equal(controlResult.valid, false);
  assert.match(controlResult.errors.join(' '), /unsupported control character/i);
});

test('refuses an ordinary name identified as belonging to a student', async () => {
  const [core, fixture] = await Promise.all([loadCore(), loadFixture()]);
  const unsafe = structuredClone(fixture);
  unsafe.quiz.instructions = 'Student name: Jordan Lee';

  const validation = core.validateTransfer(unsafe);
  assert.equal(validation.valid, false);
  assert.match(validation.errors.join(' '), /possible student name/i);
  assert.match(validation.errors.join(' '), /Canvas is the student-record system/i);
  assert.match(validation.errors.join(' '), /de-identified Class Learning Snapshot/i);
});

test('refuses an individual grade even when the explicit student-data flag is false', async () => {
  const [core, fixture] = await Promise.all([loadCore(), loadFixture()]);
  const unsafe = structuredClone(fixture);
  unsafe.quiz.instructions = 'Individual grade: 87%';

  const validation = core.validateTransfer(unsafe);
  assert.equal(validation.valid, false);
  assert.match(validation.errors.join(' '), /possible individual grade/i);
});

test('refuses student accommodation, disability, and health information', async () => {
  const [core, fixture] = await Promise.all([loadCore(), loadFixture()]);
  const syntheticCases = [
    ['Student accommodation: extended time.', /possible accommodation information/i],
    ['Student disability: dyslexia.', /possible disability information/i],
    ['Student health information: migraine treatment.', /possible health information/i],
  ];

  for (const [protectedText, expectedMessage] of syntheticCases) {
    const unsafe = structuredClone(fixture);
    unsafe.quiz.instructions = protectedText;
    const validation = core.validateTransfer(unsafe);
    assert.equal(validation.valid, false, protectedText);
    assert.match(validation.errors.join(' '), expectedMessage);
  }
});

test('refuses identifying combinations of otherwise ordinary student details', async () => {
  const [core, fixture] = await Promise.all([loadCore(), loadFixture()]);
  const unsafe = structuredClone(fixture);
  unsafe.quiz.instructions = 'Student in Tuesday evening lab, age 19, from Hackensack.';

  const validation = core.validateTransfer(unsafe);
  assert.equal(validation.valid, false);
  assert.match(validation.errors.join(' '), /possible identifying combination/i);
});

test('refuses protected content before structural validation or package generation', async () => {
  const [core, fixture] = await Promise.all([loadCore(), loadFixture()]);
  const unsafe = structuredClone(fixture);
  unsafe.quiz.title = 'Student name: Jordan Lee';
  unsafe.quiz.settings = null;
  unsafe.quiz.questions[0].type = 'matching';

  const validation = core.validateTransfer(unsafe);
  assert.equal(validation.valid, false);
  assert.equal(validation.privacyRefused, true);
  assert.equal(validation.errors.length, 1, 'privacy refusal must short-circuit ordinary quiz validation');
  assert.match(validation.errors[0], /possible student name/i);
  assert.doesNotMatch(validation.errors[0], /Jordan Lee/i, 'the refusal must not echo rejected content');
  assert.doesNotMatch(validation.errors[0], /settings|unsupported question type/i);
  assert.throws(
    () => core.buildQtiPackage(unsafe),
    /cannot be packaged.+possible student name/i,
  );
});

test('refuses common natural student-specific phrasing with typed categories', async () => {
  const [core, fixture] = await Promise.all([loadCore(), loadFixture()]);
  const syntheticCases = [
    ['Student Jordan Lee is in section BIO-101.', /possible student name|possible identifying combination/i],
    ["The student's grade was 87%.", /possible individual grade/i],
    ['The student needs extended time for exams.', /possible accommodation information/i],
    ['The student was diagnosed with dyslexia.', /possible disability information/i],
    ['The student has diabetes.', /possible health information/i],
    ['Student: Jordan Lee', /possible student name/i],
    ['Student: Jordan Lee, section BIO-101.', /possible student name|possible identifying combination/i],
    ['Student Jordan Lee in section BIO-101.', /possible student name|possible identifying combination/i],
    ["Jordan Lee's grade was 87%.", /possible individual grade/i],
    ["The student's accommodation was extended time.", /possible accommodation information/i],
    ['Jordan Lee receives extended time for exams.', /possible accommodation information/i],
    ['Jordan Lee has diabetes.', /possible health information/i],
    ['Grade for Jordan Lee was 87%.', /possible individual grade/i],
    ['Accommodation for Jordan Lee was extended time.', /possible accommodation information/i],
    ['Jordan Lee was diagnosed with dyslexia.', /possible disability information|possible health information/i],
  ];

  const results = syntheticCases.map(([protectedText, expectedCategory]) => {
    const unsafe = structuredClone(fixture);
    unsafe.quiz.instructions = protectedText;
    const validation = core.validateTransfer(unsafe);
    return {
      protectedText,
      valid: validation.valid,
      typedCategory: expectedCategory.test(validation.errors.join(' ')),
      safeBoundary: /Canvas is the student-record system/i.test(validation.errors.join(' ')),
      echoed: validation.errors.join(' ').includes(protectedText),
    };
  });

  assert.deepEqual(results, syntheticCases.map(([protectedText]) => ({
    protectedText,
    valid: false,
    typedCategory: true,
    safeBoundary: true,
    echoed: false,
  })));
});

test('allows bounded class-level and course-content counterexamples', async () => {
  const [core, fixture] = await Promise.all([loadCore(), loadFixture()]);
  const safeClassLevelCases = [
    'The class-level performance distribution was 70–89% for most learners.',
    'All students have the standard 60-minute testing window.',
    'This public-health question asks how diabetes affects the body.',
    'Students compare disability policy and reasonable accommodations.',
    'The class reads a fictional source by author Jordan Lee.',
  ];

  for (const safeText of safeClassLevelCases) {
    const transfer = structuredClone(fixture);
    transfer.quiz.instructions = safeText;
    const validation = core.validateTransfer(transfer);
    assert.equal(validation.valid, true, `${safeText}: ${validation.errors.join(' ')}`);
  }
});

test('inspects malformed raw text before JSON parsing and throws a typed sanitized refusal', async () => {
  const core = await loadCore();
  const malformedProtectedText = '{"quiz":{"instructions":"The student has diabetes."';

  assert.throws(
    () => core.parseTransferBlock(malformedProtectedText),
    (error) => {
      assert.equal(error.name, 'PrivacyRefusalError');
      assert.equal(error.privacyRefused, true);
      assert.match(error.message, /possible health information/i);
      assert.match(error.message, /Canvas is the student-record system/i);
      assert.doesNotMatch(error.message, /diabetes/i);
      return true;
    },
  );
});

test('creates well-formed QTI 1.2 manifest and assessment XML for the five types', async () => {
  const [core, fixture] = await Promise.all([loadCore(), loadFixture()]);
  const result = core.buildQtiPackage(fixture);
  const manifest = result.files.find(({ name }) => name === 'imsmanifest.xml').data;
  const assessment = result.files.find(({ name }) => name === 'assessment.xml').data;
  assertWellFormedXml(manifest);
  assertWellFormedXml(assessment);
  assert.match(manifest, /type="imsqti_xmlv1p2"/);
  assert.match(manifest, /href="assessment.xml"/);
  assert.equal((assessment.match(/<item ident=/g) || []).length, 5);
  for (const type of [
    'multiple_choice_question', 'true_false_question', 'multiple_answers_question',
    'short_answer_question', 'essay_question',
  ]) assert.match(assessment, new RegExp(type));
  assert.match(assessment, /<fieldlabel>shuffle_answers<\/fieldlabel>[\s\S]*?<fieldentry>false<\/fieldentry>/);
  assert.match(assessment, /<fieldlabel>allowed_attempts<\/fieldlabel>[\s\S]*?<fieldentry>1<\/fieldentry>/);
});

test('builds a deterministic local ZIP containing only the manifest and assessment', async () => {
  const [core, fixture] = await Promise.all([loadCore(), loadFixture()]);
  const first = core.buildQtiPackage(fixture);
  const second = core.buildQtiPackage(fixture);
  assert.equal(first.fileName, 'bergen-qti-compatibility-check-qti.zip');
  assert.deepEqual(Array.from(first.bytes), Array.from(second.bytes));
  const entries = readStoredZip(first.bytes);
  assert.deepEqual([...entries.keys()], ['imsmanifest.xml', 'assessment.xml']);
  for (const [name, entry] of entries) {
    assert.equal(entry.crc, standardCrc32(entry.data), `${name} must have a standards-compliant CRC-32`);
  }
  assert.equal(new DataView(first.bytes.buffer, first.bytes.byteOffset).getUint32(0, true), 0x04034b50);
});
