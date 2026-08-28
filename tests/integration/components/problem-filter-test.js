import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';
import templateOnly from '@ember/component/template-only';

module('Integration | Component | problem-filter', function (hooks) {
  setupRenderingTest(hooks);

  function registerCurrentUser(owner, isAdmin) {
    owner.register(
      'service:current-user',
      class extends Service {
        user = { isAdmin };
      }
    );
  }

  hooks.beforeEach(function () {
    this.owner.register('service:store', class extends Service {});
    // Stub the child filters so we test problem-filter's own logic in isolation.
    this.owner.register('template:components/primary-list-filter', hbs`<div class='primary-stub'></div>`);
    this.owner.register('component:primary-list-filter', templateOnly());
    this.owner.register('template:components/category-filter', hbs`<div class='category-stub'></div>`);
    this.owner.register('component:category-filter', templateOnly());
    this.set('mainSelection', { value: 'mine' });
  });

  test('renders the primary filter and category header', async function (assert) {
    registerCurrentUser(this.owner, false);

    await render(hbs`<ProblemFilter @filterName='p' @mainSelection={{this.mainSelection}} />`);

    assert.dom('#problem-filter').exists();
    assert.dom('.primary-stub').exists('always renders the primary list filter');
    assert.dom('.category-header').exists();
  });

  test('the More (admin) section is hidden for a non-admin', async function (assert) {
    registerCurrentUser(this.owner, false);

    await render(hbs`<ProblemFilter @filterName='p' @mainSelection={{this.mainSelection}} />`);

    assert.dom('.more-header').doesNotExist('non-admin does not see More filters');
  });

  test('the More (admin) section renders for an admin', async function (assert) {
    registerCurrentUser(this.owner, true);

    await render(hbs`<ProblemFilter @filterName='p' @mainSelection={{this.mainSelection}} />`);

    assert.dom('.more-header').exists('admin sees More filters');
  });

  test('toggling the category header reveals the category filter', async function (assert) {
    registerCurrentUser(this.owner, false);

    await render(hbs`<ProblemFilter @filterName='p' @mainSelection={{this.mainSelection}} />`);
    assert.dom('.category-stub').doesNotExist('collapsed by default');

    await click('.category-header');
    assert.dom('.category-stub').exists('category filter shown after expand');
  });
});
