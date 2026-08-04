import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const repositoryFile = (relativePath) => new URL(`../../${relativePath}`, import.meta.url);

async function readRequired(relativePath) {
  try {
    return await readFile(repositoryFile(relativePath), 'utf8');
  } catch (error) {
    assert.fail(`Expected Phase 4 guide ${relativePath} to exist: ${error.message}`);
  }
}

const guidePaths = [
  'src/guides/command-reference.md',
  'src/guides/installation-guide.md',
  'src/guides/faculty-quick-start.md',
  'src/guides/presentation-script.md',
  'src/guides/sample-prompts.md',
  'src/guides/end-to-end-demonstration.md',
  'src/guides/privacy-checklist.md',
  'src/guides/troubleshooting.md',
  'src/guides/qti-canvas-handoff.md',
];

const aliases = [
  'help',
  'setup',
  'course',
  'lesson',
  'assignment',
  'rubric',
  'reinforce',
  'review',
  'revise',
  'message',
  'reflect',
  'record',
];

const snapshotFields = [
  'Module completed',
  'Outcomes assessed',
  'Concepts already introduced',
  'Class-level strengths',
  'Common misconceptions',
  'Rubric areas needing reinforcement',
  'General performance distribution',
  'Concepts not yet introduced',
  'Knowledge a new activity must not assume',
  'Desired activity format and difficulty',
];

function occurrences(source, expression) {
  return [...source.matchAll(expression)].length;
}

function minutesToSeconds(value) {
  const [minutes, seconds] = value.split(':').map(Number);
  return (minutes * 60) + seconds;
}

test('all Phase 4 faculty guides are present and keep the faculty experience nontechnical', async () => {
  const guides = await Promise.all(guidePaths.map(async (relativePath) => ({
    relativePath,
    source: await readRequired(relativePath),
  })));

  for (const { relativePath, source } of guides) {
    assert.match(source, /^# Bergen Memory Bank/m, `${relativePath} needs a faculty-facing title`);
    assert.doesNotMatch(source, /Phase 5|release item|release gate|\b(?:runtime|API|developer|repository|Git|terminal|code|programming|deployed|URL)\b|(?:src\/|tests\/|memory-bank\/|\.mjs\b|\.md\b|npm\b|GitHub\b|command line|developer workflow)/i,
      `${relativePath} must not expose internal release, implementation, source-format, or developer vocabulary`);
  }
});

test('the five-minute installation has exactly the approved eight numbered steps', async () => {
  const installation = await readRequired('src/guides/installation-guide.md');
  assert.match(installation, /five-minute installation/i);

  const numberedSteps = [...installation.matchAll(/^(\d+)\.\s+(.+)$/gm)];
  assert.deepEqual(numberedSteps.map(([, number]) => Number(number)), [1, 2, 3, 4, 5, 6, 7, 8]);

  const expectedStepContracts = [
    /create.+Bergen Memory Bank.+Google Drive folder/i,
    /copy.+four supplied templates/i,
    /create.+classic custom Gem.+bergen\.edu account/i,
    /name.+Bergen Memory Bank/i,
    /paste.+instructions/i,
    /attach.+four.+Drive documents.+Gem knowledge/i,
    /save/i,
    /enter `bergen:help`/i,
  ];
  numberedSteps.forEach(([, , step], index) => assert.match(step, expectedStepContracts[index]));
  assert.match(installation, /optional preflight/i);
  assert.doesNotMatch(installation, /^(?:9|0)\.\s+/m);
  assert.match(installation, /end with `Current stage: Remember` followed by a `Recommended next command:` line/i);
});

test('the command reference and quick start align all aliases, natural language, response fields, and approval gates', async () => {
  const [reference, quickStart, releaseContract] = await Promise.all([
    readRequired('src/guides/command-reference.md'),
    readRequired('src/guides/faculty-quick-start.md'),
    readRequired('src/release/release-contract.md'),
  ]);
  const combined = `${reference}\n${quickStart}`;

  for (const alias of aliases) {
    assert.match(reference, new RegExp(`bergen:${alias}\\b`, 'i'), `missing bergen:${alias}`);
  }
  for (const purpose of [
    'safe workflow menu',
    'faculty profile and course-memory arrangement',
    'course, syllabus, outcomes, modules, or calendar',
    'outcome-aligned lesson',
    'assignment, exam, or quiz',
    'assessment criteria and performance descriptions',
    'class-level reinforcement',
    'without revising',
    'explicitly approved',
    'faculty communication',
    'teaching reflection',
    'copy-ready update',
  ]) {
    assert.match(reference, new RegExp(purpose, 'i'));
  }
  assert.match(combined, /aliases are optional text conventions/i);
  assert.match(combined, /natural-language request.+same workflow.+safeguards/i);
  for (const label of ['Course:', 'Context used:', 'Faculty-supplied facts:', 'Missing or conflicting context:', 'Current stage:', 'Recommended next command:']) {
    assert.match(combined, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
  assert.match(combined, /one blocking question/i);
  assert.match(combined, /explicit(?:ly)? select.+course/i);
  assert.match(combined, /approval.+before.+revis(?:e|ion).+record(?:ing)?.+publish/i);
  assert.doesNotMatch(releaseContract, /future Gem, memory documents/i);
  assert.match(releaseContract, /implemented Gem, memory documents, and faculty guides/i);
  assert.match(releaseContract, /implemented optional QTI Packager/i);
  assert.match(releaseContract, /revision requires explicit faculty approval/i);
  assert.match(releaseContract, /Google Docs persistence and Canvas transfer require faculty manual action/i);
});

test('privacy and context guidance provides the complete stop, recovery, and conservative estimate contracts', async () => {
  const [privacy, quickStart] = await Promise.all([
    readRequired('src/guides/privacy-checklist.md'),
    readRequired('src/guides/faculty-quick-start.md'),
  ]);
  const prohibited = [
    'raw student submission',
    'name, email, student ID, or identifying filename',
    'individual grade',
    'student-specific feedback',
    'accommodation, disability, health, advising, or disciplinary information',
    'identifiable quotation',
    'identifying combination of details',
  ];
  for (const category of prohibited) assert.match(privacy, new RegExp(category, 'i'));
  assert.match(privacy, /Canvas is the student-record system/i);
  assert.match(privacy, /stop substantive processing immediately/i);
  assert.match(privacy, /do not echo, quote, transform, summarize, analyze, classify, or retain/i);
  for (const field of snapshotFields) assert.match(privacy, new RegExp(field, 'i'));
  assert.match(privacy, /synthetic examples only/i);

  assert.match(quickStart, /low-confidence conservative visible-chat estimate/i);
  assert.match(quickStart, /32,000 tokens.+unverified Education Fundamentals working denominator/i);
  assert.match(quickStart, /not actual remaining capacity/i);
  for (const exclusion of ['hidden instructions', 'system instructions', 'Gem instructions', 'retrieved knowledge', 'actual model capacity']) {
    assert.match(quickStart, new RegExp(exclusion, 'i'));
  }
  assert.match(quickStart, /below.+50%.+may continue/is);
  assert.match(quickStart, /50.+70%.+record soon/is);
  assert.match(quickStart, /above.+70%.+record.+new chat/is);
  assert.match(quickStart, /mixed courses|courses mix/i);
  assert.match(quickStart, /lost decisions|decisions are lost/i);
  assert.match(quickStart, /hallucinations.+any percentage/i);
  assert.doesNotMatch(quickStart, /\d+\.\d+%/);
});

test('the presentation script covers the safe value journey in contiguous ranges totaling ten minutes', async () => {
  const presentation = await readRequired('src/guides/presentation-script.md');
  const ranges = [...presentation.matchAll(/^## \[(\d+:\d{2})[–-](\d+:\d{2})\]/gm)]
    .map(([, start, end]) => [minutesToSeconds(start), minutesToSeconds(end)]);

  assert.ok(ranges.length >= 6, 'presentation needs plausible timed sections');
  assert.equal(ranges[0][0], 0);
  assert.equal(ranges.at(-1)[1], 600);
  assert.equal(ranges.reduce((sum, [start, end]) => sum + end - start, 0), 600);
  ranges.slice(1).forEach(([start], index) => assert.equal(start, ranges[index][1], 'timed ranges must be contiguous'));
  for (const topic of [
    'faculty value',
    'privacy',
    'visible-chat estimate',
    'course memory',
    'commands',
    'optional QTI',
    'manual Canvas',
    'synthetic',
  ]) assert.match(presentation, new RegExp(topic, 'i'));
  assert.match(presentation, /institution-provided packager link is not currently available.+manual Canvas entry/is);
  assert.match(presentation, /use with Bergen Canvas has not been approved/i);
});

test('sample prompts include a safe alias and natural-language example for every workflow', async () => {
  const prompts = await readRequired('src/guides/sample-prompts.md');

  assert.match(prompts, /All examples are synthetic/i);
  for (const alias of aliases) {
    const section = prompts.match(new RegExp(`## bergen:${alias}\\b([\\s\\S]*?)(?=\\n## bergen:|$)`, 'i'));
    assert.ok(section, `missing sample section for bergen:${alias}`);
    assert.match(section[1], /\*\*Alias example\*\*:/i);
    assert.match(section[1], /\*\*Natural-language example\*\*:/i);
    assert.match(section[1], new RegExp(`bergen:${alias}\\b`, 'i'));
  }
  assert.equal(occurrences(prompts, /^\*\*Alias example\*\*:/gm), 12);
  assert.equal(occurrences(prompts, /^\*\*Natural-language example\*\*:/gm), 12);
});

test('the end-to-end demonstration preserves one synthetic course through gated manual handoff', async () => {
  const demonstration = await readRequired('src/guides/end-to-end-demonstration.md');
  const course = 'COM-101: Public Speaking Fundamentals';
  const outcome = 'Construct a clear central claim supported by relevant evidence';
  const concepts = 'central claim, audience, and credible evidence';
  const criteria = ['Central claim', 'Evidence relevance', 'Audience adaptation', 'Organization'];

  assert.ok(occurrences(demonstration, new RegExp(course, 'g')) >= 5, 'one course must remain explicit across the journey');
  assert.ok(occurrences(demonstration, new RegExp(outcome, 'g')) >= 4, 'one outcome must remain aligned across the journey');
  assert.ok(occurrences(demonstration, new RegExp(concepts, 'g')) >= 3, 'introduced concepts must remain consistent');
  for (const criterion of criteria) assert.ok(occurrences(demonstration, new RegExp(criterion, 'g')) >= 2);
  for (const stage of ['Lesson', 'Assignment', 'Rubric', 'Review', 'Revision approval', 'Revise', 'Record proposal']) {
    assert.match(demonstration, new RegExp(`^## .*${stage}`, 'im'));
  }

  const assignmentStart = demonstration.indexOf('## Step 2 — Assignment');
  const rubricStart = demonstration.indexOf('## Step 3 — Rubric');
  const reviewStart = demonstration.indexOf('## Step 4 — Review');
  const approvalStart = demonstration.indexOf('## Step 5 — Revision approval');
  const reviseStart = demonstration.indexOf('## Step 6 — Revise');
  const recordStart = demonstration.indexOf('## Step 7 — Record proposal');
  const canvasStart = demonstration.indexOf('## Step 8 — Canvas Publishing Packet');
  assert.ok(assignmentStart < rubricStart && rubricStart < reviewStart && reviewStart < approvalStart
    && approvalStart < reviseStart && reviseStart < recordStart && recordStart < canvasStart,
  'demonstration stages must stay ordered');

  const assignment = demonstration.slice(assignmentStart, rubricStart);
  const review = demonstration.slice(reviewStart, approvalStart);
  const revise = demonstration.slice(reviseStart, recordStart);
  const record = demonstration.slice(recordStart, canvasStart);
  const publication = demonstration.slice(canvasStart);
  const approvedAddition = 'You may submit the outline as text or as an accessible document.';
  assert.doesNotMatch(assignment, new RegExp(approvedAddition.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
    'the approved revision must not already exist in the assignment draft');
  assert.match(review, /assignment does not offer an accessible submission choice/i);
  assert.match(revise, new RegExp(approvedAddition.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
    'the approved revision must visibly add the reviewed omission');

  assert.equal(occurrences(demonstration, /^\*\*(?:Revision|Record-proposal|Publication-handoff) faculty decision:\*\*/gm), 3,
    'revision, recording, and publication need three distinct faculty decisions');
  assert.match(demonstration, /\*\*Revision faculty decision:\*\*.+approve.+revision/is);
  assert.match(record, /\*\*Record-proposal faculty decision:\*\*.+approve.+record proposal/is);
  assert.match(publication, /\*\*Publication-handoff faculty decision:\*\*.+approve.+prepare.+Canvas publishing handoff/is);
  const recordApproval = record.indexOf('**Record-proposal faculty decision:**');
  const recordSummary = record.indexOf('**Record proposal summary:**');
  const copyReadyBlock = record.indexOf('**Copy-ready record text:**');
  const manualPaste = record.search(/manual paste/i);
  assert.ok(recordSummary >= 0 && recordSummary < recordApproval,
    'a short record proposal summary must precede the record-approval decision');
  assert.ok(recordApproval >= 0 && copyReadyBlock > recordApproval && manualPaste > copyReadyBlock,
    'record approval must precede the copy-ready block and manual Google Docs paste');
  const publicationApproval = publication.indexOf('**Publication-handoff faculty decision:**');
  const packetPreparation = publication.indexOf('Bergen Memory Bank prepares a **Canvas Publishing Packet**');
  assert.ok(publicationApproval >= 0 && packetPreparation > publicationApproval,
    'publication-handoff approval must precede preparation of the Canvas Publishing Packet');
  assert.match(publication, /prepares a \*\*Canvas Publishing Packet\*\*[\s\S]+faculty.+review.+manual(?:ly)? transfer.+save.+publish/i,
    'packet preparation must be followed by faculty review, manual transfer, saving, and publication');
  assert.match(demonstration, /review.+does not revise/is);
  assert.match(demonstration, /explicit faculty approval.+before.+revision/is);
  assert.match(demonstration, /Canvas Publishing Packet/i);
  assert.match(demonstration, /manual(?:ly)? (?:copy|paste|transfer)/i);
  assert.match(demonstration, /optional quiz\/QTI branch/i);
  assert.match(demonstration, /institution-provided packager link is unavailable.+manual Canvas entry/is);
  assert.match(demonstration, /Bergen compatibility is not approved/i);
});

test('troubleshooting and QTI handoff cover safe recovery, complete import steps, and distinct review gates', async () => {
  const [troubleshooting, qti] = await Promise.all([
    readRequired('src/guides/troubleshooting.md'),
    readRequired('src/guides/qti-canvas-handoff.md'),
  ]);
  for (const topic of [
    'unknown command',
    'missing or ambiguous course',
    'missing document',
    'conflicting context',
    'protected-data recovery',
    'long chat',
    'Gem knowledge limitation',
    'QTI unavailable',
    'invalid quiz',
    'import failure',
    'manual copy fallback',
  ]) assert.match(troubleshooting, new RegExp(topic, 'i'));

  assert.match(qti, /assignment text.+manual copy/is);
  assert.match(qti, /approved exams? or quizzes?.+Bergen Quiz Transfer Block/is);
  assert.match(qti, /browser-only packager.+institution link.+available/is);
  for (const type of ['multiple choice', 'true/false', 'multiple answer', 'short answer', 'essay']) assert.match(qti, new RegExp(type, 'i'));
  assert.match(qti, /unsupported.+manual entry/is);
  assert.match(qti, /no student data/i);
  assert.match(qti, /local ZIP/i);
  assert.match(qti, /unpublished Canvas test course/i);
  assert.match(qti, /Settings.+Import Course Content.+QTI \.zip file.+choose file.+Import/is);
  assert.match(qti, /wait until Canvas reports.+import complete.+before.+open.+unpublished quiz/is);
  assert.match(qti, /ordinary quiz.+review every item type actually present/is);
  assert.match(qti, /separate synthetic compatibility package.+all five supported item types.+required manual compatibility check/is);
  assert.match(qti, /review.+before.+publish/is);
  assert.match(qti, /institution-provided packager link is not currently available.+manual Canvas entry/is);
  assert.match(qti, /does not connect directly to Canvas/i);
  assert.match(qti, /do not place quiz content in (?:the )?(?:address bar|web address)/i);
  assert.match(qti, /use with Bergen Canvas has not been approved/i);
});
