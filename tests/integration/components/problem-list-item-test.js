import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';

module('Integration | Component | problem-list-item', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register(
      'service:current-user',
      class extends Service {
        isAdmin = false;
        isPdAdmin = false;
        isStudent = false;
      }
    );
    this.owner.register(
      'service:problem-permissions',
      class extends Service {
        writePermissions() {
          return { canEdit: false, canDelete: false, canAssign: false };
        }
      }
    );
    this.owner.register('service:sweet-alert', class extends Service {});
    this.owner.register('service:problem-utils', class extends Service {});
    this.owner.register('service:router', class extends Service {});
    this.owner.register('service:store', class extends Service {});

    this.problem = {
      id: 'p1',
      title: 'Slope of a Line',
      text: '<b>Find</b> the slope',
      status: 'approved',
      isTrashed: false,
      privacySetting: 'M',
      createDate: new Date('2026-01-01').toISOString(),
    };
  });

  test('renders the problem title and (html) text in list view', async function (assert) {
    this.set('problem', this.problem);

    await render(hbs`<ProblemListItem @problem={{this.problem}} @isList={{true}} />`);

    assert.dom('.item-section.name').includesText('Slope of a Line');
    assert.dom('.item-section.description').includesText('Find the slope');
  });

  test('renders the privacy icon', async function (assert) {
    this.set('problem', this.problem);

    await render(hbs`<ProblemListItem @problem={{this.problem}} @isList={{true}} />`);

    // 'M' (private) -> unlock icon via the public-private helper
    assert.dom('.item-section.privacy .fa-unlock').exists();
  });

  test('shows the recommended star only when the problem is recommended', async function (assert) {
    this.set('problem', this.problem);
    this.set('recommended', []);

    await render(
      hbs`<ProblemListItem @problem={{this.problem}} @isList={{true}} @recommendedProblems={{this.recommended}} />`
    );
    assert.dom('.star-icon').doesNotExist('not recommended -> no star');

    this.set('recommended', [this.problem]);
    await render(
      hbs`<ProblemListItem @problem={{this.problem}} @isList={{true}} @recommendedProblems={{this.recommended}} />`
    );
    assert.dom('.star-icon').exists('recommended -> star shown');
  });
});
