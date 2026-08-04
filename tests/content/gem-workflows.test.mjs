import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const repositoryFile = (relativePath) => new URL(`../../${relativePath}`, import.meta.url);

const workflows = [
  ['help', 'Help'],
  ['setup', 'Setup'],
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

test('router recognizes all twelve aliases case-insensitively with optional parameters', async () => {
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

test('help workflow is a complete installation-verification and safe recovery surface', async () => {
  const instructions = await readInstructions();

  assert.match(instructions, /### `bergen:help` â€” Help/);
  assert.match(instructions, /begin exactly with `Bergen Memory Bank Â· Help`/i);
  assert.match(instructions, /list all twelve aliases with a plain-language purpose/i);
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
    'Concepts introduced',
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

test('revision recording and publication require explicit human approval and manual action', async () => {
  const instructions = await readInstructions();

  assert.match(instructions, /## Approval gates and manual boundaries/);
  assert.match(instructions, /explicit faculty approval before revision/i);
  assert.match(instructions, /explicit faculty approval before preparing a record update/i);
  assert.match(instructions, /explicit faculty approval before a Canvas publishing handoff/i);
  assert.match(instructions, /approval for one action does not authorize another/i);
  assert.match(instructions, /never claim to have saved, synchronized, modified, imported, or published anything/i);
});

test('record workflow names one target and supplies copy-ready text for manual Google Docs editing', async () => {
  const instructions = await readInstructions();

  assert.match(instructions, /name exactly one primary target document/i);
  assert.match(instructions, /copy-ready text/i);
  assert.match(instructions, /paste it manually into that Google Doc in the Bergen Memory Bank Drive folder/i);
  assert.match(instructions, /attached documents are faculty-controlled references, not automatically editable memory/i);
  assert.match(instructions, /do not claim that the Gem saved, synchronized, modified, or retained the document/i);
});

test('Canvas and quiz handoffs are copy-ready, manual, approved, and safely separable', async () => {
  const instructions = await readInstructions();

  assert.match(instructions, /## Canvas Publishing Packet/);
  assert.match(instructions, /Canvas is the final publishing destination/i);
  assert.match(instructions, /manual faculty transfer, review, saving, and publication/i);
  assert.match(instructions, /## Bergen Quiz Transfer Block/);
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

test('synthetic scenario fixture maps Phase 2 workflows to observable response contracts', async () => {
  const instructions = await readInstructions();
  const fixture = await readScenarios();

  assert.equal(fixture.metadata.dataClassification, 'synthetic/de-identified');
  assert.equal(fixture.metadata.containsRealStudentData, false);
  assert.equal(fixture.metadata.phase, 'phase-2');
  assert.equal(fixture.scenarios.length, 18);
  assert.equal(new Set(fixture.scenarios.map(({ id }) => id)).size, 18);

  const aliasScenarios = new Map(fixture.scenarios
    .filter(({ id }) => id.startsWith('alias-'))
    .map((scenario) => [scenario.expectedWorkflow.toLowerCase(), scenario]));
  for (const [alias, name] of workflows) {
    const scenario = aliasScenarios.get(name.toLowerCase());
    assert.ok(scenario, `fixture must include the ${alias} alias`);
    assert.equal(scenario.expectedHeader, `Bergen Memory Bank Â· ${name}`);
    assert.match(scenario.expectedNextCommand, /^bergen:(?:help|setup|course|lesson|assignment|rubric|reinforce|review|revise|message|reflect|record)$/);
  }

  for (const scenario of fixture.scenarios) {
    assert.ok(scenario.expectedHeader.startsWith('Bergen Memory Bank Â· '));
    assert.ok(scenario.expectedStage.length > 0);
    assert.ok(scenario.expectedContext.length > 0);
    assert.ok(scenario.expectedSafeguards.length > 0);
  }
  assert.match(instructions, /## Scenario coverage commitments/);
});
