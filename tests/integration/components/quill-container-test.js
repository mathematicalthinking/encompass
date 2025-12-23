import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';

module('Integration | Component | ui/quill-container', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    class UtilityMethodsStub extends Service {}
    this.owner.register('service:utility-methods', UtilityMethodsStub);
  });

  test('renders quill editor', async function (assert) {
    await render(hbs`<Ui::QuillContainer />`);
    assert.dom('.ql-container').exists('Quill container is rendered');
    assert.dom('.ql-editor').exists('Quill editor is rendered');
  });

  test('uses custom section id', async function (assert) {
    await render(hbs`<Ui::QuillContainer @attrSectionId="custom-editor" />`);
    assert.dom('#custom-editor').exists('Custom section ID is applied');
  });

  test('calls onEditorChange when text changes', async function (assert) {
    let changeCount = 0;
    let lastContent = null;
    let lastIsEmpty = null;
    let lastIsOverLimit = null;

    this.set('handleChange', (content, isEmpty, isOverLimit) => {
      changeCount++;
      lastContent = content;
      lastIsEmpty = isEmpty;
      lastIsOverLimit = isOverLimit;
    });

    await render(hbs`
      <Ui::QuillContainer @onEditorChange={{this.handleChange}} />
    `);

    await settled();

    assert.ok(changeCount > 0, 'onEditorChange was called');
    assert.strictEqual(lastIsEmpty, true, 'Editor starts empty');
    assert.strictEqual(lastIsOverLimit, false, 'Editor not over limit');
  });

  test('displays starting text', async function (assert) {
    this.set('startingText', '<p>Hello World</p>');

    await render(hbs`
      <Ui::QuillContainer @startingText={{this.startingText}} />
    `);

    await settled();

    assert.dom('.ql-editor').containsText('Hello World', 'Starting text is displayed');
  });

  test('handles plain text starting text', async function (assert) {
    this.set('startingText', 'Plain text content');

    await render(hbs`
      <Ui::QuillContainer @startingText={{this.startingText}} />
    `);

    await settled();

    assert.dom('.ql-editor').containsText('Plain text content', 'Plain text is displayed');
  });

  test('shows empty error when showErrors is true and editor is empty', async function (assert) {
    await render(hbs`
      <Ui::QuillContainer @showErrors={{true}} />
    `);

    await settled();

    assert.dom('.error-box').exists('Error box is shown');
    assert.dom('.error-box').containsText('Please enter a response', 'Empty error message is shown');
  });

  test('uses custom empty error message', async function (assert) {
    await render(hbs`
      <Ui::QuillContainer 
        @showErrors={{true}} 
        @emptyErrorMessage="Custom error message" 
      />
    `);

    await settled();

    assert.dom('.error-box').containsText('Custom error message', 'Custom error message is shown');
  });

  test('shows length limit error when content exceeds maxLength', async function (assert) {
    this.set('startingText', '<p>' + 'a'.repeat(200) + '</p>');

    await render(hbs`
      <Ui::QuillContainer 
        @startingText={{this.startingText}}
        @maxLength={{100}}
        @showErrors={{true}}
      />
    `);

    await settled();

    assert.dom('.error-box').exists('Error box is shown');
    assert.dom('.error-box').containsText('exceeds the maximum limit', 'Length limit error is shown');
  });

  test('does not show errors when showErrors is false', async function (assert) {
    await render(hbs`
      <Ui::QuillContainer @showErrors={{false}} />
    `);

    await settled();

    assert.dom('.error-box').doesNotExist('Error box is not shown when showErrors is false');
  });

  test('detects non-empty content with images', async function (assert) {
    let lastIsEmpty = null;

    this.set('handleChange', (content, isEmpty) => {
      lastIsEmpty = isEmpty;
    });

    this.set('startingText', '<p><img src="test.jpg" /></p>');

    await render(hbs`
      <Ui::QuillContainer 
        @startingText={{this.startingText}}
        @onEditorChange={{this.handleChange}} 
      />
    `);

    await settled();

    assert.strictEqual(lastIsEmpty, false, 'Editor with image is not empty');
  });

  test('applies custom toolbar options', async function (assert) {
    this.set('customOptions', {
      modules: {
        toolbar: [['bold', 'italic']],
      },
      theme: 'snow',
    });

    await render(hbs`
      <Ui::QuillContainer @options={{this.customOptions}} />
    `);

    await settled();

    assert.dom('.ql-toolbar').exists('Toolbar is rendered');
    assert.dom('.ql-bold').exists('Bold button exists');
    assert.dom('.ql-italic').exists('Italic button exists');
  });
});
