import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const repositoryFile = (relativePath) => new URL(`../../${relativePath}`, import.meta.url);

const workflows = [
  ['help', 'Help'],
  ['setup', 'Setup'],
  ['init <course>', 'Initialize'],
  ['resume <course>', 'Resume'],
  ['memory', 'Memory'],
  ['course', 'Course'],
  ['lesson', 'Lesson'],
  ['assignment', 'Assignment'],
  ['rubric', 'Rubric'],
  ['reinforce', 'Reinforce'],
  ['review', 'Review'],
  ['revise', 'Revise'],
  ['message', 'Message'],
  ['reflect', 'Reflect'],
  ['record', 'Record'],
  ['package course', 'Package Course'],
  ['package assessment', 'Package Assessment'],
];

async function readInstructions() {
  try {
    return await readFile(repositoryFile('src/gem/bergen-memory-bank-instructions.md'), 'utf8');
  } catch (error) {
    assert.fail(`Expected Phase 2 Gem instructions to exist: ${error.message}`);
  }
}

async function readScenarios() {
  const source = await readFile(repositoryFile('tests/fixtures/workflow-scenarios.json'), 'utf8');
  return JSON.parse(source);
}

async function readCourseTransferSchema() {
  const source = await readFile(repositoryFile('src/contracts/bergen-course-transfer-v0.1.json'), 'utf8');
  return JSON.parse(source);
}

function inferSchemaType(schema) {
  if (schema.type) return schema.type;
  if (Object.hasOwn(schema, 'const')) return typeof schema.const;
  if (schema.enum?.length > 0 && schema.enum.every((value) => typeof value === typeof schema.enum[0])) {
    return typeof schema.enum[0];
  }
  return undefined;
}

function schemaSignature(schema, required) {
  const parts = [`required=${required}`];
  const type = inferSchemaType(schema);
  if (type) parts.push(`type=${type}`);
  if (Object.hasOwn(schema, 'const')) parts.push(`const=${JSON.stringify(schema.const)}`);
  if (schema.enum) parts.push(`enum=${schema.enum.map((value) => JSON.stringify(value)).join(',')}`);
  for (const key of ['pattern', 'minLength', 'maxLength', 'minimum', 'maximum', 'minItems', 'maxItems', 'uniqueItems']) {
    if (Object.hasOwn(schema, key)) parts.push(`${key}=${schema[key]}`);
  }
  if (schema.additionalProperties === false) parts.push('additionalProperties=false');
  if (schema.required) parts.push(`requiredProperties=${schema.required.join(',')}`);
  return parts.join('; ');
}

function collectCourseTransferSchemaSurface(schema) {
  const surface = new Map();
  const resolve = (node) => node.$ref
    ? schema.$defs[node.$ref.slice('#/$defs/'.length)]
    : node;
  const visit = (unresolvedNode, path, required) => {
    const node = resolve(unresolvedNode);
    surface.set(path, schemaSignature(node, required));
    const requiredProperties = new Set(node.required ?? []);
    for (const [property, child] of Object.entries(node.properties ?? {})) {
      visit(child, `${path}.${property}`, requiredProperties.has(property));
    }
    if (node.items) visit(node.items, `${path}[]`, true);
  };
  visit(schema, '$', true);
  return surface;
}

function assertContainsAll(source, requiredText, contractName) {
  for (const text of requiredText) {
    assert.ok(source.includes(text), `${contractName} must include: ${text}`);
  }
}

test('classic Gem instructions establish an always-on privacy and capability kernel', async () => {
  const instructions = await readInstructions();

  assert.match(instructions, /^# Bergen Memory Bank â€” Classic Custom Gem Instructions$/m);
  assert.match(instructions, /## Always-on privacy and capability kernel/);
  assert.match(instructions, /apply this kernel before routing, retrieval, drafting, review, revision, recording, or handoff/i);
  assert.match(instructions, /Canvas is the student-record system/i);
  assert.match(instructions, /prompt aliases are conversational conventions/i);
  assert.match(instructions, /not native Gemini commands, plugins, integrations, custom actions, or additional system access/i);
  assert.match(instructions, /classic custom Gem/i);
  assert.match(instructions, /no Git, terminal, API, code, or developer tooling/i);
});

test('router recognizes all seventeen aliases case-insensitively with optional parameters and natural-language parity', async () => {
  const instructions = await readInstructions();

  assert.match(instructions, /match `bergen:<workflow>` case-insensitively/i);
  assert.match(instructions, /preserve any text after the alias as the faculty member['â€™]s request or parameters/i);
  assert.match(instructions, /natural-language equivalent/i);
  assert.match(instructions, /same workflow, context rules, privacy checks, stage behavior, and approval gates/i);
  assert.match(instructions, /when intent is ambiguous, ask one brief routing question/i);
  assert.match(instructions, /do not claim that an alias provides an integration or extra authority/i);
  for (const [alias, name] of workflows) {
    assert.match(instructions, new RegExp(`bergen:${alias}\`?\\s*\\|\\s*${name}`, 'i'));
  }
});

test('recognized workflow responses have exact headers, observable context, and exact final lines', async () => {
  const instructions = await readInstructions();

  assert.match(instructions, /The first line must be exactly `Bergen Memory Bank Â· <Workflow Name>`/);
  assert.match(instructions, /Course: <selected course or "Not required for this request">/);
  assert.match(instructions, /Context used: <attached document names or "None">/);
  assert.match(instructions, /Faculty-supplied facts: <minimum facts used or "None yet">/);
  assert.match(instructions, /Missing or conflicting context: <specific gap or "None">/);
  assert.match(instructions, /The final two lines must be exactly:/);
  assert.match(instructions, /`Current stage: <stage>`/);
  assert.match(instructions, /`Recommended next command: bergen:<workflow>`/);
  for (const [, name] of workflows) {
    assert.ok(instructions.includes(`Bergen Memory Bank Â· ${name}`), `missing exact ${name} header contract`);
  }
});

test('course and context selector asks only the minimum question and does not invent persistence', async () => {
  const instructions = await readInstructions();

  assert.match(instructions, /explicit course selection/i);
  assert.match(instructions, /echo the selected course before using Course Memory or Active Workbench/i);
  assert.match(instructions, /do not claim that a course selection persists into a new Gemini chat/i);
  assert.match(instructions, /ask at most one blocking question at a time/i);
  assert.match(instructions, /if the available safe context is sufficient, ask no question/i);
  assert.match(instructions, /identify missing or conflicting context rather than inventing it/i);
  assert.match(instructions, /minimum necessary context/i);
});

test('stage engine follows Remember through Record without skipping approval gates', async () => {
  const instructions = await readInstructions();

  assert.match(instructions, /Remember â†’ Frame â†’ Plan â†’ Draft â†’ Review â†’ Revise â†’ Record/);
  assertContainsAll(instructions, [
    '**Remember** â€”',
    '**Frame** â€”',
    '**Plan** â€”',
    '**Draft** â€”',
    '**Review** â€”',
    '**Revise** â€”',
    '**Record** â€”',
  ], 'stage engine');
  assert.match(instructions, /stages are observable states, not a requirement to force every request through every stage/i);
  assert.match(instructions, /never skip a required approval gate/i);
});

test('help workflow discovers the complete v2 command set while preserving the safe recovery surface', async () => {
  const instructions = await readInstructions();

  assert.match(instructions, /### `bergen:help` â€” Help/);
  assert.match(instructions, /begin exactly with `Bergen Memory Bank Â· Help`/i);
  assert.match(instructions, /list all seventeen aliases with a plain-language purpose/i);
  assertContainsAll(instructions, [
    'bergen:init <course>',
    'bergen:resume <course>',
    'bergen:memory',
    'bergen:record',
    'bergen:package course',
    'bergen:package assessment',
  ], 'v2 help command set');
  assert.match(instructions, /safe examples and natural-language alternatives/i);
  assert.match(instructions, /protected-data boundary/i);
  assert.match(instructions, /Current stage: Remember/);
  assert.match(instructions, /recommend `bergen:setup` when setup is incomplete; otherwise recommend `bergen:course`/i);
});

test('setup and course workflows preserve the four-document hybrid ownership model', async () => {
  const instructions = await readInstructions();

  assert.match(instructions, /### `bergen:setup` â€” Setup/);
  assert.match(instructions, /### `bergen:course` â€” Course/);
  assertContainsAll(instructions, [
    'Faculty Profile',
    'Course Memory',
    'Active Workbench',
    'Decisions, Reflections, and Reusable Practices',
  ], 'memory-document ownership');
  assert.match(instructions, /Faculty Profile.*shared/s);
  assert.match(instructions, /Course Memory.*course-specific/s);
  assert.match(instructions, /Active Workbench.*course-specific/s);
  assert.match(instructions, /Class Learning Snapshot.*temporary, replaceable section inside Active Workbench/is);
});

test('lesson assignment and rubric workflows stay outcome-aligned and bounded', async () => {
  const instructions = await readInstructions();

  assert.match(instructions, /### `bergen:lesson` â€” Lesson/);
  assert.match(instructions, /### `bergen:assignment` â€” Assignment/);
  assert.match(instructions, /### `bergen:rubric` â€” Rubric/);
  assert.match(instructions, /outcomes, concepts already introduced, timing, learner needs, and accessibility/i);
  assert.match(instructions, /assignment, exam, or quiz/i);
  assert.match(instructions, /criteria.*performance descriptions.*point or scoring structure/is);
  assert.match(instructions, /ask only for missing facts required to produce an aligned draft/i);
});

test('reinforce review and revise workflows separate diagnosis from approved change', async () => {
  const instructions = await readInstructions();

  assert.match(instructions, /### `bergen:reinforce` â€” Reinforce/);
  assert.match(instructions, /### `bergen:review` â€” Review/);
  assert.match(instructions, /### `bergen:revise` â€” Revise/);
  assert.match(instructions, /class-level reinforcement/i);
  assertContainsAll(instructions, [
    'alignment',
    'clarity',
    'accessibility',
    'cognitive load',
    'prerequisite creep',
    'bias',
  ], 'review dimensions');
  assert.match(instructions, /review reports findings and recommendations without rewriting/i);
  assert.match(instructions, /revise only the changes the faculty member explicitly approved/i);
});

test('message reflect and record workflows keep communication, learning, and persistence distinct', async () => {
  const instructions = await readInstructions();

  assert.match(instructions, /### `bergen:message` â€” Message/);
  assert.match(instructions, /### `bergen:reflect` â€” Reflect/);
  assert.match(instructions, /### `bergen:record` â€” Record/);
  assert.match(instructions, /faculty communication/i);
  assert.match(instructions, /teaching reflection/i);
  assert.match(instructions, /propose durable teaching-context updates/i);
  assert.match(instructions, /do not place student-specific observations in a message, reflection, or record/i);
});

test('unknown aliases show help, suggest alternatives, and never invent a workflow', async () => {
  const instructions = await readInstructions();

  assert.match(instructions, /## Unknown-command fallback/);
  assert.match(instructions, /identify the entered alias as unsupported/i);
  assert.match(instructions, /do not invent, execute, or silently reinterpret a workflow/i);
  assert.match(instructions, /show the complete Help workflow/i);
  assert.match(instructions, /suggest the closest supported aliases/i);
  assert.match(instructions, /invite a natural-language restatement/i);
});

test('protected-data detection stops before processing and offers a blank safe snapshot', async () => {
  const instructions = await readInstructions();

  assert.match(instructions, /## Protected-data immediate stop/);
  assert.match(instructions, /stop substantive processing immediately/i);
  assert.match(instructions, /do not echo, quote, transform, summarize, analyze, classify, or retain the protected content/i);
  assert.match(instructions, /Canvas is the student-record system/i);
  assert.match(instructions, /blank de-identified Class Learning Snapshot/i);
  assertContainsAll(instructions, [
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
  ], 'Class Learning Snapshot');
  assert.match(instructions, /do not resume the requested workflow until the faculty member supplies a safe snapshot/i);
});

test('concepts-not-yet-introduced guard blocks prerequisite creep in reinforcement', async () => {
  const instructions = await readInstructions();

  assert.match(instructions, /## Concepts-not-yet-introduced guard/);
  assert.match(instructions, /use only outcomes and concepts already introduced/i);
  assert.match(instructions, /treat "Concepts not yet introduced" and "Knowledge a new activity must not assume" as hard constraints/i);
  assert.match(instructions, /ask for clarification instead of introducing an uncertain concept/i);
  assert.match(instructions, /do not infer prerequisites merely because they are common in the discipline/i);
});

test('revision, durable recording, and packaging require distinct faculty approvals', async () => {
  const instructions = await readInstructions();

  assert.match(instructions, /## Approval gates and manual boundaries/);
  assert.match(instructions, /explicit faculty approval before revision/i);
  assert.match(instructions, /record-specific faculty approval/i);
  assert.match(instructions, /explicit faculty approval before a Canvas publishing handoff/i);
  assert.match(instructions, /revision approval is not record approval/i);
  assert.match(instructions, /approval for one record does not authorize another/i);
  assert.match(instructions, /whole-course review and approval.*distinct from package approval/is);
});

test('record workflow proposes one durable immutable Keep revision and waits for record-specific approval', async () => {
  const instructions = await readInstructions();

  assert.match(instructions, /one atomic immutable Google Keep note/i);
  assert.match(instructions, /BMB \| <COURSE> \| <TYPE> \| <RECORD-SLUG> \| R<NNN> \| <DATE>/);
  assertContainsAll(instructions, [
    'Schema:',
    'Course:',
    'Record ID:',
    'Revision:',
    'Record type:',
    'Memory class:',
    'Status:',
    'Supersedes:',
    'Approval:',
    'Approval evidence:',
    'Timestamp:',
    'Content:',
  ], 'Keep note body schema');
  assert.match(instructions, /Schema: bergen-memory-v2\/0\.1/);
  assert.match(instructions, /Status: Active \| Archived/);
  assert.match(instructions, /leave the superseded note unchanged/i);
  assert.match(instructions, /Google Docs remain an optional curated archive/i);
});

test('whole-course and assessment-only package routes remain approved, manual, and distinct', async () => {
  const instructions = await readInstructions();

  assert.match(instructions, /## Canvas Publishing Packet/);
  assert.match(instructions, /Canvas is the final publishing destination/i);
  assert.match(instructions, /manual faculty transfer, review, saving, and publication/i);
  assert.match(instructions, /## Bergen Quiz Transfer Block/);
  assert.match(instructions, /### `bergen:package course`/);
  assert.match(instructions, /### `bergen:package assessment`/);
  assert.match(instructions, /whole-course review and approval.*distinct from package approval/is);
  assert.match(instructions, /versioned Bergen Course Transfer Block/i);
  assert.match(instructions, /Canvas items default to unpublished/i);
  assertContainsAll(instructions, [
    'quiz settings',
    'item identifiers',
    'prompts',
    'choices',
    'answer keys',
    'point values',
    'supported-type labels',
    'multiple choice',
    'true/false',
    'multiple answer',
    'short answer',
    'essay',
  ], 'Quiz Transfer Block');
  assert.match(instructions, /does not package, generate, or attach a ZIP/i);
  assert.match(instructions, /unsupported or incomplete items.*copy-ready Canvas quiz content/is);
  assert.match(instructions, /confirm that the block contains no student data/i);
  assert.match(instructions, /manual(?:ly)? import.*unpublished Canvas (?:test course|sandbox)/is);
  assert.match(instructions, /assessment-only.*does not require or generate.*\.imscc/is);
});

test('syllabus-to-course workflows accumulate one complete current approved course', async () => {
  const instructions = await readInstructions();

  assert.match(instructions, /## Current approved course/);
  assert.match(instructions, /supplied syllabus.*only source of course-specific facts/is);
  assert.match(instructions, /metadata.*outcomes.*ordered modules and items.*pages.*assignments.*discussions.*rubrics.*quizzes.*exams.*completion rules/is);
  assert.match(instructions, /`bergen:course`.*accumulate.*current approved course/is);
  assert.match(instructions, /`bergen:lesson`.*pages/is);
  assert.match(instructions, /`bergen:assignment`.*assignments.*discussions.*quizzes.*exams/is);
  assert.match(instructions, /`bergen:rubric`.*rubrics/is);
  assert.match(instructions, /accessibility and alignment review.*whole-course review/is);
  assert.match(instructions, /never fill a missing fact with a placeholder, sample, or hidden-memory value/i);
});

test('course packaging emits exactly one 0.1 JSON block only after separate final-review and package approvals', async () => {
  const instructions = await readInstructions();
  const fixture = await readScenarios();
  const aliasScenario = fixture.scenarios.find(({ id }) => id === 'alias-package-course');
  const approvedScenario = fixture.scenarios.find(({ id }) => id === 'natural-language-package-course');

  assert.match(instructions, /emit no Bergen Course Transfer Block before final-review approval/i);
  assert.match(instructions, /final-review approval does not grant package approval/i);
  assert.match(instructions, /package approval does not retroactively approve the course design/i);
  assert.match(instructions, /exactly one fenced JSON object/i);
  assert.match(instructions, /"format": "bergen-course-transfer"/);
  assert.match(instructions, /"version": "0\.1"/);
  assert.match(instructions, /do not emit a Bergen Course Transfer Block from any other workflow/i);
  assert.deepEqual(aliasScenario.expectedCourseTransfer, {
    emitsBlock: false,
    requiresFinalReviewApproval: true,
    requiresPackageApproval: true,
  });
  assert.deepEqual(approvedScenario.expectedCourseTransfer, {
    emitsBlock: true,
    blockCount: 1,
    format: 'bergen-course-transfer',
    version: '0.1',
    inputDerived: true,
    canvasFacingPublished: false,
  });
  assert.match(instructions, /QTI assessment-only route.*five supported item types/i);
});

test('Gem embeds a complete normative v0.1 field map and semantic rule map', async () => {
  const instructions = await readInstructions();
  const schema = await readCourseTransferSchema();
  const sectionMatch = instructions.match(/## Normative Bergen Course Transfer Block v0\.1([\s\S]*?)(?=\n## )/);

  assert.ok(sectionMatch, 'Gem instructions must contain the normative v0.1 contract section');
  const section = sectionMatch[1];
  const fieldRows = new Map([...section.matchAll(/^\| `([^`]+)` \| `([^`]*)` \|$/gm)]
    .map((match) => [match[1], match[2]]));
  assert.deepEqual([...fieldRows.entries()], [...collectCourseTransferSchemaSurface(schema).entries()]);

  const semanticRuleIds = [...section.matchAll(/^\| `(rule\.[^`]+)` \|/gm)].map((match) => match[1]);
  assert.deepEqual(semanticRuleIds, [
    'rule.identity.unique',
    'rule.order.modules',
    'rule.order.module-items',
    'rule.placement.complete',
    'rule.rubric.relationships',
    'rule.rubric.points',
    'rule.assessment.multiple-choice',
    'rule.assessment.multiple-answer',
    'rule.assessment.true-false',
    'rule.assessment.short-answer',
    'rule.assessment.essay',
    'rule.assessment.points',
    'rule.completion.relationships',
    'rule.completion.minimum-score',
    'rule.reference.contains',
    'rule.reference.uses-rubric',
    'rule.reference.requires',
    'rule.reference.links-to',
    'rule.metadata.coherence',
    'rule.approval.separate',
    'rule.privacy.short-circuit',
    'rule.privacy.input-derived',
    'rule.canvas.unpublished',
    'rule.content.plain-text',
    'rule.scoring.precision',
    'rule.output.single-block',
    'rule.qti.assessment-only',
  ]);
});

test('verified active course records may restore approved facts while conflicts stop work and naming stays canonical', async () => {
  const instructions = await readInstructions();

  assert.match(instructions, /verified active `Course fact` and `Course outcome` records may restore approved course facts/i);
  assert.match(instructions, /unresolved or conflicting syllabus facts stop course-dependent work/i);
  assert.match(instructions, /current approved course/i);
  assert.match(instructions, /QTI assessment-only route/i);
  assert.doesNotMatch(instructions, /course-design ledger/i);
});

test('Gem normative discussion relationships and Phase 4 naming match the validator contract', async () => {
  const instructions = await readInstructions();

  assert.match(
    instructions,
    /A uses-rubric reference runs from an assignment or discussion to its exact rubricRef target\./,
  );
  assert.match(instructions, /ungraded discussions have zero points/i);
  assert.doesNotMatch(instructions, new RegExp(['current approved course', 'design'].join(' '), 'i'));
  assert.doesNotMatch(instructions, new RegExp(['five-item', 'QTI transfer route'].join(' '), 'i'));
  assert.match(instructions, /current approved course/i);
  assert.match(instructions, /QTI assessment-only route/i);
});

test('initialization uses the supplied syllabus but auto-saves only a meaningful temporary checkpoint', async () => {
  const instructions = await readInstructions();

  assert.match(instructions, /### `bergen:init <course>`/);
  assert.match(instructions, /require an attached or pasted syllabus/i);
  assert.match(instructions, /select and echo the named course/i);
  assert.match(instructions, /propose.*durable syllabus facts/is);
  assert.match(instructions, /durable facts.*never.*automatic authority/is);
  assert.match(instructions, /meaningful state change/i);
  assert.match(instructions, /temporary Active Workbench checkpoint/i);
  assert.match(instructions, /stage and recommended next (?:step|command)/i);
});

test('Keep writes are atomic and report success only after exact-title retrieval and comparison', async () => {
  const instructions = await readInstructions();

  assert.match(instructions, /classify.*approve.*create.*retrieve the exact title.*compare.*report success/is);
  assert.match(instructions, /do not overwrite, edit, append to, or silently merge an existing note/i);
  assertContainsAll(instructions, [
    'Memory action: Created',
    'Keep note: <exact title>',
    'Memory class: Temporary',
    'Memory class: Durable',
    'Approval: Automatic low-risk',
    'Approval: Faculty approved',
    'Verification:',
  ], 'verified Keep success response');
  assert.match(instructions, /only after.*exactly one exact-title result.*required fields and content match/is);
});

test('Keep failures preserve safe proposed content and offer only in-chat recovery choices', async () => {
  const instructions = await readInstructions();

  assertContainsAll(instructions, [
    'create failure',
    'exact-title retrieval failure',
    'content mismatch',
    'duplicate exact title',
    'unavailable result',
    'Memory action: Failed',
    'Retry memory write',
    'Continue without persistence',
  ], 'Keep failure contract');
  assert.match(instructions, /preserve the safe proposed content.*current Gemini conversation/is);
  assert.match(instructions, /offer only `Retry memory write` or `Continue without persistence`/i);
  assert.match(instructions, /never claim.*saved or verified/is);
  assert.match(instructions, /do not direct.*manual Keep repair/is);
});

test('resume retrieves only one course and surfaces invalid revision evidence without guessing', async () => {
  const instructions = await readInstructions();

  assert.match(instructions, /### `bergen:resume <course>`/);
  assert.match(instructions, /retrieve only.*selected course.*BMB notes/is);
  assert.match(instructions, /follow valid `Supersedes` chains/i);
  assert.match(instructions, /select the newest verified active record/i);
  assert.match(instructions, /exact Keep note titles used/i);
  assertContainsAll(instructions, [
    'missing note',
    'ambiguous record',
    'conflicting active records',
    'broken Supersedes chain',
    'revision gap',
    'schema error',
  ], 'resume conflict cases');
  assert.match(instructions, /do not guess, merge, or use another course['â€™]s notes/i);
  assert.match(instructions, /Current stage.*Recommended next command/is);
});

test('memory inspection exposes its active basis without inventing hidden retrieval details', async () => {
  const instructions = await readInstructions();

  assert.match(instructions, /### `bergen:memory`/);
  assertContainsAll(instructions, [
    'Selected course:',
    'Active Keep notes:',
    'Memory class:',
    'Superseded records:',
    'Conflicts or missing information:',
    'Last verified write:',
  ], 'memory report');
  assert.match(instructions, /exact active note titles/i);
  assert.match(instructions, /do not claim.*hidden retrieval.*context meter/is);
});

test('protected-data detection precedes every v2 retrieval, write, drafting, transfer, and package route', async () => {
  const instructions = await readInstructions();

  assert.match(instructions, /protected-data check.*before Keep retrieval, Keep creation, course drafting, transfer generation, or packaging/is);
  assert.match(instructions, /do not echo, quote, transform, summarize, analyze, classify, or retain the protected content/i);
  assert.match(instructions, /Canvas is the student-record system/i);
  assert.match(instructions, /blank de-identified Class Learning Snapshot/i);
  assertContainsAll(instructions, [
    'bergen:init',
    'bergen:resume',
    'bergen:memory',
    'bergen:record',
    'bergen:package course',
    'bergen:package assessment',
  ], 'privacy precedence routes');
});

test('visible-chat estimate is conservative, qualified, and avoids false precision', async () => {
  const instructions = await readInstructions();

  assert.match(instructions, /low-confidence conservative visible-chat estimate/i);
  assert.match(instructions, /32,000 tokens only as an unverified Education Fundamentals working denominator/i);
  assert.match(instructions, /not actual context remaining/i);
  assert.match(instructions, /hidden or system instructions, Gem instructions, retrieved knowledge, and actual model capacity/i);
  assert.match(instructions, /round conservatively/i);
  assert.match(instructions, /below approximately 50%.*may continue/is);
  assert.match(instructions, /approximately 50â€“70%.*`bergen:record` soon/is);
  assert.match(instructions, /above approximately 70%.*record and start a new chat/is);
  assert.match(instructions, /restart earlier if decisions are lost or courses become mixed/i);
  assert.match(instructions, /hallucinations can occur at any percentage/i);
  assert.match(instructions, /context pressure is only one possible contributor/i);
  assert.match(instructions, /if a defensible estimate cannot be produced from visible content, say so instead of fabricating one/i);
});

test('synthetic scenario fixture maps inherited workflows and Phase 4 transfer behavior to observable response contracts', async () => {
  const instructions = await readInstructions();
  const fixture = await readScenarios();

  assert.equal(fixture.metadata.dataClassification, 'synthetic/de-identified');
  assert.equal(fixture.metadata.containsRealStudentData, false);
  assert.equal(fixture.metadata.phase, 'phase-4');
  assert.deepEqual(fixture.metadata.coverage, {
    inherited: ['phase-2 workflow routing', 'phase-3 memory behavior'],
    current: ['phase-4 course transfer'],
  });
  assert.equal(fixture.scenarios.length, 37);
  assert.equal(new Set(fixture.scenarios.map(({ id }) => id)).size, 37);

  const aliasScenarios = new Map(fixture.scenarios
    .filter(({ id }) => id.startsWith('alias-'))
    .map((scenario) => [scenario.expectedWorkflow.toLowerCase(), scenario]));
  for (const [alias, name] of workflows) {
    const scenario = aliasScenarios.get(name.toLowerCase());
    assert.ok(scenario, `fixture must include the ${alias} alias`);
    assert.equal(scenario.expectedHeader, `Bergen Memory Bank Â· ${name}`);
    assert.match(scenario.expectedNextCommand, /^bergen:(?:help|setup|init|resume|memory|course|lesson|assignment|rubric|reinforce|review|revise|message|reflect|record|package course|package assessment)$/);
  }

  const phaseTwoScenarioIds = fixture.scenarios.map(({ id }) => id);
  assertContainsAll(phaseTwoScenarioIds, [
    'alias-init',
    'alias-resume',
    'alias-memory',
    'alias-package-course',
    'alias-package-assessment',
    'natural-language-init',
    'natural-language-resume',
    'natural-language-memory',
    'natural-language-package-course',
    'natural-language-package-assessment',
    'init-temporary-checkpoint',
    'record-durable-revision',
    'write-failure-create',
    'write-failure-exact-title-retrieval',
    'write-failure-content-mismatch',
    'write-failure-duplicate-exact-title',
    'write-failure-unavailable',
    'resume-conflict',
    'memory-report',
  ], 'Phase 4 regression scenario IDs');

  for (const scenario of fixture.scenarios) {
    assert.ok(scenario.expectedHeader.startsWith('Bergen Memory Bank Â· '));
    assert.ok(scenario.expectedStage.length > 0);
    assert.ok(scenario.expectedContext.length > 0);
    assert.ok(scenario.expectedSafeguards.length > 0);
  }
  assert.match(instructions, /## Scenario coverage commitments/);
});

test('Record stage and alias scenario use verified Keep persistence instead of manual Google Docs', async () => {
  const instructions = await readInstructions();
  const fixture = await readScenarios();
  const recordScenario = fixture.scenarios.find(({ id }) => id === 'alias-record');

  assert.doesNotMatch(
    instructions,
    /\*\*Record\*\*[^\r\n]*manual placement in one named document/i,
    'Record stage must not retain the v1 manual document path',
  );
  assert.match(
    instructions,
    /\*\*Record\*\*[^\r\n]*propose one durable record[^\r\n]*record-specific approval[^\r\n]*create one immutable note[^\r\n]*retrieve the exact title[^\r\n]*compare[^\r\n]*report/i,
  );
  assert.ok(recordScenario, 'alias-record scenario must exist');
  assert.equal(recordScenario.expectedContext, 'One proposed durable record and its observable Keep result');
  assert.equal(recordScenario.expectedNextCommand, 'bergen:memory');
  assert.deepEqual(recordScenario.expectedSafeguards, [
    'record-specific faculty approval',
    'one immutable Keep note',
    'exact-title retrieval and full comparison',
  ]);
  assert.ok(!JSON.stringify(recordScenario).includes('Google Docs'));
});

test('Gem note body is structurally identical to the normative immutable-memory fields', async () => {
  const instructions = await readInstructions();

  assert.match(instructions, /Record ID: <COURSE>\/<TYPE>\/<RECORD-SLUG>/);
  assert.match(instructions, /Timestamp: <ISO 8601 timestamp with offset>/);
  assert.match(instructions, /Content:\r?\n<complete intended record content>/);
  assert.match(
    instructions,
    /Schema: bergen-memory-v2\/0\.1\r?\nCourse: <COURSE>\r?\nRecord ID: <COURSE>\/<TYPE>\/<RECORD-SLUG>\r?\nRevision: R<NNN>\r?\nRecord type: <allowed record type>\r?\nMemory class: Temporary \| Durable\r?\nStatus: Active \| Archived\r?\nSupersedes: None \| <exact prior note title>\r?\nApproval: Automatic low-risk \| Faculty approved\r?\nApproval evidence: <meaningful state change> \| <exact approval statement from the current conversation>\r?\nTimestamp: <ISO 8601 timestamp with offset>\r?\nContent:\r?\n<complete intended record content>/,
  );
});

test('Gem lists every allowed record type and treats Replacement and Archive only as actions', async () => {
  const instructions = await readInstructions();

  assertContainsAll(instructions, [
    'Workflow checkpoint',
    'Temporary idea',
    'Open question',
    'Missing course information',
    'De-identified Active Workbench summary',
    'Faculty profile',
    'Course fact',
    'Course outcome',
    'Course policy',
    'Durable decision',
    'Reusable practice',
    'Promoted reflection',
  ], 'allowed memory record types');
  assert.match(instructions, /Replacement and Archive are faculty-approved durable actions, not record types/i);
  assert.match(instructions, /preserve the original record type and stable identity/i);
  assert.match(instructions, /never substitutes `REPLACEMENT` or `ARCHIVE` into the title, `Record ID`, or `Record type` field/i);
});

test('scenario command matrix discovers all seventeen workflows and validates every alias input', async () => {
  const fixture = await readScenarios();
  const helpScenario = fixture.scenarios.find(({ id }) => id === 'alias-help');
  const aliasScenarios = new Map(fixture.scenarios
    .filter(({ id }) => id.startsWith('alias-'))
    .map((scenario) => [scenario.expectedWorkflow, scenario]));

  assert.ok(helpScenario.expectedSafeguards.includes('all seventeen workflows'));
  assert.equal(aliasScenarios.size, workflows.length);
  for (const [alias, workflow] of workflows) {
    const scenario = aliasScenarios.get(workflow);
    const command = `bergen:${alias.replace(/ <course>$/, '')}`;
    assert.ok(scenario, `missing alias scenario for ${alias}`);
    assert.equal(scenario.expectedHeader, `Bergen Memory Bank Â· ${workflow}`);
    assert.match(scenario.input, new RegExp(`^${command.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:\\s|$)`, 'i'));
  }
});

test('scenario matrix gives command safeguards to each equivalent natural-language v2 route', async () => {
  const fixture = await readScenarios();
  const parityCases = [
    ['natural-language-lesson', 'Lesson'],
    ['natural-language-init', 'Initialize'],
    ['natural-language-resume', 'Resume'],
    ['natural-language-memory', 'Memory'],
    ['natural-language-package-course', 'Package Course'],
    ['natural-language-package-assessment', 'Package Assessment'],
  ];

  for (const [id, expectedWorkflow] of parityCases) {
    const scenario = fixture.scenarios.find((candidate) => candidate.id === id);
    assert.ok(scenario, `missing natural-language scenario ${id}`);
    assert.doesNotMatch(scenario.input, /^bergen:/i);
    assert.equal(scenario.expectedWorkflow, expectedWorkflow);
    assert.ok(scenario.expectedSafeguards.includes('natural-language parity') || id === 'natural-language-lesson');
  }
});

test('success, failure, initialization, and later-memory scenarios carry exact observable semantics', async () => {
  const instructions = await readInstructions();
  const fixture = await readScenarios();
  const temporarySuccessFields = [
    'Memory action: Created',
    'Keep note: <exact title>',
    'Memory class: Temporary',
    'Approval: Automatic low-risk',
    'Verification: Retrieved exactly one exact-title note; required fields and content match.',
  ];
  const durableSuccessFields = [
    'Memory action: Created',
    'Keep note: <exact title>',
    'Memory class: Durable',
    'Approval: Faculty approved',
    'Verification: Retrieved exactly one exact-title note; required fields and content match.',
  ];
  const recoveryChoices = ['Retry memory write', 'Continue without persistence'];

  assert.ok(instructions.includes(temporarySuccessFields.join('\n')));
  assert.ok(instructions.includes(durableSuccessFields.join('\n')));
  assert.match(
    instructions,
    /Recovery choices:\r?\n- Retry memory write\r?\n- Continue without persistence/,
  );

  const initScenario = fixture.scenarios.find(({ id }) => id === 'init-temporary-checkpoint');
  assert.equal(initScenario.durableFactsPersisted, false);
  assert.deepEqual(initScenario.expectedSuccessFields, temporarySuccessFields);

  const recordScenario = fixture.scenarios.find(({ id }) => id === 'record-durable-revision');
  assert.deepEqual(recordScenario.expectedSuccessFields, durableSuccessFields);

  const failureScenarios = fixture.scenarios.filter(({ id }) => id.startsWith('write-failure-'));
  assert.equal(failureScenarios.length, 5);
  for (const scenario of failureScenarios) {
    assert.deepEqual(scenario.expectedRecoveryChoices, recoveryChoices);
    assert.equal(scenario.listedAsActiveMemory, false);
  }
});
