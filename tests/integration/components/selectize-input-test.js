import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import $ from 'jquery/dist/jquery.js';

module('Integration | Component | selectize-input', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.originalSelectize = $.fn.selectize;
    this.selectizeCalls = {
      clearOptions: 0,
      addOption: 0,
      setValue: 0,
      clear: 0,
      refreshOptions: 0,
    };

    let latestInstance = null;
    this.getLatestInstance = () => latestInstance;

    const calls = this.selectizeCalls;
    $.fn.selectize = function () {
      latestInstance = {
        isOpen: false,
        items: [],
        clearOptions() {
          calls.clearOptions += 1;
        },
        addOption() {
          calls.addOption += 1;
        },
        setValue(values) {
          calls.setValue += 1;
          this.items = Array.isArray(values) ? values.slice() : [values];
        },
        clear() {
          calls.clear += 1;
          this.items = [];
        },
        refreshOptions() {
          calls.refreshOptions += 1;
        },
        disable() {},
        enable() {},
      };

      return [{ selectize: latestInstance }];
    };
  });

  hooks.afterEach(function () {
    $.fn.selectize = this.originalSelectize;
  });

  test('it skips option refresh while dropdown is open when preserveCurrentItemsOnOptionsUpdate is enabled', async function (assert) {
    this.setProperties({
      options: [{ id: 'user-1', username: 'alex' }],
      items: ['user-1'],
    });

    await render(hbs`
      <SelectizeInput
        @inputId='student-select'
        @initialOptions={{this.options}}
        @initialItems={{this.items}}
        @valueField='id'
        @labelField='username'
        @searchField='username'
        @maxItems={{10}}
        @preserveCurrentItemsOnOptionsUpdate={{true}}
      />
    `);
    await settled();

    const instance = this.getLatestInstance();
    assert.ok(instance, 'selectize instance is initialized');
    const initialClearOptionsCalls = this.selectizeCalls.clearOptions;

    instance.isOpen = true;
    this.set('options', [
      { id: 'user-1', username: 'alex' },
      { id: 'user-2', username: 'sam' },
    ]);
    await settled();

    assert.strictEqual(
      this.selectizeCalls.clearOptions,
      initialClearOptionsCalls,
      'options are not reset while dropdown is open'
    );

    instance.isOpen = false;
    this.set('options', [
      { id: 'user-1', username: 'alex' },
      { id: 'user-2', username: 'sam' },
      { id: 'user-3', username: 'jamie' },
    ]);
    await settled();

    assert.strictEqual(
      this.selectizeCalls.clearOptions,
      initialClearOptionsCalls + 1,
      'options refresh resumes when dropdown is closed'
    );
  });
});
