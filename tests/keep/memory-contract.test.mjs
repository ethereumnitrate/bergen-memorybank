import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const memoryContractUrl = new URL('../../src/contracts/bergen-memory-v2.md', import.meta.url);

function contractSection(contract, heading) {
  const marker = `### ${heading}`;
  const start = contract.indexOf(marker);
  assert.notEqual(start, -1, `missing normative section ${heading}`);

  const remainder = contract.slice(start + marker.length);
  const nextHeading = remainder.search(/\n### /);
  return nextHeading === -1 ? remainder : remainder.slice(0, nextHeading);
}

test('memory contract fixes atomic fields, authority, course isolation, revisions, verification, and conservative failures', async () => {
  let contract;
  try {
    contract = await readFile(memoryContractUrl, 'utf8');
  } catch (error) {
    assert.fail(`Expected the Phase 1 memory contract to exist: ${error.message}`);
  }

  assert.match(contract, /BMB \| <COURSE> \| <TYPE> \| <RECORD-SLUG> \| R<NNN> \| <DATE>/);
  for (const field of [
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
  ]) {
    assert.match(contract, new RegExp(`^${field}:`, 'm'), `missing exact body field ${field}`);
  }
  for (const automaticType of [
    'Workflow checkpoint',
    'Temporary idea',
    'Open question',
    'Missing course information',
    'De-identified Active Workbench summary',
  ]) {
    assert.match(contract, new RegExp(`\\| ${automaticType} \\| Temporary \\| Automatic low-risk \\|`, 'i'));
  }
  for (const approvedType of [
    'Faculty profile',
    'Course fact',
    'Course outcome',
    'Course policy',
    'Durable decision',
    'Reusable practice',
    'Promoted reflection',
  ]) {
    assert.match(contract, new RegExp(`\\| ${approvedType} \\| Durable \\| Faculty approved \\|`, 'i'));
  }
  assert.match(contract, /Replacement and Archive are faculty-approved durable actions, not record types/i);
  assert.doesNotMatch(contract, /^\| (?:Replacement|Archive) \| Durable \| Faculty approved \|/m);
  assert.match(contract, /new note.*never (?:edit|overwrite).*prior note/is);
  assert.match(contract, /Supersedes.*exact prior note title/is);
  assert.match(contract, /exclude.*other course/is);
  assert.match(contract, /privacy.*before.*retrieval.*creation/is);
  assert.match(contract, /create.*retrieve the exact title.*compare every body field.*report/is);
  assert.match(contract, /multiple exact-title matches.*Failed/is);
  assert.match(contract, /Retry memory write/);
  assert.match(contract, /Continue without persistence/);
  assert.doesNotMatch(contract, /saved successfully.*(?:without|before).*verif/i);

  const replacement = contractSection(contract, 'Replacement transition example');
  const replacementOriginalTitle = 'BMB | CIS-277 | COURSE-POLICY | LATE-WORK | R001 | 2026-08-26';
  const replacementTitle = 'BMB | CIS-277 | COURSE-POLICY | LATE-WORK | R002 | 2026-08-27';
  const replacementRecordId = 'CIS-277/COURSE-POLICY/LATE-WORK';

  assert.ok(replacement.includes(['| R001 | `', replacementOriginalTitle, '` | `', replacementRecordId, '` | Course policy | Active | None |'].join('')));
  assert.ok(replacement.includes(['| R002 | `', replacementTitle, '` | `', replacementRecordId, '` | Course policy | Active | `', replacementOriginalTitle, '` |'].join('')));
  assert.match(replacement, /Effective head: `R002`/);
  assert.match(replacement, /Effective status: `Active`/);
  assert.match(replacement, /verified inbound `Supersedes` link from R002/i);

  const archive = contractSection(contract, 'Archive transition example');
  const archiveOriginalTitle = 'BMB | CIS-277 | COURSE-FACT | OFFICE-HOURS | R001 | 2026-08-26';
  const archiveTitle = 'BMB | CIS-277 | COURSE-FACT | OFFICE-HOURS | R002 | 2026-08-28';
  const archiveRecordId = 'CIS-277/COURSE-FACT/OFFICE-HOURS';

  assert.ok(archive.includes(['| R001 | `', archiveOriginalTitle, '` | `', archiveRecordId, '` | Course fact | Active | None |'].join('')));
  assert.ok(archive.includes(['| R002 | `', archiveTitle, '` | `', archiveRecordId, '` | Course fact | Archived | `', archiveOriginalTitle, '` |'].join('')));
  assert.match(archive, /Effective head: `R002`/);
  assert.match(archive, /Effective status: `Archived`/);
  assert.match(archive, /verified inbound `Supersedes` link from R002/i);
});
