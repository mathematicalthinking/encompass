import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import templateOnly from '@ember/component/template-only';

module('Integration | Component | import-work-step3', function (hooks) {
  setupRenderingTest(hooks);

  function findButtonByText(text) {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons.find((btn) => btn.textContent.trim() === text);
  }

  hooks.beforeEach(function () {
    // Stub the file picker: clicking "upload" hands the component a file, the
    // same way ImageUpload calls @handleUploadResults.
    const register = (name, tmpl) => {
      this.owner.register(`template:components/${name}`, tmpl);
      this.owner.register(`component:${name}`, templateOnly());
    };
    register(
      'image-upload',
      hbs`<div class='stub-upload'>
        <button
          type='button'
          class='do-upload'
          {{on 'click'
            (fn @handleUploadResults (array (hash originalname='pic.png' id='img-1')))}}
        >upload</button>
      </div>`
    );
    register(
      'ui/error-box',
      hbs`<div class='stub-error'>{{@error}}
        <button type='button' class='dismiss' {{on 'click' @resetError}}>x</button>
      </div>`
    );

    // Mirror the parent exactly: a plain (non-Ember) array held elsewhere.
    this.set('uploadedFiles', []);
    this.proceedArgs = null;
    this.backArgs = null;
    this.set('onProceed', (files) => {
      this.proceedArgs = files;
    });
    this.set('onBack', (delta) => {
      this.backArgs = delta;
    });
  });

  async function renderComponent(context) {
    return render(hbs`
      <ImportWorkStep3
        @uploadedFiles={{this.uploadedFiles}}
        @onProceed={{this.onProceed}}
        @onBack={{this.onBack}}
      />
    `);
  }

  test('Next with no files shows the missing-files error and does not proceed', async function (assert) {
    await renderComponent(this);

    await click(findButtonByText('Next'));

    assert.dom('.stub-error').includesText('must upload at least one file');
    assert.strictEqual(this.proceedArgs, null, 'onProceed was not called');
  });

  test('Next with files calls onProceed with the uploaded files', async function (assert) {
    this.set('uploadedFiles', [{ originalname: 'a.png', id: 'i1' }]);
    await renderComponent(this);

    await click(findButtonByText('Next'));

    assert.dom('.stub-error').doesNotExist('no missing-files error');
    assert.ok(Array.isArray(this.proceedArgs), 'onProceed got the files array');
    assert.strictEqual(this.proceedArgs.length, 1, 'with the one file');
  });

  test('Back calls onBack with -1', async function (assert) {
    await renderComponent(this);

    await click(findButtonByText('Back'));

    assert.strictEqual(this.backArgs, -1);
  });

  test('uploading files adds them to the list (in-place mutation stays reactive)', async function (assert) {
    await renderComponent(this);

    assert.dom('li').doesNotExist('list starts empty');

    await click('.do-upload');

    assert.dom('li').exists({ count: 1 }, 'the uploaded file renders');
    assert.dom('li').includesText('pic.png');
  });

  test('removing a file drops it from the list and destroys its image record', async function (assert) {
    const store = this.owner.lookup('service:store');
    store.createRecord('image', { id: 'img-1' });
    this.set('uploadedFiles', [{ originalname: 'pic.png', id: 'img-1' }]);

    await renderComponent(this);
    assert.dom('li').includesText('pic.png', 'file is listed');

    await click('li .fa-times-circle');

    assert.dom('li').doesNotExist('file removed from the list');
    assert.strictEqual(
      store.peekRecord('image', 'img-1'),
      null,
      'the orphaned image record was destroyed'
    );
  });

  test('dismissing the missing-files error clears it', async function (assert) {
    await renderComponent(this);
    await click(findButtonByText('Next'));
    assert.dom('.stub-error').exists('error is showing');

    await click('.stub-error .dismiss');

    assert.dom('.stub-error').doesNotExist('error cleared');
  });
});
