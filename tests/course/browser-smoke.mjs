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
    this.removed = false;
    this.throwOnClick = false;
  }
  addEventListener(type, callback) { this.listeners.set(type, callback); }
  dispatch(type) { this.listeners.get(type)?.({ target: this }); }
  append(...children) { this.children.push(...children); }
  replaceChildren(...children) { this.children = [...children]; }
  focus() {}
  click() {
    if (this.throwOnClick) throw new Error('Synthetic anchor click failure');
    this.dispatch('click');
  }
  remove() { this.removed = true; }
}

function makeDocument({ anchorClickThrows = false } = {}) {
  const identifiers = [
    'transfer-block', 'check-course', 'download-imscc', 'privacy-confirmation',
    'results', 'course-summary', 'validation-messages', 'status',
  ];
  const elements = new Map(identifiers.map((identifier) => [`#${identifier}`, new FakeElement()]));
  const anchors = [];
  return {
    elements,
    anchors,
    body: new FakeElement('body'),
    querySelector(selector) {
      return selector === '[data-bergen-course-app]' ? this.body : elements.get(selector);
    },
    createElement(tagName) {
      const element = new FakeElement(tagName);
      if (tagName === 'a') {
        element.throwOnClick = anchorClickThrows;
        anchors.push(element);
      }
      return element;
    },
  };
}

async function launch(width, options = {}) {
  const [html, fixtureSource, alternateFixtureSource] = await Promise.all([
    readFile(new URL('../../demo/Bergen-Course-Packager-Demo.html', import.meta.url), 'utf8'),
    readFile(new URL('../fixtures/sample-course-transfer.json', import.meta.url), 'utf8'),
    readFile(new URL('../fixtures/sample-course-transfer-eng-102.json', import.meta.url), 'utf8'),
  ]);
  assert.doesNotMatch(html, /<script[^>]+src=|<link[^>]+stylesheet/i, 'demo must be self-contained');
  assert.doesNotMatch(html, /bergen-course-transfer[\s\S]+CIS-277/i, 'demo must not hard-code a course fixture');
  const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].at(-1)?.[1];
  assert.ok(script, 'demo must contain its browser application script');
  const document = makeDocument(options);
  let objectUrlCount = 0;
  let revokedObjectUrlCount = 0;
  const encoding = { calls: 0, fail: false };
  class ObservedTextEncoder {
    encode(value) {
      encoding.calls += 1;
      if (encoding.fail) throw new Error('Synthetic local package generation failure');
      return new TextEncoder().encode(value);
    }
  }
  const context = {
    document,
    innerWidth: width,
    TextEncoder: ObservedTextEncoder,
    Uint8Array,
    DataView,
    ArrayBuffer,
    Blob,
    structuredClone,
    URL: {
      createObjectURL() { objectUrlCount += 1; return 'blob:local-course'; },
      revokeObjectURL() { revokedObjectUrlCount += 1; },
    },
    setTimeout(callback) { callback(); },
  };
  context.globalThis = context;
  vm.runInNewContext(script, context);
  return {
    alternateFixtureSource,
    document,
    encoding,
    fixtureSource,
    objectUrlCount: () => objectUrlCount,
    revokedObjectUrlCount: () => revokedObjectUrlCount,
  };
}

async function runHappyPath(width) {
  const session = await launch(width);
  const { elements, anchors } = session.document;
  elements.get('#transfer-block').value = session.fixtureSource;
  elements.get('#transfer-block').dispatch('input');
  elements.get('#check-course').dispatch('click');
  assert.equal(elements.get('#download-imscc').disabled, true, 'privacy confirmation must gate download');
  elements.get('#privacy-confirmation').checked = true;
  elements.get('#privacy-confirmation').dispatch('change');
  assert.equal(elements.get('#download-imscc').disabled, false);
  assert.equal(elements.get('#download-imscc').textContent, 'Download .imscc');
  assert.equal(elements.get('#status').textContent, 'Course package ready');
  elements.get('#download-imscc').dispatch('click');
  assert.equal(session.objectUrlCount(), 1);
  assert.equal(anchors.length, 1);
  assert.equal(anchors[0].download, 'cis-277-course.imscc');
  assert.equal(elements.get('#status').textContent, 'Course package ready');
  assert.match(elements.get('#validation-messages').textContent, /unpublished Canvas sandbox/i);
  assert.match(elements.get('#validation-messages').textContent, /not proof of Bergen Canvas compatibility/i);
}

test('desktop browser journey validates an approved real transfer block and downloads one local imscc', async () => {
  await runHappyPath(1280);
});

test('mobile browser journey preserves the same confirmation-gated local packaging behavior', async () => {
  await runHappyPath(390);
});

test('local package generation completes before readiness and download reuses the built bytes', async () => {
  const session = await launch(1280);
  const { elements } = session.document;
  elements.get('#transfer-block').value = session.fixtureSource;
  elements.get('#transfer-block').dispatch('input');
  elements.get('#check-course').dispatch('click');
  assert.equal(session.encoding.calls, 0, 'validation alone must not create package bytes');

  elements.get('#privacy-confirmation').checked = true;
  elements.get('#privacy-confirmation').dispatch('change');
  assert.ok(session.encoding.calls > 0, 'privacy confirmation must finish local package generation before readiness');
  assert.equal(elements.get('#status').textContent, 'Course package ready');
  assert.equal(elements.get('#download-imscc').disabled, false);

  const encodeCallsAtReady = session.encoding.calls;
  elements.get('#download-imscc').dispatch('click');
  assert.equal(session.encoding.calls, encodeCallsAtReady, 'download must use the package already built at readiness');
});

test('generation failure after new input disables download and cannot expose stale package bytes', async () => {
  const session = await launch(1280);
  const { elements } = session.document;
  elements.get('#transfer-block').value = session.fixtureSource;
  elements.get('#transfer-block').dispatch('input');
  elements.get('#check-course').dispatch('click');
  elements.get('#privacy-confirmation').checked = true;
  elements.get('#privacy-confirmation').dispatch('change');

  elements.get('#transfer-block').value = session.alternateFixtureSource;
  elements.get('#transfer-block').dispatch('input');
  assert.equal(elements.get('#download-imscc').disabled, true);

  elements.get('#check-course').dispatch('click');
  session.encoding.fail = true;
  elements.get('#privacy-confirmation').checked = true;
  elements.get('#privacy-confirmation').dispatch('change');
  assert.equal(elements.get('#download-imscc').disabled, true);
  assert.notEqual(elements.get('#status').textContent, 'Course package ready');

  elements.get('#download-imscc').dispatch('click');
  assert.equal(session.objectUrlCount(), 0, 'failed regeneration must not download bytes from the prior input');
});

test('XML 1.0-invalid control input creates no package bytes, object URL, or readiness claim', async () => {
  const session = await launch(1280);
  const { elements } = session.document;
  const invalid = JSON.parse(session.fixtureSource);
  invalid.pages[0].body = `Allowed prefix${String.fromCharCode(1)}hidden suffix`;
  const invalidSource = JSON.stringify(invalid);
  elements.get('#transfer-block').value = invalidSource;
  elements.get('#transfer-block').dispatch('input');
  elements.get('#check-course').dispatch('click');

  assert.equal(elements.get('#transfer-block').value, invalidSource, 'non-sensitive invalid XML input remains correctable in memory');
  assert.equal(elements.get('#download-imscc').disabled, true);
  assert.equal(session.encoding.calls, 0, 'validation failure must stop before package-byte generation');
  assert.match(elements.get('#status').textContent, /XML 1\.0/);
  assert.doesNotMatch(elements.get('#status').textContent, /Allowed prefix|hidden suffix/);

  elements.get('#privacy-confirmation').checked = true;
  elements.get('#privacy-confirmation').dispatch('change');
  elements.get('#download-imscc').dispatch('click');
  assert.equal(elements.get('#download-imscc').disabled, true);
  assert.notEqual(elements.get('#status').textContent, 'Course package ready');
  assert.equal(session.encoding.calls, 0);
  assert.equal(session.objectUrlCount(), 0);
});

test('a throwing download click is contained and always revokes and removes its temporary URL', async () => {
  const session = await launch(1280, { anchorClickThrows: true });
  const { elements, anchors } = session.document;
  elements.get('#transfer-block').value = session.fixtureSource;
  elements.get('#transfer-block').dispatch('input');
  elements.get('#check-course').dispatch('click');
  elements.get('#privacy-confirmation').checked = true;
  elements.get('#privacy-confirmation').dispatch('change');

  assert.doesNotThrow(() => elements.get('#download-imscc').dispatch('click'));
  assert.equal(session.objectUrlCount(), 1);
  assert.equal(session.revokedObjectUrlCount(), 1);
  assert.equal(anchors.length, 1);
  assert.equal(anchors[0].removed, true);
  assert.match(elements.get('#status').textContent, /download could not start/i);
  assert.notEqual(elements.get('#status').textContent, 'Course package ready');
});

test('malformed input stays correctable while unsafe or protected input is cleared and no rejected path creates a ZIP', async () => {
  const session = await launch(1280);
  const { elements, anchors } = session.document;
  const correctable = JSON.parse(session.fixtureSource);
  correctable.version = '9.9';
  const correctableSource = JSON.stringify(correctable);
  elements.get('#transfer-block').value = correctableSource;
  elements.get('#transfer-block').dispatch('input');
  elements.get('#privacy-confirmation').checked = true;
  elements.get('#check-course').dispatch('click');
  assert.equal(elements.get('#transfer-block').value, correctableSource);
  assert.equal(elements.get('#privacy-confirmation').checked, false);
  assert.equal(elements.get('#download-imscc').disabled, true);
  assert.match(elements.get('#status').textContent, /version 0\.1/i);

  elements.get('#transfer-block').value = '{"format":';
  elements.get('#transfer-block').dispatch('input');
  elements.get('#privacy-confirmation').checked = true;
  elements.get('#check-course').dispatch('click');
  assert.equal(elements.get('#transfer-block').value, '{"format":');
  assert.equal(elements.get('#privacy-confirmation').checked, false);
  assert.equal(elements.get('#download-imscc').disabled, true);
  assert.match(elements.get('#status').textContent, /complete JSON Bergen Course Transfer Block/i);

  const unsafe = JSON.parse(session.fixtureSource);
  unsafe.pages[0].body = '<img src=x onerror=alert(1)>';
  elements.get('#transfer-block').value = JSON.stringify(unsafe);
  elements.get('#transfer-block').dispatch('input');
  elements.get('#privacy-confirmation').checked = true;
  elements.get('#check-course').dispatch('click');
  assert.equal(elements.get('#transfer-block').value, '');
  assert.equal(elements.get('#privacy-confirmation').checked, false);
  assert.equal(elements.get('#download-imscc').disabled, true);
  assert.match(elements.get('#status').textContent, /plain text without HTML/i);
  assert.doesNotMatch(elements.get('#status').textContent, /img|onerror|alert/i);

  elements.get('#transfer-block').value = '{"body":"Student: Example Learner has diabetes.",';
  elements.get('#transfer-block').dispatch('input');
  elements.get('#privacy-confirmation').checked = true;
  elements.get('#check-course').dispatch('click');
  assert.equal(elements.get('#transfer-block').value, '');
  assert.equal(elements.get('#privacy-confirmation').checked, false);
  assert.equal(elements.get('#download-imscc').disabled, true);
  assert.equal(session.objectUrlCount(), 0);
  assert.equal(anchors.length, 0);
  assert.match(elements.get('#status').textContent, /Protected or identifiable student information is not accepted/i);
  assert.match(elements.get('#status').textContent, /Canvas is the only student-record system/i);
  assert.doesNotMatch(elements.get('#status').textContent, /Example Learner|diabetes/i);
});
