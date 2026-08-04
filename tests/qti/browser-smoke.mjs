import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

class FakeElement {
  constructor(tagName = 'div') {
    this.tagName = tagName.toUpperCase();
    this.value = '';
    this.checked = false;
    this.disabled = false;
    this.hidden = false;
    this.textContent = '';
    this.dataset = {};
    this.children = [];
    this.listeners = new Map();
  }
  addEventListener(type, callback) { this.listeners.set(type, callback); }
  dispatch(type) { this.listeners.get(type)?.({ target: this }); }
  append(...children) { this.children.push(...children); }
  replaceChildren(...children) { this.children = [...children]; }
  focus() {}
  click() { this.dispatch('click'); }
  remove() {}
}

function makeDocument() {
  const identifiers = [
    'transfer-block', 'load-sample', 'check-quiz', 'download-qti', 'privacy-confirmation',
    'results', 'quiz-summary', 'validation-messages', 'status',
  ];
  const elements = new Map(identifiers.map((identifier) => [`#${identifier}`, new FakeElement()]));
  const anchors = [];
  return {
    elements,
    anchors,
    body: new FakeElement('body'),
    querySelector(selector) { return selector === '[data-bergen-qti-app]' ? this.body : elements.get(selector); },
    createElement(tagName) {
      const element = new FakeElement(tagName);
      if (tagName === 'a') anchors.push(element);
      return element;
    },
  };
}

async function launch(width) {
  const html = await readFile(new URL('../../demo/Bergen-QTI-Packager-Demo.html', import.meta.url), 'utf8');
  assert.doesNotMatch(html, /<script[^>]+src=|<link[^>]+stylesheet/i, 'demo must be self-contained');
  const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].at(-1)?.[1];
  assert.ok(script, 'demo must contain its browser application script');
  const document = makeDocument();
  let objectUrlCount = 0;
  const context = {
    document,
    innerWidth: width,
    TextEncoder,
    Uint8Array,
    DataView,
    ArrayBuffer,
    Blob,
    structuredClone,
    URL: {
      createObjectURL() { objectUrlCount += 1; return 'blob:local-qti'; },
      revokeObjectURL() {},
    },
    setTimeout(callback) { callback(); },
  };
  context.globalThis = context;
  vm.runInNewContext(script, context);
  return { document, objectUrlCount: () => objectUrlCount };
}

async function runHappyPath(width) {
  const session = await launch(width);
  const { elements, anchors } = session.document;
  elements.get('#load-sample').dispatch('click');
  assert.match(elements.get('#transfer-block').value, /bergen-qti-transfer/);
  elements.get('#check-quiz').dispatch('click');
  assert.equal(elements.get('#download-qti').disabled, true, 'privacy confirmation must gate download');
  elements.get('#privacy-confirmation').checked = true;
  elements.get('#privacy-confirmation').dispatch('change');
  assert.equal(elements.get('#download-qti').disabled, false);
  elements.get('#download-qti').dispatch('click');
  assert.equal(session.objectUrlCount(), 1);
  assert.equal(anchors.at(-1).download, 'bergen-qti-compatibility-check-qti.zip');
  assert.equal(elements.get('#status').textContent,
    'QTI package ready. Download your ZIP and import it into an unpublished Canvas test course.');
}

test('desktop self-contained demo completes the privacy-gated local download journey', async () => {
  await runHappyPath(1280);
});

test('mobile self-contained demo completes the same privacy-gated local download journey', async () => {
  await runHappyPath(390);
});

test('invalid or unsupported content cannot create a ZIP and shows the manual-entry fallback', async () => {
  const session = await launch(1280);
  const { elements, anchors } = session.document;
  const invalid = JSON.parse(elements.get('#transfer-block').value || '{}');
  invalid.format = 'bergen-qti-transfer';
  invalid.version = '0.1';
  invalid.quiz = {
    title: 'Synthetic unsupported check',
    settings: { shuffleAnswers: false, timeLimitMinutes: null, allowedAttempts: 1, pointsPossible: 1 },
    questions: [{ id: 'q1', type: 'matching', prompt: 'Synthetic prompt', points: 1 }],
  };
  elements.get('#transfer-block').value = JSON.stringify(invalid);
  elements.get('#transfer-block').dispatch('input');
  elements.get('#check-quiz').dispatch('click');
  assert.equal(elements.get('#download-qti').disabled, true);
  assert.equal(anchors.length, 0);
  assert.match(elements.get('#status').textContent, /manual entry/i);
});

test('malformed protected input is sanitized and cleared before JSON parsing or ZIP creation', async () => {
  const session = await launch(1280);
  const { elements, anchors } = session.document;
  const rejectedText = '{"quiz":{"instructions":"The student has diabetes."';
  elements.get('#transfer-block').value = rejectedText;
  elements.get('#transfer-block').dispatch('input');
  elements.get('#privacy-confirmation').checked = true;

  elements.get('#check-quiz').dispatch('click');

  assert.equal(elements.get('#transfer-block').value, '');
  assert.equal(elements.get('#privacy-confirmation').checked, false);
  assert.equal(elements.get('#download-qti').disabled, true);
  assert.equal(session.objectUrlCount(), 0);
  assert.equal(anchors.length, 0);
  assert.match(elements.get('#status').textContent, /possible health information/i);
  assert.match(elements.get('#status').textContent, /Canvas is the student-record system/i);
  assert.doesNotMatch(elements.get('#status').textContent, /diabetes/i);
});
