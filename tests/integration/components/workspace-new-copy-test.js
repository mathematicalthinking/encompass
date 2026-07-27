import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import templateOnly from '@ember/component/template-only';
import Service from '@ember/service';

module('Integration | Component | workspace-new-copy', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    // services the container reads
    this.owner.register(
      'service:current-user',
      class extends Service {
        user = { id: 'me' };
        isStudent = false;
        isAdmin = false;
      }
    );
    this.owner.register(
      'service:error-handling',
      class extends Service {
        getErrors() {
          return [];
        }
        handleErrors() {}
      }
    );
    // store.findRecord is only called when @model.workspaceToCopy is set
    this.owner.register(
      'service:store',
      class extends Service {
        findRecord() {
          return Promise.resolve({ get: () => 'WS' });
        }
      }
    );

    // stub the step components + the summary item so we can assert which step
    // renders without pulling in their real behavior
    const register = (name, tmpl) => {
      this.owner.register(`template:components/${name}`, tmpl);
      this.owner.register(`component:${name}`, templateOnly());
    };
    register('ws-copy-workspace', hbs`<div class='stub-workspace'></div>`);
    register('ws-copy-config', hbs`<div class='stub-config'></div>`);
    register('ws-copy-owner-settings', hbs`<div class='stub-owner'></div>`);
    register('ws-copy-permissions', hbs`<div class='stub-permissions'></div>`);
    register('ws-copy-review', hbs`<div class='stub-review'></div>`);
    register('details-list-item', hbs`<li class='stub-detail'>{{@label}}</li>`);
  });

  async function renderComponent(context, model = { folderSets: [] }) {
    context.set('model', model);
    return render(hbs`<WorkspaceNewCopy @model={{this.model}} />`);
  }

  test('renders the container on step 1 with the summary and progress bar', async function (assert) {
    await renderComponent(this);

    assert.dom('#workspace-new-copy').exists();
    assert.dom('.progressbar .step-1.active-step').exists('starts on step 1');
    assert.dom('.stub-workspace').exists('renders the select-workspace step');
    assert
      .dom('.primary-filter-list .stub-detail')
      .exists({ count: 4 }, 'renders the summary detail items');
  });

  test('the summary sidebar starts collapsed and the toggle expands/collapses it', async function (assert) {
    await renderComponent(this);

    assert.dom('#filter-list-side').hasClass('collapse', 'starts collapsed');

    await click('.toggle-filter-menu button');
    assert
      .dom('#filter-list-side')
      .doesNotHaveClass('collapse', 'toggle expands it');
    assert
      .dom('#arrow-icon')
      .hasClass('fa-rotate-180', 'the arrow rotates when expanded');

    await click('.toggle-filter-menu button');
    assert.dom('#filter-list-side').hasClass('collapse', 'toggle collapses it');
  });

  test('clicking the list view collapses the sidebar', async function (assert) {
    await renderComponent(this);
    await click('.toggle-filter-menu button'); // expand first
    assert.dom('#filter-list-side').doesNotHaveClass('collapse');

    await click('.list-view');

    assert
      .dom('#filter-list-side')
      .hasClass('collapse', 'list-view click collapses');
  });
});
