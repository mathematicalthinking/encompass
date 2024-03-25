import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import Service from '@ember/service';

module('Integration | Component | quill-container', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register(
      'service:quill-manager',
      Service.extend({
        onEditorChange() {},
      })
    );

    this.setProperties({
      startingText: 'Initial text',
      attrSectionId: 'custom-section-id',
      maxLength: 1000,
      options: {},
      onEditorChange: () => {},
    });
  });

  test('it renders and interacts correctly with quill-manager service', async function (assert) {
    assert.expect(1); // Adjust the number of assertions as needed

    let onEditorChangeCalled = false;
    this.owner.lookup('service:quill-manager').set('onEditorChange', () => {
      onEditorChangeCalled = true;
    });

    await render(hbs`<QuillContainer
      @startingText={{this.startingText}}
      @attrSectionId={{this.attrSectionId}}
      @maxLength={{this.maxLength}}
      @options={{this.options}}
      @onEditorChange={{this.onEditorChange}}
    />`);

    // Assuming handleQuillChange is the method you need to trigger
    // Find the component's element and use it to call the method
    let component = find('.quill-container');
    if (component && component.componentInstance) {
      component.componentInstance.handleQuillChange();
      assert.ok(
        onEditorChangeCalled,
        'The onEditorChange method of quill-manager service was called'
      );
    } else {
      assert.ok(
        false,
        'Could not find the component instance to call handleQuillChange on it.'
      );
    }
  });
});
