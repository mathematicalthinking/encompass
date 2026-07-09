import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module(
  'Integration | Component | custom-submission-viewer-list',
  function (hooks) {
    setupRenderingTest(hooks);

    function submission(id, student) {
      return {
        id,
        student,
        answer: { explanation: `answer ${id}`, createDate: new Date(2024, 2, 5) },
        selections: [],
      };
    }

    async function renderComponent(context, overrides = {}) {
      context.setProperties({
        submissions: [submission('s1', 'Alice'), submission('s2', 'Bob')],
        selectedSubmissionIds: [],
        onSelect: () => {},
        onSelectAll: () => {},
        onUnselectAll: () => {},
        onDone: () => {},
        ...overrides,
      });

      await render(hbs`
        <CustomSubmissionViewerList
          @submissions={{this.submissions}}
          @selectedSubmissionIds={{this.selectedSubmissionIds}}
          @onSelect={{this.onSelect}}
          @onSelectAll={{this.onSelectAll}}
          @onUnselectAll={{this.onUnselectAll}}
          @onDone={{this.onDone}}
        />
      `);
    }

    test('renders a row per submission and the selected count', async function (assert) {
      await renderComponent(this, { selectedSubmissionIds: ['s1'] });

      assert.dom('#custom-submission-viewer-list').exists();
      assert.dom('.item-section.student').exists({ count: 2 });
      assert.dom('.info-bar-item.message').hasText('1 Submissions Selected');
    });

    test('the Done button calls @onDone', async function (assert) {
      let doneCalls = 0;
      await renderComponent(this, { onDone: () => (doneCalls += 1) });

      await click('.info-bar-item.button button');

      assert.strictEqual(doneCalls, 1, 'onDone fired (no arg mutation)');
    });

    test('the select-all checkbox toggles between @onSelectAll and @onUnselectAll', async function (assert) {
      let calls = [];
      await renderComponent(this, {
        onSelectAll: () => calls.push('all'),
        onUnselectAll: () => calls.push('none'),
      });

      await click('.sort-bar-item.check input');
      await click('.sort-bar-item.check input');

      assert.deepEqual(calls, ['all', 'none'], 'first check selects all, second clears');
    });

    test('selecting a row bubbles up through @onSelect', async function (assert) {
      let selectedIds = [];
      await renderComponent(this, { onSelect: (id) => selectedIds.push(id) });

      await click('.item-section.check input'); // first row (s1)

      assert.deepEqual(selectedIds, ['s1']);
    });
  }
);
