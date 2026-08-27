import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const repositoryFile = (relativePath) => new URL(`../../${relativePath}`, import.meta.url);

async function loadFixture(name = 'sample-course-transfer.json') {
  return JSON.parse(await readFile(repositoryFile(`tests/fixtures/${name}`), 'utf8'));
}

async function loadCore() {
  const source = await readFile(repositoryFile('apps/course-packager/Script.html'), 'utf8');
  const match = source.match(/\/\* BERGEN_COURSE_CORE_START \*\/([\s\S]*?)\/\* BERGEN_COURSE_CORE_END \*\//);
  assert.ok(match, 'Script.html must expose the bounded browser-only course core');
  const context = {
    TextEncoder,
    Uint8Array,
    DataView,
    ArrayBuffer,
    structuredClone,
  };
  vm.runInNewContext(`${match[1]}\nglobalThis.__bergenCoursePackager = BergenCoursePackager;`, context);
  return context.__bergenCoursePackager;
}

function readStoredZip(bytes) {
  const entries = new Map();
  let offset = 0;
  while (offset + 4 <= bytes.length) {
    const view = new DataView(bytes.buffer, bytes.byteOffset + offset);
    if (view.getUint32(0, true) !== 0x04034b50) break;
    const size = view.getUint32(18, true);
    const nameLength = view.getUint16(26, true);
    const extraLength = view.getUint16(28, true);
    const nameStart = offset + 30;
    const dataStart = nameStart + nameLength + extraLength;
    const name = new TextDecoder().decode(bytes.slice(nameStart, nameStart + nameLength));
    entries.set(name, {
      crc: view.getUint32(14, true),
      data: bytes.slice(dataStart, dataStart + size),
    });
    offset = dataStart + size;
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

function textEntry(entries, name) {
  const entry = entries.get(name);
  assert.ok(entry, `expected ZIP member ${name}`);
  return new TextDecoder().decode(entry.data);
}

function resourceElement(manifest, identifier) {
  const escapedIdentifier = identifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = manifest.match(new RegExp(`<resource\\b[^>]*identifier="${escapedIdentifier}"[^>]*>[\\s\\S]*?<\\/resource>`));
  assert.ok(match, `expected manifest resource ${identifier}`);
  return match[0];
}

function openingResourceTag(resource) {
  return resource.match(/^<resource\b[^>]*>/)?.[0] || '';
}

function assertWellFormedXml(xml, name) {
  const withoutDeclaration = xml.replace(/^<\?xml[^?]*\?>\s*/, '');
  const tags = [...withoutDeclaration.matchAll(/<([^!?][^>]*)>/g)].map((match) => match[1].trim());
  const stack = [];
  for (const tag of tags) {
    if (tag.endsWith('/')) continue;
    if (tag.startsWith('/')) {
      assert.equal(tag.slice(1).split(/\s/)[0], stack.pop(), `${name} closing tag ${tag} must match`);
    } else {
      stack.push(tag.split(/\s/)[0]);
    }
  }
  assert.deepEqual(stack, [], `${name} XML tags must be balanced`);
  assert.doesNotMatch(xml, /&(?!amp;|lt;|gt;|quot;|apos;)/, `${name} entities must be escaped`);
}

function withFiveQuestionTypes(course) {
  const result = structuredClone(course);
  result.course.title = 'Applied & Agentic Systems';
  result.metadata.courseTitle = result.course.title;
  result.quizzes[0].instructions = 'Use bounded review & answer every question before submission.';
  result.pages[0].body = 'Compare 2 < 3, 5 > 4, and R&D before choosing a bounded handoff.';
  result.quizzes[0].questions = [
    {
      id: 'question-choice', type: 'multiple-choice', prompt: 'Choose A & B.', points: 1,
      choices: ['A & B', 'C'], correctChoiceIndexes: [0],
    },
    {
      id: 'question-answers', type: 'multiple-answer', prompt: 'Choose both bounded actions.', points: 1,
      choices: ['Review', 'Approve', 'Publish automatically'], correctChoiceIndexes: [0, 1],
    },
    {
      id: 'question-boolean', type: 'true-false', prompt: 'Publication remains manual.', points: 1,
      choices: ['True', 'False'], correctChoiceIndexes: [0],
    },
    {
      id: 'question-short', type: 'short-answer', prompt: 'Name the review state.', points: 1,
      acceptedAnswers: ['unpublished', 'draft'],
    },
    {
      id: 'question-essay', type: 'essay', prompt: 'Explain the manual handoff.', points: 1,
    },
  ];
  result.quizzes[0].pointsPossible = 5;
  return result;
}

test('Common Cartridge contains complete unpublished course resources, escaped internal links, and embedded five-type QTI', async () => {
  const [core, fixture] = await Promise.all([loadCore(), loadFixture()]);
  const transfer = withFiveQuestionTypes(fixture);
  const packageResult = core.buildCoursePackage(transfer);
  const entries = readStoredZip(packageResult.bytes);

  assert.equal(packageResult.fileName, 'cis-277-course.imscc');
  assert.deepEqual([...entries.keys()], Array.from(packageResult.files, ({ name }) => name));
  for (const [name, entry] of entries) {
    assert.equal(entry.crc, standardCrc32(entry.data), `${name} must use a standards-compliant CRC-32`);
    if (name.endsWith('.xml')) assertWellFormedXml(new TextDecoder().decode(entry.data), name);
  }

  const manifest = textEntry(entries, 'imsmanifest.xml');
  assert.match(manifest, /imsccv1p3\/imscp_v1p1/);
  assert.match(manifest, /identifier="course-cis-277"/);
  for (const name of [...entries.keys()].filter((entryName) => entryName !== 'imsmanifest.xml')) {
    assert.match(manifest, new RegExp(`href="${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`));
  }

  const pageResource = resourceElement(manifest, 'resource-page-agent-boundaries');
  assert.match(openingResourceTag(pageResource), /type="webcontent"/);
  assert.match(openingResourceTag(pageResource), /href="web_resources\/pages\/page-agent-boundaries\.html"/);

  const assignmentResource = resourceElement(manifest, 'resource-assignment-workflow-map');
  assert.match(openingResourceTag(assignmentResource), /type="webcontent"/);
  assert.match(openingResourceTag(assignmentResource), /intendeduse="assignment"/);
  assert.match(openingResourceTag(assignmentResource), /href="web_resources\/assignments\/assignment-workflow-map\.html"/);

  const assessmentResource = resourceElement(manifest, 'resource-quiz-foundations-check');
  assert.match(openingResourceTag(assessmentResource), /type="imsqti_xmlv1p2\/imscc_xmlv1p3\/assessment"/);
  assert.doesNotMatch(openingResourceTag(assessmentResource), /\shref=/);
  assert.match(assessmentResource, /<file href="assessments\/quiz-foundations-check\/assessment\.xml"\/>/);

  const discussionResource = resourceElement(manifest, 'resource-discussion-evidence-boundaries');
  assert.match(openingResourceTag(discussionResource), /type="imsdt_xmlv1p3"/);
  assert.doesNotMatch(openingResourceTag(discussionResource), /\shref=/);
  assert.match(discussionResource, /<file href="discussions\/discussion-evidence-boundaries\/discussion\.xml"\/>/);
  assert.match(discussionResource, /<dependency identifierref="resource-discussion-evidence-boundaries-associated-content"\/>/);

  const associatedResource = resourceElement(manifest, 'resource-discussion-evidence-boundaries-associated-content');
  assert.match(openingResourceTag(associatedResource), /type="associatedcontent\/imscc_xmlv1p3\/learning-application-resource"/);
  assert.doesNotMatch(openingResourceTag(associatedResource), /\shref=/);
  assert.match(associatedResource, /<file href="discussions\/discussion-evidence-boundaries\/details\.html"\/>/);
  assert.deepEqual(
    [...manifest.matchAll(/<dependency identifierref="([^"]+)"\/>/g)].map((match) => match[1]),
    ['resource-discussion-evidence-boundaries-associated-content'],
    'associated content must be reachable only through a permitted learning-application dependency',
  );
  assert.doesNotMatch(manifest, /type="imsqti_xmlv1p2"|imscc_xmlv1p1|type="associatedcontent"/);

  const course = textEntry(entries, 'web_resources/course/course-overview.html');
  const modules = textEntry(entries, 'web_resources/course/modules.html');
  const rubrics = textEntry(entries, 'web_resources/course/rubrics.html');
  const relationships = textEntry(entries, 'web_resources/course/relationships.html');
  const page = textEntry(entries, 'web_resources/pages/page-agent-boundaries.html');
  const linkedPage = textEntry(entries, 'web_resources/pages/page-verification-loop.html');
  const assignment = textEntry(entries, 'web_resources/assignments/assignment-workflow-map.html');
  const discussion = textEntry(entries, 'discussions/discussion-evidence-boundaries/discussion.xml');
  const discussionDetails = textEntry(entries, 'discussions/discussion-evidence-boundaries/details.html');
  const quiz = textEntry(entries, 'assessments/quiz-foundations-check/assessment.xml');
  assert.match(course, /<meta name="bergen-published" content="false">/);
  assert.match(course, /Applied &amp; Agentic Systems/);
  assert.match(modules, /data-module-id="module-foundations"[^>]+data-published="false"/);
  assert.match(modules, /data-requirement="score_at_least"[^>]+data-minimum-score="18"/);
  assert.match(rubrics, /rubric-workflow-map/);
  assert.match(relationships, /data-relation="links-to"[^>]+data-from="page-verification-loop"[^>]+data-to="page-agent-boundaries"/);
  assert.match(page, /Compare 2 &lt; 3, 5 &gt; 4, and R&amp;D/);
  assert.match(page, /<meta name="bergen-published" content="false">/);
  assert.match(linkedPage, /href="page-agent-boundaries\.html"/);
  assert.match(assignment, /Map a Bounded Workflow/);
  assert.match(assignment, /data-points-possible="20"/);
  assert.match(discussion, /<topic xmlns="\/xsd\/imsccv1p3\/imsdt_v1p3"/);
  assert.match(discussion, /<text texttype="text\/plain">Compare a structural repository check/);
  assert.doesNotMatch(discussion, /bergen\.edu|<discussion\b/);
  assert.match(discussionDetails, /data-graded="true"/);
  assert.match(discussionDetails, /data-points-possible="20"/);
  for (const type of [
    'multiple_choice_question',
    'multiple_answers_question',
    'true_false_question',
    'short_answer_question',
    'essay_question',
  ]) assert.match(quiz, new RegExp(`<fieldentry>${type}<\\/fieldentry>`));
  const multipleAnswerItem = quiz.match(/<item ident="question-answers"[\s\S]*?<\/item>/)?.[0] || '';
  assert.match(multipleAnswerItem, /<and>[\s\S]*<varequal[^>]*>answer-1<\/varequal>[\s\S]*<varequal[^>]*>answer-2<\/varequal>/);
  assert.match(multipleAnswerItem, /<not><varequal[^>]*>answer-3<\/varequal><\/not>/);
  const shortAnswerItem = quiz.match(/<item ident="question-short"[\s\S]*?<\/item>/)?.[0] || '';
  assert.match(shortAnswerItem, /<or>[\s\S]*<varequal case="No"[^>]*>unpublished<\/varequal>[\s\S]*<varequal case="No"[^>]*>draft<\/varequal>[\s\S]*<\/or>/);
  assert.match(quiz, /<fieldlabel>qmd_description<\/fieldlabel><fieldentry>Use bounded review &amp; answer every question before submission\.<\/fieldentry>/);
  assert.match(quiz, /<presentation_material>[\s\S]*Use bounded review &amp; answer every question before submission\.[\s\S]*<\/presentation_material>/);
  assert.doesNotMatch(quiz, /<script|javascript:|onerror=/i);
});

test('XML 1.0 validation rejects invalid control characters while allowing XML whitespace and valid Unicode', async () => {
  const [core, fixture] = await Promise.all([loadCore(), loadFixture()]);
  const invalid = structuredClone(fixture);
  invalid.pages[0].body = `Allowed prefix${String.fromCharCode(1)}hidden suffix`;
  const invalidResult = core.validateTransfer(invalid);
  assert.equal(invalidResult.ok, false);
  assert.deepEqual(Array.from(invalidResult.errors, ({ code }) => code), ['invalid_xml_character']);
  assert.match(invalidResult.errors[0].message, /XML 1\.0/);
  assert.doesNotMatch(JSON.stringify(invalidResult), /Allowed prefix|hidden suffix|\\u0001/);
  assert.throws(() => core.buildCoursePackage(invalid), (error) => (
    error.code === 'BERGEN_COURSE_PACKAGE_INVALID'
      && !('bytes' in error)
      && !('files' in error)
      && /XML 1\.0/.test(error.message)
  ));

  const allowed = structuredClone(fixture);
  allowed.pages[0].body = 'Tabs\tline feeds\nand carriage returns\rremain valid with Café and 🚀.';
  assert.equal(core.validateTransfer(allowed).ok, true);
  const page = textEntry(readStoredZip(core.buildCoursePackage(allowed).bytes), 'web_resources/pages/page-agent-boundaries.html');
  assert.match(page, /Tabs\tline feeds\nand carriage returns\rremain valid with Café and 🚀\./);
});

test('identical approved input is byte-stable while a different approved course produces a different single imscc', async () => {
  const [core, cis277, eng102] = await Promise.all([
    loadCore(),
    loadFixture(),
    loadFixture('sample-course-transfer-eng-102.json'),
  ]);

  const first = core.buildCoursePackage(cis277);
  const second = core.buildCoursePackage(structuredClone(cis277));
  const different = core.buildCoursePackage(eng102);

  assert.equal(first.fileName, 'cis-277-course.imscc');
  assert.equal(different.fileName, 'eng-102-course.imscc');
  assert.deepEqual(Array.from(first.bytes), Array.from(second.bytes));
  assert.notDeepEqual(Array.from(first.bytes), Array.from(different.bytes));
  assert.equal(first.files.filter(({ name }) => name === 'imsmanifest.xml').length, 1);
  assert.equal(new DataView(first.bytes.buffer, first.bytes.byteOffset).getUint32(0, true), 0x04034b50);
});

test('existing course validator rejects malformed, unsafe, or protected input all-or-nothing with sanitized corrections', async () => {
  const [core, fixture, phaseFourValidator, browserSource, validatorSource, schemaSource] = await Promise.all([
    loadCore(),
    loadFixture(),
    import('../../src/contracts/bergen-course-transfer-validator.mjs'),
    readFile(repositoryFile('apps/course-packager/Script.html'), 'utf8'),
    readFile(repositoryFile('src/contracts/bergen-course-transfer-validator.mjs'), 'utf8'),
    readFile(repositoryFile('src/contracts/bergen-course-transfer-v0.1.json'), 'utf8'),
  ]);
  const embeddedValidator = browserSource.match(/\/\* BERGEN_COURSE_VALIDATOR_START \*\/([\s\S]*?)\/\* BERGEN_COURSE_VALIDATOR_END \*\//);
  assert.ok(embeddedValidator, 'browser core must mark the mechanically embedded Phase 4 validator');
  const portableValidator = validatorSource
    .replace(/^import \{ readFileSync \} from 'node:fs';\r?\n\r?\n/, '')
    .replace(
      /const courseTransferSchema = JSON\.parse\(readFileSync\([\s\S]*?\r?\n\)\);\r?\n/,
      `const courseTransferSchema = Object.freeze(${schemaSource.trim()});\n`,
    )
    .replace(/\bexport\s+(class|function|const)\s+/g, '$1 ')
    .replace(/\r?\nexport \{ courseTransferSchema \};\s*$/, '')
    .split(/\r?\n/)
    .map((line) => (line === '' ? '' : `  ${line}`))
    .join('\n')
    .trim();
  assert.equal(
    embeddedValidator[1].replace(/\r\n/g, '\n').trim(),
    portableValidator,
    'the browser must validate with the exact repository-owned Phase 4 parser/validator and schema',
  );
  const malformed = core.validateTransfer('{"format":');
  assert.equal(
    JSON.stringify(malformed),
    JSON.stringify(phaseFourValidator.validateBergenCourseTransfer('{"format":')),
    'browser validation must use the Phase 4 parser/validator contract',
  );
  assert.equal(malformed.ok, false);
  assert.equal(malformed.errors[0].code, 'invalid_json');
  assert.equal('value' in malformed, false);

  const unsafe = structuredClone(fixture);
  unsafe.pages[0].body = '<img src=x onerror=alert(1)>';
  const unsafeResult = core.validateTransfer(unsafe);
  assert.equal(
    JSON.stringify(unsafeResult),
    JSON.stringify(phaseFourValidator.validateBergenCourseTransfer(unsafe)),
    'unsafe input must have the same Phase 4 validation result',
  );
  assert.equal(unsafeResult.ok, false);
  assert.ok(unsafeResult.errors.some(({ code }) => code === 'unsafe_markup'));
  assert.throws(() => core.buildCoursePackage(unsafe), (error) => (
    error.code === 'BERGEN_COURSE_PACKAGE_INVALID'
      && !('bytes' in error)
      && !('files' in error)
      && !/img|onerror|alert/i.test(error.message)
  ));

  const protectedInput = '{"body":"Student: Example Learner has diabetes.",';
  const protectedResult = core.validateTransfer(protectedInput);
  assert.equal(
    JSON.stringify(protectedResult),
    JSON.stringify(phaseFourValidator.validateBergenCourseTransfer(protectedInput)),
    'protected input must have the same Phase 4 privacy short-circuit',
  );
  assert.deepEqual(Array.from(protectedResult.errors, ({ code }) => code), ['protected_information']);
  assert.doesNotMatch(JSON.stringify(protectedResult), /Example Learner|diabetes/i);
  assert.throws(() => core.buildCoursePackage(protectedInput), (error) => (
    error.code === 'BERGEN_COURSE_PACKAGE_INVALID'
      && /Canvas is the only student-record system/i.test(error.message)
      && !/Example Learner|diabetes/i.test(error.message)
  ));
});
