import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const memoryContractUrl = new URL('../../src/contracts/bergen-memory-v2.md', import.meta.url);

// Test strategy: verify the observable, storage-neutral memory protocol as one
// cohesive contract. Deliberately not tested: live Keep access, Google internals,
// credentials, background behavior, or real/protected student records.
async function readContract() {
  try {
    return await readFile(memoryContractUrl, 'utf8');
  } catch (error) {
    assert.fail(`Expected the Bergen Memory v2 contract to exist: ${error.message}`);
  }
}

function contractSection(contract, level, heading) {
  const marker = `${'#'.repeat(level)} ${heading}`;
  const start = contract.indexOf(marker);
  assert.notEqual(start, -1, `missing normative section ${heading}`);

  const remainder = contract.slice(start + marker.length);
  const nextHeading = remainder.search(new RegExp(`\\n#{1,${level}} `));
  return nextHeading === -1 ? remainder : remainder.slice(0, nextHeading);
}

function textBlock(section) {
  const match = section.match(/```text\r?\n([\s\S]*?)\r?\n```/);
  assert.ok(match, 'expected an exact text block');
  return match[1];
}

function decisionTable(section, headers) {
  const lines = section.split(/\r?\n/).map((line) => line.trim());
  const header = `| ${headers.join(' | ')} |`;
  const headerIndex = lines.indexOf(header);
  assert.notEqual(headerIndex, -1, `missing decision table header: ${header}`);
  assert.match(lines[headerIndex + 1] ?? '', /^\|(?:\s*:?-+:?\s*\|)+$/,
    'decision table needs a Markdown separator row');

  const rows = [];
  for (const line of lines.slice(headerIndex + 2)) {
    if (!line.startsWith('|') || !line.endsWith('|')) break;
    const cells = line.slice(1, -1).split('|').map((cell) => cell.trim());
    assert.equal(cells.length, headers.length, `malformed decision row: ${line}`);
    rows.push(Object.fromEntries(headers.map((name, index) => [name, cells[index]])));
  }
  assert.ok(rows.length > 0, 'decision table needs at least one scenario row');
  return rows;
}

test('atomic notes use the exact immutable title and one ordered body schema', async () => {
  const contract = await readContract();
  const title = contractSection(contract, 2, 'Exact atomic note title');
  const body = contractSection(contract, 2, 'Exact atomic note body');

  assert.match(title, /BMB \| <COURSE> \| <TYPE> \| <RECORD-SLUG> \| R<NNN> \| <DATE>/);
  assert.match(title, /uppercase course code/i);
  assert.match(title, /uppercase, hyphenated/i);
  assert.match(title, /three-digit, monotonically increasing revision beginning with `R001`/i);
  assert.match(title, /`YYYY-MM-DD`/);
  assert.match(title, /title is immutable/i);

  const schema = textBlock(body);
  const fields = [
    'Schema',
    'Course',
    'Record ID',
    'Revision',
    'Record type',
    'Memory class',
    'Status',
    'Supersedes',
    'Approval',
    'Approval evidence',
    'Timestamp',
    'Content',
  ];
  const labels = schema.match(/^[A-Za-z ]+:/gm)?.map((label) => label.slice(0, -1));
  assert.deepEqual(labels, fields, 'required body fields must appear once in the normative order');
  assert.match(schema, /^Schema: bergen-memory-v2\/0\.1$/m);
  assert.match(schema, /^Timestamp: <ISO 8601 timestamp with offset>$/m);
  assert.match(body, /No field may be omitted/i);
});

test('the allow-list separates meaningful low-risk checkpoints from approved durable memory', async () => {
  const contract = await readContract();
  const authority = contractSection(contract, 2, 'Authority and privacy boundary');
  const temporaryTypes = [
    'Workflow checkpoint',
    'Temporary idea',
    'Open question',
    'Missing course information',
    'De-identified Active Workbench summary',
  ];
  const durableTypes = [
    'Faculty profile',
    'Course fact',
    'Course outcome',
    'Course policy',
    'Durable decision',
    'Reusable practice',
    'Promoted reflection',
  ];

  for (const recordType of temporaryTypes) {
    assert.match(authority, new RegExp(`\\| ${recordType} \\| Temporary \\| Automatic low-risk \\|`, 'i'));
  }
  for (const recordType of durableTypes) {
    assert.match(authority, new RegExp(`\\| ${recordType} \\| Durable \\| Faculty approved \\|`, 'i'));
  }
  assert.equal([...authority.matchAll(/^\| [^|]+ \| (?:Temporary|Durable) \| (?:Automatic low-risk|Faculty approved) \|/gm)].length, 12,
    'the normative record-type allow-list must contain only the twelve approved types');
  assert.match(authority, /temporary lesson or assignment ideas/i);
  assert.match(authority, /workflow stage and (?:recommended )?next step/i);
  assert.match(authority, /open questions? (?:and|or) missing (?:course )?(?:information|facts?)/i);
  assert.match(authority, /de-identified (?:Active Workbench )?summar(?:y|ies)/i);
  assert.match(authority, /Replacement and Archive are faculty-approved durable actions, not record types/i);
  assert.doesNotMatch(authority, /^\| (?:Replacement|Archive) \|/m);
});

test('durable authority is exact-record and exact-revision approval that cannot be reused', async () => {
  const contract = await readContract();
  const authority = contractSection(contract, 2, 'Authority and privacy boundary');

  assert.match(authority, /faculty approval applies only to the exact displayed record and revision/i);
  assert.match(authority, /approval to review, revise, replace, archive, or record something else is not reusable authority/i);
  assert.match(authority, /replacement and archive.+each action requires approval for the exact displayed successor revision/is);
});

test('revisions are append-only, consecutive, and linked to the exact prior title', async () => {
  const contract = await readContract();
  const revision = contractSection(contract, 2, 'Immutable revisions and status');

  assert.match(revision, /append-only/i);
  assert.match(revision, /prior note remains unchanged/i);
  assert.match(revision, /exact prior note title/i);
  assert.match(revision, /Revision numbers must be consecutive/i);
  assert.match(contract, /`Supersedes: None` is required for R001/i);
  assert.match(contract, /R002 and later require the exact prior note title/i);
  assert.match(revision, /replacement.+`Status: Active`/i);
  assert.match(revision, /archive head.+`Status: Archived`/i);
});

test('write verification is create then exact-title retrieve then full compare then report', async () => {
  const contract = await readContract();
  const verification = contractSection(contract, 2, 'Required write verification');
  const create = verification.indexOf('Create one new atomic note');
  const retrieve = verification.indexOf('Retrieve the exact title that was just created');
  const compare = verification.indexOf('Compare every body field and the full content');
  const report = verification.indexOf('Report the result only after comparison finishes');

  assert.ok(create >= 0 && create < retrieve && retrieve < compare && compare < report,
    'observable write verification must preserve create -> retrieve -> compare -> report ordering');
  assert.match(verification, /one exact-title match and a full title-and-body match/i);
  for (const label of [
    'Memory action: Created',
    'Keep note: <exact title>',
    'Memory class:',
    'Approval:',
    'Verification:',
  ]) assert.match(verification, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(verification, /Repository structure evidence or a create confirmation alone is not verification/i);
});

test('failed creation or verification stays visible but never becomes active memory', async () => {
  const contract = await readContract();
  const failures = contractSection(contract, 2, 'Conflicts and conservative failure states');

  for (const failure of [
    'Creation failure',
    'no exact-title match',
    'multiple exact-title matches',
    'incomplete retrieval',
    'field or content mismatch',
    'unavailable connected-app access',
  ]) assert.match(failures, new RegExp(failure, 'i'));
  assert.match(failures, /Memory action: Failed/);
  assert.match(failures, /not active memory.+not listed as verified/is);
  assert.match(failures, /safe content remains visible in the current Gemini conversation/i);
  assert.match(failures, /only persistence recovery choices are `Retry memory write` and `Continue without persistence`/i);
  assert.match(failures, /must not direct faculty to open, rename, label, merge, or repair Keep manually/i);
});

test('privacy stops before retrieval or persistence and leaves Canvas as the sole student-record system', async () => {
  const contract = await readContract();
  const privacy = contractSection(contract, 2, 'Authority and privacy boundary');
  const externalGate = contractSection(contract, 2, 'External verification gate');

  assert.match(privacy, /Canvas remains the student-record system/i);
  assert.match(privacy, /privacy check runs before any Keep retrieval or note creation/i);
  assert.match(privacy, /processing stops without echoing or transforming that content/i);
  assert.match(privacy, /No note is retrieved or created, and no success is reported/i);
  assert.match(externalGate, /repository establishes the protocol only/i);
  assert.match(contract, /not Google Keep API code/i);
  assert.match(contract, /does not claim access to an unobserved Google capability/i);
});

test('retrieval excludes other courses before grouping and validates stable identity consistency', async () => {
  const contract = await readContract();
  const retrieval = contractSection(contract, 2, 'Course isolation and retrieval');
  const exclusion = retrieval.indexOf('exclude every note for any other course');
  const grouping = retrieval.indexOf('before grouping records');

  assert.ok(exclusion >= 0 && grouping > exclusion, 'cross-course notes must be excluded before grouping');
  assert.match(retrieval, /explicitly selected course/i);
  assert.match(retrieval, /exact BMB titles.+body `Course` field match that course/is);
  assert.match(retrieval, /For each stable `Record ID`/i);
  assert.match(retrieval, /validates every required body field and the complete `Supersedes` chain/i);
  assert.match(contract, /title `TYPE`, `Record ID`, and `Record type` are stable across the complete revision chain/i);
  assert.match(contract, /`Course`, `Record ID`, the course segment of the title, and any `Supersedes` title must agree/i);
});

test('revision decisions treat a valid active replacement and archived head as deterministic, not conflicting', async () => {
  const contract = await readContract();
  const revisionTable = decisionTable(
    contractSection(contract, 3, 'Revision-chain decision table'),
    ['Scenario', 'Validated state', 'Classification', 'Active-memory result'],
  );

  assert.deepEqual(revisionTable.slice(0, 2), [
    {
      Scenario: 'Valid active replacement',
      'Validated state': '`R001 Active` is exactly superseded by `R002 Active`; `R002` is the only effective head',
      Classification: 'Valid; two stored Active statuses are not a conflict',
      'Active-memory result': 'Select `R002`; report `R001` as effectively superseded',
    },
    {
      Scenario: 'Valid archived head',
      'Validated state': '`R001 Active` is exactly superseded by `R002 Archived`; `R002` is the only effective head',
      Classification: 'Valid archived chain',
      'Active-memory result': 'Select no active record; report `R002` as the archived head',
    },
  ]);
});

test('revision decisions reject duplicate identities and every non-deterministic chain shape', async () => {
  const contract = await readContract();
  const revisionTable = decisionTable(
    contractSection(contract, 3, 'Revision-chain decision table'),
    ['Scenario', 'Validated state', 'Classification', 'Active-memory result'],
  );
  const conflictRows = revisionTable.slice(2);

  assert.deepEqual(conflictRows.map(({ Scenario }) => Scenario), [
    'Duplicate revision identity',
    'Duplicate exact title',
    'Competing effective heads',
    'Revision gap',
    'Cycle',
    'Broken link',
    'Cross-course link',
  ]);
  for (const row of conflictRows) {
    assert.equal(row.Classification, 'Unresolved conflict', row.Scenario);
    assert.equal(row['Active-memory result'], 'Select none; surface exact safe titles without using their content', row.Scenario);
  }
  assert.equal(conflictRows.find(({ Scenario }) => Scenario === 'Competing effective heads')?.['Validated state'],
    'More than one effective head remains after validating every `Supersedes` link');
});

test('course candidate decisions filter titles first and quarantine selected-course body mismatches', async () => {
  const contract = await readContract();
  const courseTable = decisionTable(
    contractSection(contract, 3, 'Course candidate decision table'),
    ['Title candidate', 'Body Course result', 'Required decision'],
  );

  assert.deepEqual(courseTable, [
    {
      'Title candidate': 'Other-course BMB title',
      'Body Course result': 'Not inspected for record use',
      'Required decision': 'Exclude before grouping or following links; never use its content',
    },
    {
      'Title candidate': 'Selected-course BMB title',
      'Body Course result': 'Exact selected-course match',
      'Required decision': 'Validate the complete body and revision chain before use',
    },
    {
      'Title candidate': 'Selected-course BMB title',
      'Body Course result': 'Missing',
      'Required decision': 'Surface the exact title as unresolved; do not use its content',
    },
    {
      'Title candidate': 'Selected-course BMB title',
      'Body Course result': 'Mismatch',
      'Required decision': 'Surface the exact title as unresolved; do not use its content',
    },
  ]);
});

test('retry decisions probe first so uncertain prior creation never creates a duplicate', async () => {
  const contract = await readContract();
  const retryTable = decisionTable(
    contractSection(contract, 3, 'Retry decision table'),
    ['Prior attempt', 'Exact-title probe after repeated preflight', 'Required retry action', 'Report'],
  );

  assert.deepEqual(retryTable, [
    {
      'Prior attempt': 'Confirmed create failure',
      'Exact-title probe after repeated preflight': 'Exact title absent',
      'Required retry action': 'Create once, then retrieve and compare',
      Report: 'Created only after one exact full match; otherwise Failed',
    },
    {
      'Prior attempt': 'Create may have succeeded; verification failed',
      'Exact-title probe after repeated preflight': 'One exact full match',
      'Required retry action': 'Do not create; use the match to finish verification',
      Report: 'Created',
    },
    {
      'Prior attempt': 'Create may have succeeded; verification failed',
      'Exact-title probe after repeated preflight': 'One exact title with a body mismatch',
      'Required retry action': 'Do not create or overwrite',
      Report: 'Failed',
    },
    {
      'Prior attempt': 'Create may have succeeded; verification failed',
      'Exact-title probe after repeated preflight': 'Exact title absent',
      'Required retry action': 'Create once, then retrieve and compare',
      Report: 'Created only after one exact full match; otherwise Failed',
    },
    {
      'Prior attempt': 'Create may have succeeded; verification failed',
      'Exact-title probe after repeated preflight': 'Multiple exact-title matches',
      'Required retry action': 'Do not create',
      Report: 'Failed',
    },
    {
      'Prior attempt': 'Create may have succeeded; verification failed',
      'Exact-title probe after repeated preflight': 'Probe unavailable or ambiguous',
      'Required retry action': 'Do not create',
      Report: 'Failed',
    },
  ]);

  const verification = contractSection(contract, 2, 'Required write verification');
  const retry = contractSection(contract, 3, 'Retry decision table');
  assert.match(retry, /repeat the privacy check, relevant course retrieval, and classification before the exact-title probe/i);
  assert.match(verification, /retry.+probe-first.+idempotent/is);
});

test('conflict resolution distinguishes visible-chat continuation from verifiable durable reconciliation', async () => {
  const contract = await readContract();
  const resolutionTable = decisionTable(
    contractSection(contract, 3, 'Conflict-resolution decision table'),
    ['Faculty choice', 'Current-chat result', 'Durable future-resume result'],
  );

  assert.deepEqual(resolutionTable, [
    {
      'Faculty choice': 'Continue from a newly stated safe fact',
      'Current-chat result': 'Use only that faculty-stated fact for this chat; do not use unresolved note content',
      'Durable future-resume result': 'None; the stored chain remains unresolved',
    },
    {
      'Faculty choice': 'Create durable reconciliation',
      'Current-chat result': 'Display a clean new record identity and exact content for approval',
      'Durable future-resume result': 'After normal write verification, use the new clean chain and continue reporting the old record identity as unresolved',
    },
    {
      'Faculty choice': 'Decline or verification fails',
      'Current-chat result': 'Continue without persistence only from visible safe chat context',
      'Durable future-resume result': 'None; do not claim repair or resolution',
    },
  ]);

  const resolution = contractSection(contract, 3, 'Conflict-resolution decision table');
  assert.match(resolution, /new `Record ID` starts at `R001` with `Supersedes: None`/i);
  assert.match(resolution, /old conflicting notes remain immutable and quarantined/i);
  assert.match(resolution, /neither path asks.+(?:edit|delete|rename|merge|repair).+Keep manually/is);
});

test('replacement and archive examples preserve identity while deriving effective status', async () => {
  const contract = await readContract();
  const replacement = contractSection(contract, 3, 'Replacement transition example');
  const archive = contractSection(contract, 3, 'Archive transition example');
  const replacementOriginalTitle = 'BMB | CIS-277 | COURSE-POLICY | LATE-WORK | R001 | 2026-08-26';
  const replacementTitle = 'BMB | CIS-277 | COURSE-POLICY | LATE-WORK | R002 | 2026-08-27';
  const replacementRecordId = 'CIS-277/COURSE-POLICY/LATE-WORK';
  const archiveOriginalTitle = 'BMB | CIS-277 | COURSE-FACT | OFFICE-HOURS | R001 | 2026-08-26';
  const archiveTitle = 'BMB | CIS-277 | COURSE-FACT | OFFICE-HOURS | R002 | 2026-08-28';
  const archiveRecordId = 'CIS-277/COURSE-FACT/OFFICE-HOURS';

  assert.ok(replacement.includes(['| R001 | `', replacementOriginalTitle, '` | `', replacementRecordId, '` | Course policy | Active | None |'].join('')));
  assert.ok(replacement.includes(['| R002 | `', replacementTitle, '` | `', replacementRecordId, '` | Course policy | Active | `', replacementOriginalTitle, '` |'].join('')));
  assert.match(replacement, /Effective head: `R002`/);
  assert.match(replacement, /Effective status: `Active`/);

  assert.ok(archive.includes(['| R001 | `', archiveOriginalTitle, '` | `', archiveRecordId, '` | Course fact | Active | None |'].join('')));
  assert.ok(archive.includes(['| R002 | `', archiveTitle, '` | `', archiveRecordId, '` | Course fact | Archived | `', archiveOriginalTitle, '` |'].join('')));
  assert.match(archive, /Effective head: `R002`/);
  assert.match(archive, /Effective status: `Archived`/);
});
