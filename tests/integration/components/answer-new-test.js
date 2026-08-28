import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';
import templateOnly from '@ember/component/template-only';

module('Integration | Component | answer-new', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.createdRecords = [];
    const createdRecords = this.createdRecords;

    this.owner.register('service:sweet-alert', class extends Service {});
    this.owner.register('service:utility-methods', class extends Service {});
    this.owner.register(
      'service:current-user',
      class extends Service {
        user = { id: 'u1' };
      }
    );
    this.owner.register(
      'service:store',
      class extends Service {
        createRecord(type, attrs) {
          createdRecords.push({ type, attrs });
          return { save: () => Promise.resolve({ id: 'new' }) };
        }
      }
    );
    this.owner.register(
      'service:error-handling',
      class extends Service {
        getErrors() {
          return [];
        }
        removeMessages() {}
        handleErrors() {}
      }
    );

    // Quill + ErrorBox drag in heavy deps; stub them.
    this.owner.register('template:components/ui/quill-container', hbs`<div class='quill-stub'></div>`);
    this.owner.register('component:ui/quill-container', templateOnly());
    this.owner.register(
      'template:components/ui/error-box',
      hbs`<div class='error-box-stub'>{{@error}}</div>`
    );
    this.owner.register('component:ui/error-box', templateOnly());
  });

  test('renders the answer form with the summary field and submit button', async function (assert) {
    await render(hbs`<AnswerNew />`);

    assert.dom('#answer-new').exists();
    assert.dom('textarea[name="brief-summary"]').exists('brief summary field');
    assert.dom('.quill-stub').exists('explanation editor');
    assert.dom('[data-test="submit-answer"]').exists('submit button');
  });

  test('submitting with an empty brief summary shows a validation error and creates nothing', async function (assert) {
    await render(hbs`<AnswerNew />`);

    await click('[data-test="submit-answer"]');

    assert.dom('.error-box-stub').exists('a validation error is shown');
    assert.strictEqual(
      this.createdRecords.length,
      0,
      'no answer record was created'
    );
  });
});
