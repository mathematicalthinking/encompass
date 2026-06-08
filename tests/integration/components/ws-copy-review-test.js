import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | ws-copy-review', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.setProperties({
      mode: 'M',
      workspaceOwner: { username: 'workspace_owner' },
      name: 'Copied Workspace',
      recordCounts: {
        submissions: 6,
        selections: 5,
        comments: 4,
        responses: 3,
        folders: 2,
        collaborators: 1,
      },
      showLoadingMessage: false,
      proceedCount: 0,
      backDirections: [],
      onProceed: () => {
        this.set('proceedCount', this.proceedCount + 1);
      },
      onBack: (direction) => {
        this.set('backDirections', [...this.backDirections, direction]);
      },
    });
  });

  async function renderComponent() {
    await render(hbs`
      <WsCopyReview
        @showLoadingMessage={{this.showLoadingMessage}}
        @mode={{this.mode}}
        @owner={{this.workspaceOwner}}
        @name={{this.name}}
        @onProceed={{this.onProceed}}
        @onBack={{this.onBack}}
        @recordCounts={{this.recordCounts}}
      />
    `);
  }

  test('it renders the workspace copy summary', async function (assert) {
    await renderComponent();

    assert.dom('#ws-copy-review').exists();
    assert.dom('.item-card.name').hasText('Copied Workspace');
    assert.dom('.item-card.description').hasText('workspace_owner');
    assert.dom('.privacy-icon .fa-unlock').exists();
    assert
      .dom('.workspace-stats .stat-number')
      .exists({ count: 6 }, 'all record counts are rendered');
    assert
      .dom('.workspace-stats')
      .hasText(
        'Submissions 6 Selections 5 Comments 4 Responses 3 Folders 2 Collaborators 1'
      );
  });

  test('it displays the request progress message when requested', async function (assert) {
    this.set('showLoadingMessage', true);

    await renderComponent();

    assert
      .dom('.loading-message')
      .hasText(
        'Your copy request is in progress. Thank you for your patience.'
      );
  });

  test('it sends the wizard navigation callbacks', async function (assert) {
    await renderComponent();

    await click('.cancel-button');
    await click('.nav-btn-container .primary-button:not(.cancel-button)');

    assert.deepEqual(this.backDirections, [-1], 'back moves one step');
    assert.strictEqual(this.proceedCount, 1, 'create proceeds once');
  });
});
