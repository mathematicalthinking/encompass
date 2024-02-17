import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | quill-manager', function (hooks) {
  setupTest(hooks);

  test('it exists and initializes properties correctly', function (assert) {
    let service = this.owner.lookup('service:quill-manager');
    assert.ok(service);
    assert.deepEqual(service.editorState, {});
    assert.equal(service.maxResponseLength, 14680064);
  });

  test('getQuillErrors returns correct errors based on editorState', function (assert) {
    let service = this.owner.lookup('service:quill-manager');
    service.editorState['testId'] = { isEmpty: true, isOverflow: false };
    let errors = service.getQuillErrors('testId');
    assert.deepEqual(errors, ['emptyReplyError']);

    service.editorState['testId'] = { isEmpty: false, isOverflow: true };
    errors = service.getQuillErrors('testId');
    assert.deepEqual(errors, ['quillTooLongError']);
  });

  test('getQuillTooLongErrorMsg returns the correct error message', function (assert) {
    let service = this.owner.lookup('service:quill-manager');

    // Mock getHtml to control its output
    service.getHtml = (id) =>
      'Mocked HTML content that is clearly too long for the limit';

    // Assuming maxResponseLength and a mocked returnSizeDisplay output
    service.maxResponseLength = 100; // Simplify for testing
    service.returnSizeDisplay = (bytes) => `${bytes} bytes`;

    let id = 'testEditor';
    let expectedLength = service.getHtml(id).length;
    let expectedMessage = `The total size of your response (${service.returnSizeDisplay(
      expectedLength
    )}) exceeds the maximum limit of ${service.returnSizeDisplay(
      service.maxResponseLength
    )}. Please remove or resize any large images and try again.`;

    assert.strictEqual(
      service.getQuillTooLongErrorMsg(id),
      expectedMessage,
      'Error message matches expected output for too long content'
    );
  });

  test('recognizes that it has errors', function (assert) {
    let service = this.owner.lookup('service:quill-manager');
    service.editorState['testId'] = { isEmpty: true, isOverflow: false };
    assert.true(service.hasErrors('testId'));

    service.editorState['testId'] = { isEmpty: false, isOverflow: true };
    assert.true(service.hasErrors('testId'));
  });

  test('gets return expected defaults', function (assert) {
    let service = this.owner.lookup('service:quill-manager');
    service.editorState['testId'] = {
      text: 'blah',
      isEmpty: true,
      isOverflow: false,
    };

    const dummyId = 'otherId';

    assert.false(service.getIsEmpty(dummyId));
    assert.false(service.getIsOverflow(dummyId));
    assert.equal(service.getHtml(dummyId), '');
    assert.deepEqual(service.getErrorMsgs(dummyId), []);
  });

  test('clearEditor clears all state', function (assert) {
    let service = this.owner.lookup('service:quill-manager');
    const testId = 'otherId';
    service.editorState[testId] = {
      text: 'blah',
      isEmpty: true,
      isOverflow: true,
    };

    service.clearEditor(testId);

    assert.false(service.getIsEmpty(testId));
    assert.false(service.getIsOverflow(testId));
    assert.equal(service.getHtml(testId), '');
    assert.deepEqual(service.getErrorMsgs(testId), []);
  });

  test('onEditorChange updates editorState', function (assert) {
    let service = this.owner.lookup('service:quill-manager');
    const testId = 'testId';
    service.onEditorChange(testId, 'blah', true, true);

    assert.true(service.getIsEmpty(testId));
    assert.true(service.getIsOverflow(testId));
    assert.equal(service.getHtml(testId), 'blah');
  });
});
