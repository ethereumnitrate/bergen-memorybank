import { access, mkdtemp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import os from 'node:os';
import path from 'node:path';

const repositoryRoot = fileURLToPath(new URL('../', import.meta.url));

const documents = [
  {
    source: 'src/templates/faculty-profile.md',
    output: 'dist/google-docs/Bergen Memory Bank - Faculty Profile.docx',
  },
  {
    source: 'src/templates/course-memory.md',
    output: 'dist/google-docs/Bergen Memory Bank - Course Memory.docx',
  },
  {
    source: 'src/templates/active-workbench.md',
    output: 'dist/google-docs/Bergen Memory Bank - Active Workbench.docx',
  },
  {
    source: 'src/templates/decisions-reflections-reusable-practices.md',
    output: 'dist/google-docs/Bergen Memory Bank - Decisions Reflections and Reusable Practices.docx',
  },
];

const pythonBuilder = String.raw`
from datetime import datetime, timezone
import io
from pathlib import Path
import re
import sys
import zipfile
import xml.etree.ElementTree as ET

from docx import Document
from docx.enum.section import WD_ORIENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor

BLACK = RGBColor(0, 0, 0)
HEADING_3_GRAY = RGBColor(67, 67, 67)
FIXED_TIME = (1980, 1, 1, 0, 0, 0)
WORD_NAMESPACE = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'


def set_run_font(run, size, bold=False):
    run.font.name = 'Arial'
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.color.rgb = BLACK
    r_pr = run._element.get_or_add_rPr()
    r_fonts = r_pr.get_or_add_rFonts()
    r_fonts.set(qn('w:ascii'), 'Arial')
    r_fonts.set(qn('w:hAnsi'), 'Arial')
    r_fonts.set(qn('w:eastAsia'), 'Arial')
    r_fonts.set(qn('w:cs'), 'Arial')


def set_style(style, size, before, after, line_spacing=1.15, bold=False, color=BLACK):
    style.font.name = 'Arial'
    style.font.size = Pt(size)
    style.font.bold = bold
    style.font.color.rgb = color
    r_pr = style._element.get_or_add_rPr()
    r_fonts = r_pr.get_or_add_rFonts()
    r_fonts.set(qn('w:ascii'), 'Arial')
    r_fonts.set(qn('w:hAnsi'), 'Arial')
    r_fonts.set(qn('w:eastAsia'), 'Arial')
    r_fonts.set(qn('w:cs'), 'Arial')
    paragraph = style.paragraph_format
    paragraph.space_before = Pt(before)
    paragraph.space_after = Pt(after)
    paragraph.line_spacing = line_spacing


def next_numbering_ids(numbering):
    abstract_ids = [
        int(element.get(qn('w:abstractNumId')))
        for element in numbering.findall(qn('w:abstractNum'))
    ]
    number_ids = [
        int(element.get(qn('w:numId')))
        for element in numbering.findall(qn('w:num'))
    ]
    return max(abstract_ids, default=-1) + 1, max(number_ids, default=0) + 1


def add_numbering_definition(document, number_format, level_text):
    numbering = document.part.numbering_part.element
    abstract_id, number_id = next_numbering_ids(numbering)

    abstract = OxmlElement('w:abstractNum')
    abstract.set(qn('w:abstractNumId'), str(abstract_id))
    multi_level = OxmlElement('w:multiLevelType')
    multi_level.set(qn('w:val'), 'singleLevel')
    abstract.append(multi_level)

    level = OxmlElement('w:lvl')
    level.set(qn('w:ilvl'), '0')
    start = OxmlElement('w:start')
    start.set(qn('w:val'), '1')
    level.append(start)
    num_format = OxmlElement('w:numFmt')
    num_format.set(qn('w:val'), number_format)
    level.append(num_format)
    text = OxmlElement('w:lvlText')
    text.set(qn('w:val'), level_text)
    level.append(text)
    justification = OxmlElement('w:lvlJc')
    justification.set(qn('w:val'), 'left')
    level.append(justification)

    paragraph_properties = OxmlElement('w:pPr')
    tabs = OxmlElement('w:tabs')
    tab = OxmlElement('w:tab')
    tab.set(qn('w:val'), 'num')
    tab.set(qn('w:pos'), '720')
    tabs.append(tab)
    paragraph_properties.append(tabs)
    indent = OxmlElement('w:ind')
    indent.set(qn('w:left'), '720')
    indent.set(qn('w:hanging'), '360')
    paragraph_properties.append(indent)
    level.append(paragraph_properties)

    run_properties = OxmlElement('w:rPr')
    fonts = OxmlElement('w:rFonts')
    fonts.set(qn('w:ascii'), 'Arial')
    fonts.set(qn('w:hAnsi'), 'Arial')
    run_properties.append(fonts)
    color = OxmlElement('w:color')
    color.set(qn('w:val'), '000000')
    run_properties.append(color)
    level.append(run_properties)
    abstract.append(level)
    numbering.append(abstract)

    number = OxmlElement('w:num')
    number.set(qn('w:numId'), str(number_id))
    abstract_reference = OxmlElement('w:abstractNumId')
    abstract_reference.set(qn('w:val'), str(abstract_id))
    number.append(abstract_reference)
    numbering.append(number)
    return number_id


def apply_numbering(paragraph, number_id):
    p_pr = paragraph._p.get_or_add_pPr()
    num_pr = OxmlElement('w:numPr')
    level = OxmlElement('w:ilvl')
    level.set(qn('w:val'), '0')
    num_pr.append(level)
    number = OxmlElement('w:numId')
    number.set(qn('w:val'), str(number_id))
    num_pr.append(number)
    p_pr.insert(0, num_pr)
    paragraph.paragraph_format.left_indent = Inches(0.5)
    paragraph.paragraph_format.first_line_indent = Inches(-0.25)
    paragraph.paragraph_format.space_after = Pt(4)
    paragraph.paragraph_format.line_spacing = 1.15


def add_plain_paragraph(document, text):
    paragraph = document.add_paragraph()
    label = re.match(r'^\*\*([^*]+):\*\*\s*(.*)$', text)
    if label:
        label_run = paragraph.add_run(label.group(1) + ':')
        set_run_font(label_run, 11, bold=True)
        if label.group(2):
            body_run = paragraph.add_run(' ' + label.group(2).replace(chr(96), ''))
            set_run_font(body_run, 11)
    else:
        run = paragraph.add_run(text.replace(chr(96), ''))
        set_run_font(run, 11)
    return paragraph


def configure_document(document):
    section = document.sections[0]
    section.orientation = WD_ORIENT.PORTRAIT
    section.page_width = Inches(8.5)
    section.page_height = Inches(11)
    section.top_margin = Inches(1)
    section.right_margin = Inches(1)
    section.bottom_margin = Inches(1)
    section.left_margin = Inches(1)
    section.header_distance = Inches(0.492)
    section.footer_distance = Inches(0.492)

    set_style(document.styles['Normal'], 11, 0, 8, line_spacing=1.15)
    set_style(document.styles['Heading 1'], 20, 20, 6, line_spacing=1.15)
    set_style(document.styles['Heading 2'], 16, 18, 6, line_spacing=1.15)
    set_style(document.styles['Heading 3'], 14, 16, 4, line_spacing=1.15, color=HEADING_3_GRAY)
    for style_name in ('Heading 1', 'Heading 2', 'Heading 3'):
        document.styles[style_name].paragraph_format.keep_with_next = True
        document.styles[style_name].paragraph_format.keep_together = True

    properties = document.core_properties
    properties.author = ''
    properties.last_modified_by = ''
    properties.created = datetime(2026, 8, 4, 0, 0, 0, tzinfo=timezone.utc)
    properties.modified = datetime(2026, 8, 4, 0, 0, 0, tzinfo=timezone.utc)
    properties.keywords = ''
    properties.comments = ''


def build_document(source_path, output_path):
    markdown = source_path.read_text(encoding='utf-8')
    lines = markdown.splitlines()
    title_index = next((index for index, line in enumerate(lines) if line.startswith('# ')), None)
    if title_index is None:
        raise ValueError(f'{source_path} must begin with a level-one title')

    document = Document()
    configure_document(document)
    bullet_numbering = add_numbering_definition(document, 'bullet', '●')
    decimal_numbering = add_numbering_definition(document, 'decimal', '%1.')

    title = document.add_paragraph()
    title.style = document.styles['Normal']
    title.paragraph_format.space_before = Pt(0)
    title.paragraph_format.space_after = Pt(3)
    title.paragraph_format.line_spacing = 1.0
    title.paragraph_format.keep_with_next = True
    title_run = title.add_run(lines[title_index][2:].strip())
    set_run_font(title_run, 26, bold=False)

    for line in lines[title_index + 1:]:
        stripped = line.strip()
        if not stripped:
            continue
        if stripped.startswith('#### '):
            document.add_paragraph(stripped[5:], style='Heading 3')
        elif stripped.startswith('### '):
            document.add_paragraph(stripped[4:], style='Heading 2')
        elif stripped.startswith('## '):
            document.add_paragraph(stripped[3:], style='Heading 1')
        elif stripped.startswith('- '):
            paragraph = add_plain_paragraph(document, stripped[2:])
            apply_numbering(paragraph, bullet_numbering)
        elif re.match(r'^\d+\.\s+', stripped):
            paragraph = add_plain_paragraph(document, re.sub(r'^\d+\.\s+', '', stripped))
            apply_numbering(paragraph, decimal_numbering)
        else:
            add_plain_paragraph(document, stripped)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    document.save(output_path)


def is_rsid_name(name):
    return name.startswith('{' + WORD_NAMESPACE + '}') and name.rsplit('}', 1)[-1].startswith('rsid')


def strip_rsid_markup(content):
    namespace_declarations = list(ET.iterparse(io.BytesIO(content), events=('start-ns',)))
    for _, (prefix, namespace) in namespace_declarations:
        try:
            ET.register_namespace(prefix, namespace)
        except ValueError:
            pass

    root = ET.fromstring(content)
    changed = False
    for parent in root.iter():
        for child in list(parent):
            if is_rsid_name(child.tag):
                parent.remove(child)
                changed = True
        for attribute_name in list(parent.attrib):
            if is_rsid_name(attribute_name):
                del parent.attrib[attribute_name]
                changed = True

    if not changed:
        return content
    return ET.tostring(root, encoding='utf-8', xml_declaration=True)


def normalize_docx(docx_path):
    temporary_path = docx_path.with_suffix('.normalized.docx')
    with zipfile.ZipFile(docx_path, 'r') as source_zip:
        entries = []
        for name in sorted(source_zip.namelist()):
            content = source_zip.read(name)
            if name.endswith(('.xml', '.rels')):
                content = strip_rsid_markup(content)
            entries.append((name, content))
    with zipfile.ZipFile(temporary_path, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as output_zip:
        for name, content in entries:
            info = zipfile.ZipInfo(name, date_time=FIXED_TIME)
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o600 << 16
            output_zip.writestr(info, content)
    temporary_path.replace(docx_path)


if sys.argv[1] == '--normalize':
    normalize_docx(Path(sys.argv[2]))
else:
    repository_root = Path(sys.argv[1])
    raw_output_root = Path(sys.argv[2])
    source_output_pairs = [
        ('src/templates/faculty-profile.md', 'faculty-profile.docx'),
        ('src/templates/course-memory.md', 'course-memory.docx'),
        ('src/templates/active-workbench.md', 'active-workbench.docx'),
        ('src/templates/decisions-reflections-reusable-practices.md', 'decisions-reflections-reusable-practices.docx'),
    ]
    for source_name, output_name in source_output_pairs:
        build_document(repository_root / source_name, raw_output_root / output_name)
`;

async function pathExists(candidate) {
  try {
    await access(candidate);
    return true;
  } catch {
    return false;
  }
}

async function resolveBundledPython() {
  const configured = process.env.CODEX_BUNDLED_PYTHON;
  const discovered = path.join(
    os.homedir(),
    '.cache',
    'codex-runtimes',
    'codex-primary-runtime',
    'dependencies',
    'python',
    process.platform === 'win32' ? 'python.exe' : 'bin/python',
  );
  const candidate = configured || discovered;
  if (await pathExists(candidate)) {
    return candidate;
  }
  throw new Error(`Bundled Python was not found at ${candidate}. Set CODEX_BUNDLED_PYTHON to the bundled Python executable.`);
}

async function resolveDocumentsPackage() {
  const configured = process.env.CODEX_DOCUMENTS_PACKAGE;
  if (configured) {
    const requiredHelper = path.join(configured, 'scripts', 'google_docs_title_sanitize.py');
    if (await pathExists(requiredHelper)) {
      return configured;
    }
    throw new Error(`CODEX_DOCUMENTS_PACKAGE does not contain scripts/google_docs_title_sanitize.py: ${configured}`);
  }

  const documentsCache = path.join(os.homedir(), '.codex', 'plugins', 'cache', 'openai-primary-runtime', 'documents');
  let entries;
  try {
    entries = await readdir(documentsCache, { withFileTypes: true });
  } catch (error) {
    throw new Error(`Documents package cache was not found at ${documentsCache}. Set CODEX_DOCUMENTS_PACKAGE to the bundled documents skill package. ${error.message}`);
  }

  const versions = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((left, right) => right.localeCompare(left, undefined, { numeric: true, sensitivity: 'base' }));
  for (const version of versions) {
    const candidate = path.join(documentsCache, version, 'skills', 'documents');
    const requiredHelpers = [
      path.join(candidate, 'scripts', 'google_docs_title_sanitize.py'),
      path.join(candidate, 'scripts', 'privacy_scrub.py'),
    ];
    if ((await Promise.all(requiredHelpers.map(pathExists))).every(Boolean)) {
      return candidate;
    }
  }

  throw new Error(`No usable bundled documents package was found under ${documentsCache}. Set CODEX_DOCUMENTS_PACKAGE explicitly.`);
}

function runBundledPython(bundledPython, argumentsList) {
  const result = spawnSync(bundledPython, argumentsList, {
    cwd: repositoryRoot,
    encoding: 'utf8',
    windowsHide: true,
  });
  if (result.stdout) {
    process.stdout.write(result.stdout);
  }
  if (result.stderr) {
    process.stderr.write(result.stderr);
  }
  if (result.status !== 0) {
    throw new Error(`Bundled document command failed with exit code ${result.status ?? 'unknown'}`);
  }
}

async function main() {
  for (const { source } of documents) {
    await readFile(path.join(repositoryRoot, source), 'utf8');
  }

  const bundledPython = await resolveBundledPython();
  const documentsPackage = await resolveDocumentsPackage();
  const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), 'bergen-google-docs-'));
  const helperPath = path.join(temporaryRoot, 'build_google_docs.py');
  const rawDirectory = path.join(temporaryRoot, 'raw');
  const sanitizedDirectory = path.join(temporaryRoot, 'sanitized');
  const outputDirectory = path.join(repositoryRoot, 'dist', 'google-docs');
  const titleSanitizer = path.join(documentsPackage, 'scripts', 'google_docs_title_sanitize.py');
  const privacyScrubber = path.join(documentsPackage, 'scripts', 'privacy_scrub.py');

  await mkdir(rawDirectory, { recursive: true });
  await mkdir(sanitizedDirectory, { recursive: true });
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(helperPath, pythonBuilder, 'utf8');

  try {
    runBundledPython(bundledPython, [helperPath, repositoryRoot, rawDirectory]);

    for (const [index, document] of documents.entries()) {
      const rawPath = path.join(rawDirectory, `${path.basename(document.source, '.md')}.docx`);
      const sanitizedPath = path.join(sanitizedDirectory, `${index}.docx`);
      const finalPath = path.join(repositoryRoot, document.output);

      runBundledPython(bundledPython, [titleSanitizer, rawPath, '--out', sanitizedPath]);
      runBundledPython(bundledPython, [titleSanitizer, sanitizedPath, '--check']);
      runBundledPython(bundledPython, [privacyScrubber, sanitizedPath, '--out', finalPath]);
      runBundledPython(bundledPython, [titleSanitizer, finalPath, '--check']);
      runBundledPython(bundledPython, [helperPath, '--normalize', finalPath]);
      runBundledPython(bundledPython, [titleSanitizer, finalPath, '--check']);
    }
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }

  process.stdout.write(`Built ${documents.length} Google Docs-ready DOCX files.\n`);
}

main().catch((error) => {
  process.stderr.write(`Google Docs build failed: ${error.message}\n`);
  process.exitCode = 1;
});
