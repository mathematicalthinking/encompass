import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Component from '@glimmer/component';
import Service from '@ember/service';
import { action } from '@ember/object';

// Value the stubbed selectize hands back on its next "add" click.
let nextSelectValue = null;

class SelectizeStub extends Component {
  @action
  add() {
    this.args.onItemAdd?.(
      nextSelectValue,
      {},
      this.args.propToUpdate,
      this.args.model
    );
  }
  @action
  remove() {
    this.args.onItemRemove?.(nextSelectValue, null, this.args.propToUpdate);
  }
}

module('Integration | Component | submissions-filter', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    nextSelectValue = null;

    class CurrentUserStub extends Service {
      user = {
        id: 'me',
        accountType: 'A',
        actingRole: 'teacher',
        isAdmin: true,
        isStudent: false,
      };
      isAdmin = true;
      isStudent = false;
    }
    class UtilsStub extends Service {
      isNonEmptyArray(a) {
        return Array.isArray(a) && a.length > 0;
      }
      isNullOrUndefined(v) {
        return v === null || v === undefined;
      }
    }
    this.owner.register('service:current-user', CurrentUserStub);
    this.owner.register('service:utility-methods', UtilsStub);
    this.owner.register('service:sweet-alert', class extends Service {});
    this.owner.register('service:error-handling', class extends Service {});

    // Stub selectize + error box so the filter renders in isolation.
    this.owner.register('component:selectize-input', SelectizeStub);
    this.owner.register(
      'template:components/selectize-input',
      hbs`<div class='selectize-stub' data-prop={{@propToUpdate}}>
        <button type='button' class='add' {{on 'click' this.add}}>add</button>
        <button type='button' class='remove' {{on 'click' this.remove}}>rm</button>
      </div>`
    );
    this.owner.register(
      'template:components/ui/error-box',
      hbs`<div class='error-box-stub'>{{@error}}
        <button type='button' class='dismiss' {{on 'click' @resetError}}>x</button>
      </div>`
    );
    this.owner.register('component:ui/error-box', class extends Component {});

    // The container feeds these as model args; empty keeps the pools trivial.
    this.set('sections', []);
    this.set('assignments', []);
    this.set('users', []);
    this.searchArgs = null;
    this.set('onSearch', (criteria) => {
      this.searchArgs = criteria;
    });
  });

  async function renderComponent(context) {
    return render(hbs`
      <SubmissionsFilter
        @onSearch={{this.onSearch}}
        @sections={{this.sections}}
        @assignments={{this.assignments}}
        @users={{this.users}}
      />
    `);
  }

  test('renders the filter shell with the five selectize inputs and a search button', async function (assert) {
    await renderComponent(this);

    assert.dom('#submissions-filter').exists();
    assert.dom('.selectize-stub').exists({ count: 5 });
    assert.dom('.search-action button').hasText('Search');
  });

  test('searching with no criteria shows the missing-criteria error and does not call onSearch', async function (assert) {
    await renderComponent(this);

    await click('.search-action button');

    assert.dom('.error-box-stub').includesText('Please select');
    assert.strictEqual(this.searchArgs, null, 'onSearch was not called');
  });

  test('dismissing the missing-criteria error clears it', async function (assert) {
    await renderComponent(this);
    await click('.search-action button');
    assert.dom('.error-box-stub').exists('error is showing');

    await click('.error-box-stub .dismiss');

    assert.dom('.error-box-stub').doesNotExist('error cleared');
  });

  test('selecting a teacher then searching calls onSearch with the teacher id and date range', async function (assert) {
    const store = this.owner.lookup('service:store');
    store.createRecord('user', { id: 'u-teacher', username: 'teach' });

    await renderComponent(this);

    nextSelectValue = 'u-teacher';
    await click('[data-prop="selectedTeacher"] .add');
    await click('.search-action button');

    assert.ok(this.searchArgs, 'onSearch was called');
    assert.strictEqual(this.searchArgs.teacher, 'u-teacher', 'includes teacher id');
    assert.ok(this.searchArgs.startDate, 'includes a start date');
    assert.ok(this.searchArgs.endDate, 'includes an end date');
    assert.strictEqual(
      this.searchArgs.assignment,
      undefined,
      'omits empty criteria keys'
    );
  });

  test('toggling the VMT section reveals the VMT inputs', async function (assert) {
    await renderComponent(this);

    assert.dom('.vmt-filter-list').doesNotExist('vmt filters start hidden');

    await click('.vmt-header');

    assert.dom('.vmt-filter-list').exists('vmt filters shown after toggle');
  });

  test('shows the admin "Only Trashed" checkbox when currentUser is an admin', async function (assert) {
    // Verifies currentUser is actually wired up now (it was never injected before).
    await renderComponent(this);

    assert.dom('.include-trashed-input').exists('admin-only trashed filter renders');
  });
});
