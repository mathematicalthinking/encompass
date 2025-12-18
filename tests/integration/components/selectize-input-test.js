import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';
import EmberObject from '@ember/object';
import { A } from '@ember/array';
import $ from 'jquery';
import 'selectize';

module('Integration | Component | selectize-input', function (hooks) {
  setupRenderingTest(hooks);

  let originalSelectizeFn;

  hooks.beforeEach(function () {
    // Mock store to support peekAll and query used by the component
    const MockStore = class extends Service {
      peekAll(modelName) {
        if (modelName === 'user') {
          return A([
            EmberObject.create({ id: '1', username: 'alice' }),
            EmberObject.create({ id: '2', username: 'bob' }),
          ]);
        }
        return A([]);
      }
      query(modelName, queryParams) {
        // Basic filter by the provided usernameSearch query
        const q = (queryParams.usernameSearch || '').toLowerCase();
        let results = A([
          EmberObject.create({ id: '1', username: 'alice' }),
          EmberObject.create({ id: '2', username: 'alina' }),
          EmberObject.create({ id: '3', username: 'bob' }),
        ]);
        let filtered = results.filter((o) =>
          o.username.toLowerCase().includes(q)
        );
        // mimic AdapterPopulatedRecordArray shape with meta and slice
        filtered.meta = { total: filtered.length };
        filtered.slice = Array.prototype.slice.bind(filtered);
        return Promise.resolve(filtered);
      }
    };

    this.owner.register('service:store', MockStore);

    // Stub jQuery selectize plugin
    originalSelectizeFn = $.fn.selectize;
    $.fn.selectize = function (options) {
      // For each element in the jQuery collection, attach a minimal selectize instance
      this.each(function () {
        const selectEl = this;
        // Build stub DOM next to the select for visual assertions
        const $control = $(
          '<div class="selectize-control">\
            <div class="selectize-input"><input type="text" /></div>\
            <div class="selectize-dropdown"><div class="selectize-dropdown-content"></div></div>\
          </div>'
        );
        $(selectEl).after($control);

        const instance = {
          isStub: true,
          cleared: false,
          destroyed: false,
          disabled: false,
          clear() {
            this.cleared = true;
            $control.find('.selectize-dropdown-content').empty();
          },
          destroy() {
            this.destroyed = true;
            $control.remove();
          },
          disable() {
            this.disabled = true;
          },
          async search(query) {
            // Invoke component-provided async loader
            if (typeof options.load === 'function') {
              await new Promise((resolve) => {
                options.load(query, (results) => {
                  const $content = $control.find('.selectize-dropdown-content');
                  $content.empty();
                  (results || []).forEach((item) => {
                    let label =
                      item.username || item[options.labelField] || String(item);
                    $content.append(`<div class="option">${label}</div>`);
                  });
                  resolve();
                });
              });
            }
          },
        };

        // Expose the instance on the select element like real plugin does
        selectEl.selectize = instance;
      });

      return this; // jQuery chainable
    };
  });

  hooks.afterEach(function () {
    // Restore original plugin to avoid leaking between tests
    $.fn.selectize = originalSelectizeFn;
  });

  test('search input loads and displays dropdown results', async function (assert) {
    assert.expect(6);

    this.set('resetKey', 0);

    await render(hbs`
      <SelectizeInput
        @inputId="test-select"
        @model="user"
        @isAsync={{true}}
        @labelField="username"
        @valueField="id"
        @searchField="username"
        @queryParamsKey="usernameSearch"
        @resetKey={{this.resetKey}}
      />
    `);

    // Ensure select element exists and plugin instance is attached
    const selectEl = document.getElementById('test-select');
    assert.ok(selectEl, 'select element renders');
    assert.ok(selectEl.selectize, 'selectize instance is attached');
    assert.true(
      selectEl.selectize.isStub,
      'using stubbed selectize implementation'
    );

    // Trigger a search via stubbed instance and wait for DOM to update
    await selectEl.selectize.search('ali');
    await settled();

    // Assert dropdown contains expected results from store.query
    assert.dom('.selectize-dropdown .option').exists('options rendered');
    assert
      .dom('.selectize-dropdown')
      .includesText('alice')
      .includesText('alina');
  });

  test('resetKey change clears the selection/dropdown', async function (assert) {
    assert.expect(4);

    this.set('resetKey', 0);

    await render(hbs`
      <SelectizeInput
        @inputId="test-select"
        @model="user"
        @isAsync={{true}}
        @labelField="username"
        @valueField="id"
        @searchField="username"
        @queryParamsKey="usernameSearch"
        @resetKey={{this.resetKey}}
      />
    `);

    const selectEl = document.getElementById('test-select');
    assert.ok(selectEl.selectize, 'selectize instance is attached');
    assert.true(
      selectEl.selectize.isStub,
      'using stubbed selectize implementation'
    );

    // Populate dropdown first
    await selectEl.selectize.search('ali');
    await settled();
    assert
      .dom('.selectize-dropdown .option')
      .exists('options rendered before reset');

    // Update resetKey which should invoke clear()
    this.set('resetKey', 1);
    await settled();

    assert.true(
      selectEl.selectize.cleared,
      'selectize clear() was called on reset'
    );
  });
});
