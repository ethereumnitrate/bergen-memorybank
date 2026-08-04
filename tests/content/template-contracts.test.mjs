import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

const repositoryRoot = fileURLToPath(new URL('../../', import.meta.url));
const repositoryFile = (relativePath) => new URL(`../../${relativePath}`, import.meta.url);

const documentPairs = [
  ['src/templates/faculty-profile.md', 'dist/google-docs/Bergen Memory Bank - Faculty Profile.docx'],
  ['src/templates/course-memory.md', 'dist/google-docs/Bergen Memory Bank - Course Memory.docx'],
  ['src/templates/active-workbench.md', 'dist/google-docs/Bergen Memory Bank - Active Workbench.docx'],
  ['src/templates/decisions-reflections-reusable-practices.md', 'dist/google-docs/Bergen Memory Bank - Decisions Reflections and Reusable Practices.docx'],
];

const knowledgeSourcePaths = documentPairs.map(([source]) => source);
const docxPaths = documentPairs.map(([, output]) => output);

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

const docxAuditScript = String.raw`
import json
from pathlib import Path
import sys
import xml.etree.ElementTree as ET
from zipfile import ZipFile

WORD_URI = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
DC_URI = 'http://purl.org/dc/elements/1.1/'
CORE_URI = 'http://schemas.openxmlformats.org/package/2006/metadata/core-properties'

def w(local_name):
    return '{' + WORD_URI + '}' + local_name

def local_name(name):
    return name.rsplit('}', 1)[-1]

def word_attribute(element, name):
    return element.get(w(name)) if element is not None else None

def style_record(styles_root, style_id):
    style = next(element for element in styles_root.findall(w('style')) if word_attribute(element, 'styleId') == style_id)
    paragraph_properties = style.find(w('pPr'))
    run_properties = style.find(w('rPr'))
    spacing = paragraph_properties.find(w('spacing')) if paragraph_properties is not None else None
    fonts = run_properties.find(w('rFonts')) if run_properties is not None else None
    size = run_properties.find(w('sz')) if run_properties is not None else None
    color = run_properties.find(w('color')) if run_properties is not None else None
    bold = run_properties.find(w('b')) if run_properties is not None else None
    return {
        'font': word_attribute(fonts, 'ascii'),
        'size': word_attribute(size, 'val'),
        'color': word_attribute(color, 'val'),
        'bold': word_attribute(bold, 'val'),
        'before': word_attribute(spacing, 'before'),
        'after': word_attribute(spacing, 'after'),
        'line': word_attribute(spacing, 'line'),
        'lineRule': word_attribute(spacing, 'lineRule'),
    }

repository_root = Path(sys.argv[1])
results = {}
for relative_path in sys.argv[2:]:
    file_path = repository_root / relative_path
    with ZipFile(file_path) as archive:
        names = archive.namelist()
        residues = []
        for member_name in names:
            if not member_name.endswith(('.xml', '.rels')):
                continue
            root = ET.fromstring(archive.read(member_name))
            for element in root.iter():
                if element.tag.startswith('{' + WORD_URI + '}') and local_name(element.tag).startswith('rsid'):
                    residues.append(member_name + ':element:' + local_name(element.tag))
                for attribute_name in element.attrib:
                    if attribute_name.startswith('{' + WORD_URI + '}') and local_name(attribute_name).startswith('rsid'):
                        residues.append(member_name + ':attribute:' + local_name(attribute_name))

        document_root = ET.fromstring(archive.read('word/document.xml'))
        body = document_root.find(w('body'))
        paragraphs = []
        for paragraph in body.findall(w('p')):
            paragraphs.append(''.join((node.text or '') for node in paragraph.iter(w('t'))))

        title = body.find(w('p'))
        title_properties = title.find(w('pPr'))
        title_spacing = title_properties.find(w('spacing'))
        title_style = title_properties.find(w('pStyle'))
        title_run_properties = title.find(w('r')).find(w('rPr'))
        title_fonts = title_run_properties.find(w('rFonts'))
        title_size = title_run_properties.find(w('sz'))
        title_color = title_run_properties.find(w('color'))
        title_bold = title_run_properties.find(w('b'))

        section = body.find(w('sectPr'))
        page_size = section.find(w('pgSz'))
        margins = section.find(w('pgMar'))
        styles_root = ET.fromstring(archive.read('word/styles.xml'))
        numbering_root = ET.fromstring(archive.read('word/numbering.xml'))
        core_root = ET.fromstring(archive.read('docProps/core.xml'))
        creator = core_root.find('{' + DC_URI + '}creator')
        modified_by = core_root.find('{' + CORE_URI + '}lastModifiedBy')

        results[relative_path] = {
            'paragraphs': paragraphs,
            'rsidResidues': residues,
            'geometry': {
                'width': word_attribute(page_size, 'w'),
                'height': word_attribute(page_size, 'h'),
                'top': word_attribute(margins, 'top'),
                'right': word_attribute(margins, 'right'),
                'bottom': word_attribute(margins, 'bottom'),
                'left': word_attribute(margins, 'left'),
                'header': word_attribute(margins, 'header'),
                'footer': word_attribute(margins, 'footer'),
            },
            'styles': {
                'Normal': style_record(styles_root, 'Normal'),
                'Heading1': style_record(styles_root, 'Heading1'),
                'Heading2': style_record(styles_root, 'Heading2'),
                'Heading3': style_record(styles_root, 'Heading3'),
            },
            'title': {
                'style': word_attribute(title_style, 'val') or 'Normal',
                'font': word_attribute(title_fonts, 'ascii'),
                'size': word_attribute(title_size, 'val'),
                'color': word_attribute(title_color, 'val'),
                'bold': word_attribute(title_bold, 'val'),
                'before': word_attribute(title_spacing, 'before'),
                'after': word_attribute(title_spacing, 'after'),
                'line': word_attribute(title_spacing, 'line'),
                'hasBorder': title_properties.find(w('pBdr')) is not None,
                'hasUnderline': title_run_properties.find(w('u')) is not None,
            },
            'numbering': {
                'formats': [word_attribute(element, 'val') for element in numbering_root.iter(w('numFmt'))],
                'indents': [[word_attribute(element, 'left'), word_attribute(element, 'hanging')] for element in numbering_root.iter(w('ind'))],
            },
            'tableCount': len(list(body.iter(w('tbl')))),
            'customProperties': 'docProps/custom.xml' in names,
            'creator': creator.text if creator is not None and creator.text else '',
            'lastModifiedBy': modified_by.text if modified_by is not None and modified_by.text else '',
        }

print(json.dumps(results))
`;

let docxAudit;

async function readText(relativePath) {
  try {
    return await readFile(repositoryFile(relativePath), 'utf8');
  } catch (error) {
    assert.fail(`Expected Phase 3 artifact ${relativePath} to exist: ${error.message}`);
  }
}

async function pathExists(relativePath) {
  try {
    await access(repositoryFile(relativePath));
    return true;
  } catch {
    return false;
  }
}

function markdownParagraphs(markdown) {
  return markdown.split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line
      .replace(/^#{1,4}\s+/, '')
      .replace(/^[-*]\s+/, '')
      .replace(/^\d+\.\s+/, '')
      .replace(/\*\*([^*]+):\*\*/g, '$1:')
      .replaceAll('`', ''));
}

function getDocxAudit() {
  if (docxAudit) {
    return docxAudit;
  }
  const bundledPython = process.env.CODEX_BUNDLED_PYTHON
    ?? path.join(os.homedir(), '.cache', 'codex-runtimes', 'codex-primary-runtime', 'dependencies', 'python', 'python.exe');
  const result = spawnSync(bundledPython, ['-c', docxAuditScript, repositoryRoot, ...docxPaths], {
    cwd: repositoryRoot,
    encoding: 'utf8',
    windowsHide: true,
  });
  assert.equal(result.status, 0, `Bundled Python DOCX audit failed: ${result.stderr || result.stdout}`);
  docxAudit = JSON.parse(result.stdout);
  return docxAudit;
}

function docxText(audit, relativePath) {
  return audit[relativePath].paragraphs.join('\n');
}

test('the release contains four faculty knowledge documents with the approved ownership and Google Docs OOXML contract', async () => {
  const sources = await Promise.all(knowledgeSourcePaths.map(readText));
  const builder = await readText('scripts/build-google-docs.mjs');
  const audit = getDocxAudit();

  assert.match(sources[0], /one shared Faculty Profile/i);
  assert.match(sources[0], /stable faculty preferences/i);
  assert.match(sources[1], /one Course Memory for each course/i);
  assert.match(sources[1], /course-specific durable/i);
  assert.match(sources[2], /one Active Workbench for each course/i);
  assert.match(sources[2], /course-specific active work/i);
  assert.match(sources[3], /one shared Decisions, Reflections, and Reusable Practices/i);
  assert.match(sources[3], /durable decisions, reflections, and reusable practices/i);
  await Promise.all(docxPaths.map(async (relativePath) => assert.equal(await pathExists(relativePath), true)));
  assert.equal(await pathExists('dist/google-docs/Bergen Memory Bank - Class Learning Snapshot.docx'), false);
  assert.doesNotMatch(builder, /C:\\Users\\/i, 'builder must not hard-code a user profile');
  assert.doesNotMatch(builder, /documents\\\d+\.\d+\.\d+/i, 'builder must not hard-code a documents package version');
  assert.match(builder, /CODEX_BUNDLED_PYTHON/);
  assert.match(builder, /CODEX_DOCUMENTS_PACKAGE/);

  const expectedGeometry = {
    width: '12240', height: '15840', top: '1440', right: '1440', bottom: '1440', left: '1440', header: '708', footer: '708',
  };
  const expectedStyles = {
    Normal: { font: 'Arial', size: '22', color: '000000', bold: '0', before: '0', after: '160', line: '276', lineRule: 'auto' },
    Heading1: { font: 'Arial', size: '40', color: '000000', bold: '0', before: '400', after: '120', line: '276', lineRule: 'auto' },
    Heading2: { font: 'Arial', size: '32', color: '000000', bold: '0', before: '360', after: '120', line: '276', lineRule: 'auto' },
    Heading3: { font: 'Arial', size: '28', color: '434343', bold: '0', before: '320', after: '80', line: '276', lineRule: 'auto' },
  };

  for (const relativePath of docxPaths) {
    const documentAudit = audit[relativePath];
    assert.deepEqual(documentAudit.rsidResidues, [], `${relativePath} must contain no rsid elements or attributes in any XML member`);
    assert.deepEqual(documentAudit.geometry, expectedGeometry);
    assert.deepEqual(documentAudit.styles, expectedStyles);
    assert.deepEqual(documentAudit.title, {
      style: 'Normal', font: 'Arial', size: '52', color: '000000', bold: '0', before: '0', after: '60', line: '240', hasBorder: false, hasUnderline: false,
    });
    assert.ok(documentAudit.numbering.formats.includes('bullet'));
    assert.ok(documentAudit.numbering.formats.includes('decimal'));
    assert.ok(documentAudit.numbering.indents.some(([left, hanging]) => left === '720' && hanging === '360'));
    assert.equal(documentAudit.tableCount, 0);
    assert.equal(documentAudit.customProperties, false);
    assert.equal(documentAudit.creator, '');
    assert.equal(documentAudit.lastModifiedBy, '');
  }
});

test('each knowledge document declares one distinct primary home and matches its generated DOCX content', async () => {
  const sources = await Promise.all(knowledgeSourcePaths.map(readText));
  const primaryHomes = sources.map((source) => [...source.matchAll(/^\*\*Primary home:\*\*\s+(.+)$/gm)]);
  const audit = getDocxAudit();

  assert.deepEqual(primaryHomes.map((matches) => matches.length), [1, 1, 1, 1]);
  assert.equal(new Set(primaryHomes.map(([match]) => match[1])).size, 4);
  for (const [index, source] of sources.entries()) {
    assert.match(source, /Each fact has one primary home/i);
    assert.deepEqual(audit[docxPaths[index]].paragraphs, markdownParagraphs(source), `${docxPaths[index]} must exactly represent its Markdown source`);
  }
});

test('the Class Learning Snapshot source partial is embedded exactly once in Active Workbench and its DOCX', async () => {
  const snapshot = (await readText('src/templates/class-learning-snapshot.md')).trim();
  const workbench = await readText('src/templates/active-workbench.md');
  const firstOccurrence = workbench.indexOf(snapshot);
  const workbenchDocxText = docxText(getDocxAudit(), docxPaths[2]);

  assert.notEqual(firstOccurrence, -1, 'Active Workbench must contain the exact snapshot source partial');
  assert.equal(workbench.indexOf(snapshot, firstOccurrence + snapshot.length), -1, 'snapshot partial must appear exactly once');
  assert.match(snapshot, /temporary, replaceable section/i);
  assert.match(snapshot, /not a fifth faculty knowledge document/i);
  assert.equal(workbenchDocxText.split(markdownParagraphs(snapshot).join('\n')).length - 1, 1);
});

test('the snapshot exposes the exact required fields in the required order with no extras in source and DOCX', async () => {
  const snapshot = await readText('src/templates/class-learning-snapshot.md');
  const actualFields = [...snapshot.matchAll(/^\*\*([^*]+):\*\*/gm)].map(([, field]) => field);
  const docxFields = getDocxAudit()[docxPaths[2]].paragraphs
    .map((paragraph) => paragraph.match(/^([^:]+):\s*\[/)?.[1])
    .filter((field) => snapshotFields.includes(field));

  assert.deepEqual(actualFields, snapshotFields);
  assert.deepEqual(docxFields, snapshotFields);
  for (const field of snapshotFields) {
    assert.equal(snapshot.split(`**${field}:**`).length - 1, 1, `${field} must appear exactly once`);
  }
});

test('the snapshot prominently limits source and DOCX entries to de-identified class-level observations and Canvas', async () => {
  const snapshot = await readText('src/templates/class-learning-snapshot.md');
  const workbenchDocxText = docxText(getDocxAudit(), docxPaths[2]);

  for (const content of [snapshot, workbenchDocxText]) {
    assert.match(content, /de-identified class-level observations only/i);
    assert.match(content, /keep protected data in Canvas/i);
    for (const prohibited of [
      'raw submissions', 'names', 'emails', 'IDs', 'identifying filenames', 'individual grades', 'student-specific feedback',
      'accommodation', 'disability', 'health', 'advising', 'disciplinary information', 'identifiable quotations', 'identifying combinations',
    ]) {
      assert.match(content, new RegExp(prohibited, 'i'));
    }
  }
});

test('course-specific source templates and DOCX files require explicit selection without cross-chat persistence', async () => {
  const courseMemory = await readText('src/templates/course-memory.md');
  const workbench = await readText('src/templates/active-workbench.md');
  const audit = getDocxAudit();

  for (const source of [courseMemory, workbench, docxText(audit, docxPaths[1]), docxText(audit, docxPaths[2])]) {
    assert.match(source, /select the course explicitly/i);
    assert.match(source, /echo the selected course before using/i);
    assert.match(source, /does not persist into a new Gemini chat/i);
  }
});

test('the snapshot source and DOCX treat future concepts and knowledge not to assume as hard constraints', async () => {
  const snapshot = await readText('src/templates/class-learning-snapshot.md');
  const workbenchDocxText = docxText(getDocxAudit(), docxPaths[2]);

  for (const content of [snapshot, workbenchDocxText]) {
    assert.match(content, /hard constraints/i);
    assert.match(content, /only outcomes and concepts already introduced/i);
    assert.match(content, /must not assume/i);
    assert.match(content, /ask for clarification/i);
    assert.match(content, /uncertain concept/i);
  }
});

test('bergen:record remains faculty-approved copy-ready text and manual paste only in source and DOCX', async () => {
  const sources = await Promise.all(knowledgeSourcePaths.map(readText));
  const audit = getDocxAudit();

  for (const [index, source] of sources.entries()) {
    for (const content of [source, docxText(audit, docxPaths[index])]) {
      assert.match(content, /bergen:record/i);
      assert.match(content, /proposal only/i);
      assert.match(content, /faculty approval/i);
      assert.match(content, /exactly one primary target document/i);
      assert.match(content, /copy-ready text/i);
      assert.match(content, /paste .* manually/i);
      assert.match(content, /does not (?:save|claim to save), synchronize, modify, or retain/i);
    }
  }
});
