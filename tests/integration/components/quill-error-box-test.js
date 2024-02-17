// tests/integration/components/quill-error-box-test.js
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';

module('Integration | Component | quill-error-box', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    // Mock the quillManager service
    this.owner.register(
      'service:quillManager',
      class MockQuillManagerService extends Service {
        editorState = {};
        hasErrors(id) {
          return true;
        }
        getErrorMsgs(id) {
          return ['Mock error message'];
        }
      }
    );
  });

  test('it renders error messages from quillManager service', async function (assert) {
    await render(hbs`<QuillErrorBox @quillEditorId="testEditor"/>`);

    assert.dom().includesText('Mock error message');
  });
});
