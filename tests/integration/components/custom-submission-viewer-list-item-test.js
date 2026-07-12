import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module(
  'Integration | Component | custom-submission-viewer-list-item',
  function (hooks) {
    setupRenderingTest(hooks);

    async function renderComponent(context, overrides = {}) {
      context.setProperties({
        submission: {
          id: 's1',
          student: 'Alice',
          answer: {
            explanation: '<strong>because</strong> reasons',
            createDate: new Date(2024, 2, 5), // local Mar 5 2024 (tz-safe)
          },
          selections: [1, 2, 3],
        },
        selectedSubmissionIds: [],
        onSelect: () => {},
        ...overrides,
      });

      await render(hbs`
        <CustomSubmissionViewerListItem
          @submission={{this.submission}}
          @selectedSubmissionIds={{this.selectedSubmissionIds}}
          @onSelect={{this.onSelect}}
        />
      `);
    }

    test('renders the submission student, explanation html, and selection count', async function (assert) {
      await renderComponent(this);

      assert.dom('.item-section.student').hasText('Alice');
      assert
        .dom('.item-section.explanation strong')
        .hasText('because', 'explanation renders as html, not escaped');
      assert.dom('.item-section.selections').hasText('3');
      assert.dom('.item-section.date').exists();
    });

    test('the checkbox reflects whether the submission is selected', async function (assert) {
      await renderComponent(this, { selectedSubmissionIds: ['s1'] });
      assert.dom('input[type="checkbox"]').isChecked();

      await renderComponent(this, { selectedSubmissionIds: ['other'] });
      assert.dom('input[type="checkbox"]').isNotChecked();
    });

    test('clicking the checkbox calls @onSelect with the submission id', async function (assert) {
      let selectedIds = [];
      await renderComponent(this, {
        onSelect: (id) => selectedIds.push(id),
      });

      await click('input[type="checkbox"]');

      assert.deepEqual(selectedIds, ['s1'], 'onSelect fired with the id');
    });
  }
);
