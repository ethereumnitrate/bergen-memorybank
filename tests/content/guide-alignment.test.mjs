import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const repositoryFile = (relativePath) => new URL(`../../${relativePath}`, import.meta.url);

async function readRequired(relativePath) {
  try {
    return await readFile(repositoryFile(relativePath), 'utf8');
  } catch (error) {
    assert.fail(`Expected guide ${relativePath} to exist: ${error.message}`);
  }
}

function decisionTable(source, headers) {
  const lines = source.split(/\r?\n/).map((line) => line.trim());
  const header = `| ${headers.join(' | ')} |`;
  const headerIndex = lines.indexOf(header);
  assert.notEqual(headerIndex, -1, `missing guide decision table header: ${header}`);
  assert.match(lines[headerIndex + 1] ?? '', /^\|(?:\s*:?-+:?\s*\|)+$/,
    'guide decision table needs a Markdown separator row');

  const rows = [];
  for (const line of lines.slice(headerIndex + 2)) {
    if (!line.startsWith('|') || !line.endsWith('|')) break;
    const cells = line.slice(1, -1).split('|').map((cell) => cell.trim());
    assert.equal(cells.length, headers.length, `malformed guide decision row: ${line}`);
    rows.push(Object.fromEntries(headers.map((name, index) => [name, cells[index]])));
  }
  assert.ok(rows.length > 0, 'guide decision table needs at least one scenario row');
  return rows;
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
  'src/guides/keep-memory-workflow.md',
  'src/guides/canvas-course-handoff.md',
  'src/guides/qti-canvas-handoff.md',
];

const aliases = [
  'help',
  'setup',
  'init',
  'resume',
  'memory',
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
  'package course',
  'package assessment',
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

test('all faculty guides are present and keep the faculty experience nontechnical', async () => {
  const guides = await Promise.all(guidePaths.map(async (relativePath) => ({
    relativePath,
    source: await readRequired(relativePath),
  })));

  for (const { relativePath, source } of guides) {
    assert.match(source, /^# Bergen Memory Bank/m, `${relativePath} needs a faculty-facing title`);
    assert.doesNotMatch(source, /Phase 5|release item|release gate|\b(?:runtime|API|developer|repository|Git|terminal|programming|deployed|URL)\b|(?<!no-)\bcode\b|(?:src\/|tests\/|memory-bank\/|\.mjs\b|\.md\b|npm\b|GitHub\b|command line|developer workflow)/i,
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
    'durable memory revision',
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
  assert.equal(occurrences(prompts, /^\*\*Alias example\*\*:/gm), 17);
  assert.equal(occurrences(prompts, /^\*\*Natural-language example\*\*:/gm), 17);
});

test('installation, prompts, presentation, and scenario matrix tell one verified Keep-to-Canvas journey', async () => {
  const [installation, prompts, presentation, scenarios] = await Promise.all([
    readRequired('src/guides/installation-guide.md'),
    readRequired('src/guides/sample-prompts.md'),
    readRequired('src/guides/presentation-script.md'),
    readRequired('src/testing/scenario-matrix.md'),
  ]);

  for (const guide of [installation, prompts, presentation]) {
    assert.match(guide, /Google Keep/i);
    assert.match(guide, /retriev(?:e|es|ed|al).+exact (?:new )?(?:Keep )?note.+compar(?:e|es|ed|ison)/is,
      'a successful Keep write must follow exact-note retrieval and comparison');
    assert.match(guide, /fail(?:ed|ure).+visible.+Gemini/is,
      'a failed Keep write must remain visible in Gemini');
  }
  assert.doesNotMatch(installation, /paste.+(?:named )?Google Doc/i);
  assert.doesNotMatch(prompts, /manually paste.+Course Memory|Do not claim to save/i);

  for (const alias of ['bergen:init', 'bergen:resume', 'bergen:memory', 'bergen:package course', 'bergen:package assessment']) {
    assert.match(presentation, new RegExp(alias.replace(' ', '\\s+'), 'i'),
      `presentation must demonstrate ${alias}`);
  }
  assert.match(presentation, /whole course.+local.+\.imscc/is);
  assert.match(presentation, /assessment-only.+QTI.+local ZIP/is);
  assert.match(presentation, /Canvas.+(?:import|publication).+manual/is);

  assert.match(scenarios, /Eleven faculty guides/i);
  assert.match(scenarios, /All seventeen (?:aliases|workflows)/i);
  assert.match(scenarios, /verified Google Keep.+Bergen Course Transfer Block.+local `?\.imscc`?.+unpublished Canvas/is);
  assert.match(scenarios, /whole-course.+\.imscc.+assessment-only.+QTI/is);
  assert.match(scenarios, /connected (?:Gem\/)?Keep.+Pending/i);
  assert.match(scenarios, /Canvas.+publication.+manual/i);
});

test('installation and presentation source-date their new v2 platform claims against the official register entries', async () => {
  const [installation, presentation] = await Promise.all([
    readRequired('src/guides/installation-guide.md'),
    readRequired('src/guides/presentation-script.md'),
  ]);
  const currentKeepSources = [
    'https://support.google.com/gemini/answer/15230597?hl=en',
    'https://support.google.com/gemini/answer/14959807?hl=en',
    'https://support.google.com/a/answer/15293691?hl=en',
  ];
  const currentCoursePackageSources = [
    'https://community.instructure.com/en/kb/articles/660732-how-do-i-import-content-from-common-cartridge-into-canvas',
    'https://community.instructure.com/en/kb/articles/660738-how-do-i-view-the-status-of-current-and-prior-course-imports',
    'https://www.imsglobal.org/cc/ccv1p3/imscc_Implementation-v1p3.html',
  ];

  for (const guide of [installation, presentation]) {
    assert.match(guide, /2026-08-26/, 'new v2 platform claims need the current reviewed-source date');
    assert.match(guide, /2026-08-04/, 'inherited Bergen policy, Gem, and QTI claims keep their v1 review date');
    for (const source of currentKeepSources) {
      assert.ok(guide.includes(source), `missing current official Google Keep source: ${source}`);
    }
  }
  for (const source of currentCoursePackageSources) {
    assert.ok(presentation.includes(source), `missing current official course-package source: ${source}`);
  }
});

test('the end-to-end demonstration preserves one synthetic course through verified memory and gated Canvas handoff', async () => {
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
  const transferStart = demonstration.indexOf('## Step 8 — Whole-course transfer approval');
  const packagerStart = demonstration.indexOf('## Step 9 — Local Course Packager');
  const canvasStart = demonstration.indexOf('## Step 10 — Unpublished Canvas sandbox');
  assert.ok(assignmentStart < rubricStart && rubricStart < reviewStart && reviewStart < approvalStart
    && approvalStart < reviseStart && reviseStart < recordStart && recordStart < transferStart
    && transferStart < packagerStart && packagerStart < canvasStart,
  'demonstration stages must stay ordered');

  const assignment = demonstration.slice(assignmentStart, rubricStart);
  const review = demonstration.slice(reviewStart, approvalStart);
  const revise = demonstration.slice(reviseStart, recordStart);
  const record = demonstration.slice(recordStart, transferStart);
  const publication = demonstration.slice(transferStart);
  const approvedAddition = 'You may submit the outline as text or as an accessible document.';
  assert.doesNotMatch(assignment, new RegExp(approvedAddition.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
    'the approved revision must not already exist in the assignment draft');
  assert.match(review, /assignment does not offer an accessible submission choice/i);
  assert.match(revise, new RegExp(approvedAddition.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
    'the approved revision must visibly add the reviewed omission');

  assert.equal(occurrences(demonstration, /^\*\*(?:Revision|Record-proposal|Publication-handoff) faculty decision:\*\*/gm), 3,
    'revision, recording, and publication need three distinct faculty decisions');
  assert.match(demonstration, /\*\*Revision faculty decision:\*\*.+approve.+revision/is);
  assert.match(record, /\*\*Record-proposal faculty decision:\*\*.+approve.+durable.+record.+revision/is);
  assert.match(publication, /\*\*Publication-handoff faculty decision:\*\*.+approve.+prepare.+whole-course handoff/is);
  const recordApproval = record.indexOf('**Record-proposal faculty decision:**');
  const recordSummary = record.indexOf('**Record proposal summary:**');
  assert.ok(recordSummary >= 0 && recordSummary < recordApproval,
    'a short record proposal summary must precede the record-approval decision');
  const memorySuccess = record.indexOf('Memory action: Created');
  assert.ok(recordApproval >= 0 && memorySuccess > recordApproval,
    'record approval must precede the observable verified-memory result');
  const publicationApproval = publication.indexOf('**Publication-handoff faculty decision:**');
  const transferBlock = publication.indexOf('**Bergen Course Transfer Block**');
  assert.ok(publicationApproval >= 0 && transferBlock > publicationApproval,
    'publication-handoff approval must precede the Bergen Course Transfer Block');
  assert.match(publication, /Course package ready[\s\S]+Download \.imscc[\s\S]+import job reports \*\*Completed\*\*[\s\S]+reviewing \*\*Modules\*\*/i,
    'local readiness and completed Canvas import must precede unpublished review');
  assert.match(demonstration, /review.+does not revise/is);
  assert.match(demonstration, /explicit faculty approval.+before.+revision/is);
  assert.match(demonstration, /Bergen Course Transfer Block/i);
  assert.match(demonstration, /unpublished Canvas sandbox/i);
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
  assert.match(qti, /Bergen Quiz Transfer Block.+approved exam or quiz/is);
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

test('the Keep workflow guide gives executable no-code paths for all four memory commands', async () => {
  const guide = await readRequired('src/guides/keep-memory-workflow.md');

  assert.match(guide, /^# Bergen Memory Bank/m);
  assert.match(guide, /no-code/i);
  assert.doesNotMatch(guide, /\b(?:API|developer|repository|Git|terminal|programming|src\/|tests\/|\.mjs\b|npm\b)\b/i);
  for (const command of ['bergen:init', 'bergen:resume', 'bergen:memory', 'bergen:record']) {
    assert.match(guide, new RegExp(command.replace(':', '\\:'), 'i'), `missing ${command} guidance`);
  }
  assert.match(guide, /initializ(?:e|ation).+supplied syllabus/is);
  assert.match(guide, /automatic.+temporary.+checkpoint/is);
  assert.match(guide, /durable syllabus facts?.+proposed.+faculty approval/is);
  assert.match(guide, /resume.+only.+selected course/is);
  assert.match(guide, /exact (?:Keep )?note titles? used/i);
});

test('the Keep workflow guide explains immutable durable recording and observable verification', async () => {
  const guide = await readRequired('src/guides/keep-memory-workflow.md');

  assert.match(guide, /bergen:record.+displayed.+proposed record.+explicit.+approval/is);
  assert.match(guide, /new revision.+leaves? the (?:prior|earlier) note unchanged/is);
  assert.match(guide, /Supersedes.+exact (?:title|prior note)/is);
  for (const label of [
    'Memory action: Created',
    'Keep note: <exact title>',
    'Memory class: Temporary',
    'Memory class: Durable',
    'Approval: Automatic low-risk',
    'Approval: Faculty approved',
    'Verification:',
  ]) assert.match(guide, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(guide, /create.+retrieve.+compare.+report/is);
});

test('the Keep workflow guide keeps conflicts and write recovery entirely inside Gemini', async () => {
  const guide = await readRequired('src/guides/keep-memory-workflow.md');

  const conflictRows = decisionTable(
    guide,
    ['What Gemini finds', 'What happens now', 'What can persist for a future conversation'],
  );
  assert.deepEqual(conflictRows, [
    {
      'What Gemini finds': 'A clear active replacement chain',
      'What happens now': 'Use the newest active note even though the earlier note still says Active',
      'What can persist for a future conversation': 'The verified chain already provides one current head',
    },
    {
      'What Gemini finds': 'A clear archived head',
      'What happens now': 'Show it as archived and do not use it as active memory',
      'What can persist for a future conversation': 'The verified chain already records the archive',
    },
    {
      'What Gemini finds': 'Broken link, cycle, gap, competing heads, duplicate exact title, or course mismatch',
      'What happens now': 'Do not use the disputed note content; you may approve a newly stated safe fact for this chat only',
      'What can persist for a future conversation': 'Only a separately approved and verified clean record; the old conflict remains visible',
    },
  ]);
  assert.match(guide, /new clean record starts at R001 and does not claim to repair the old immutable notes/i);
  assert.match(guide, /no manual Keep repair/i);
  assert.match(guide, /Memory action: Failed/);
  assert.match(guide, /Retry memory write/);
  assert.match(guide, /Continue without persistence/);

  const retryRows = decisionTable(
    guide,
    ['Retry finds', 'Gemini action'],
  );
  assert.deepEqual(retryRows, [
    { 'Retry finds': 'One exact note whose full body matches', 'Gemini action': 'Verify it and do not create another note' },
    { 'Retry finds': 'No exact note', 'Gemini action': 'Create once, then retrieve and compare' },
    { 'Retry finds': 'One exact title with different content', 'Gemini action': 'Do not create; report failure' },
    { 'Retry finds': 'Multiple exact titles or Keep is unavailable', 'Gemini action': 'Do not create; report failure' },
  ]);
  assert.match(guide, /before every retry.+privacy.+selected course.+record class.+exact intended title/is);
  assert.match(guide, /confirmed creation failure.+may create once/is);
});

test('the v2 faculty guides provide one observable Keep-to-unpublished-Canvas journey while preserving QTI', async () => {
  const requiredGuidePaths = [
    'src/guides/command-reference.md',
    'src/guides/faculty-quick-start.md',
    'src/guides/privacy-checklist.md',
    'src/guides/troubleshooting.md',
    'src/guides/end-to-end-demonstration.md',
    'src/guides/keep-memory-workflow.md',
    'src/guides/canvas-course-handoff.md',
    'src/guides/qti-canvas-handoff.md',
  ];
  const guides = new Map(await Promise.all(requiredGuidePaths.map(async (relativePath) => [
    relativePath,
    await readRequired(relativePath),
  ])));
  const combined = [...guides.values()].join('\n');
  const commandReference = guides.get('src/guides/command-reference.md');
  const keepGuide = guides.get('src/guides/keep-memory-workflow.md');
  const courseHandoff = guides.get('src/guides/canvas-course-handoff.md');
  const qtiHandoff = guides.get('src/guides/qti-canvas-handoff.md');

  for (const alias of [...aliases, 'init', 'resume', 'memory', 'package course', 'package assessment']) {
    assert.match(commandReference, new RegExp(`bergen:${alias.replace(' ', '\\s+')}(?:\\b|$)`, 'i'),
      `command reference must expose bergen:${alias}`);
  }
  assert.match(commandReference, /seventeen workflows/i);
  assert.match(combined, /natural-language request.+same workflow.+safeguards/is);
  for (const label of [
    'Memory action: Created',
    'Keep note: <exact title>',
    'Memory class: Temporary',
    'Memory class: Durable',
    'Approval: Automatic low-risk',
    'Approval: Faculty approved',
    'Verification:',
  ]) assert.match(combined, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(keepGuide, /create.+retrieve.+compare.+report/is);
  assert.match(keepGuide, /Retry memory write.+Continue without persistence/is);
  assert.match(keepGuide, /recovery stays inside Gemini/i);

  assert.match(courseHandoff, /Bergen Course Transfer Block/);
  assert.match(courseHandoff, /Bergen Course Packager/);
  assert.match(courseHandoff, /Course package ready/);
  assert.match(courseHandoff, /Download \.imscc/);
  assert.match(courseHandoff, /Settings.+Import Course Content.+Common Cartridge 1\.x Package/is);
  assert.match(courseHandoff, /wait.+import job.+complete.+before.+review.+Modules/is);
  assert.match(courseHandoff, /unpublished.+review.+publish/is);
  assert.match(courseHandoff, /successful local package.+not.+Bergen Canvas compatibility/is);

  assert.match(qtiHandoff, /assessment-only/i);
  assert.match(qtiHandoff, /Bergen Quiz Transfer Block/);
  assert.match(qtiHandoff, /QTI \.zip file/);
  assert.match(qtiHandoff, /does not require.+whole-course.+\.imscc/is);
  assert.doesNotMatch(combined, /automatically (?:import|publish)|Canvas API/i);
});

test('the Keep workflow guide aligns memory inspection, privacy precedence, and capability limits', async () => {
  const [guide, gem] = await Promise.all([
    readRequired('src/guides/keep-memory-workflow.md'),
    readRequired('src/gem/bergen-memory-bank-instructions.md'),
  ]);

  for (const label of [
    'Selected course:',
    'Active Keep notes:',
    'Memory class:',
    'Superseded records:',
    'Conflicts or missing information:',
    'Last verified write:',
  ]) {
    const expression = new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    assert.match(guide, expression);
    assert.match(gem, expression);
  }
  assert.match(guide, /privacy check.+before.+Keep retrieval.+(?:creation|write|persistence)/is);
  assert.match(guide, /Canvas is the student-record system/i);
  assert.match(guide, /does? not echo|without echoing/i);
  assert.match(guide, /instructions do not prove Keep availability/i);
  assert.match(guide, /verify.+authorized Bergen account/i);
  assert.doesNotMatch(guide, /structural check|release gate|repository/i);
  assert.match(guide, /does not.+(?:invent|claim).+(?:Keep API|hidden|unobserved)/is);
});
