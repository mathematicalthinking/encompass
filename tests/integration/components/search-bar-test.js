import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, fillIn, triggerKeyEvent } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Component from '@glimmer/component';

module('Integration | Component | search-bar', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    // Mock child components to isolate search-bar testing
    this.owner.register(
      'component:ui/my-select',
      class extends Component {
        static template = hbs`<div class="my-select-comp"></div>`;
      }
    );
    this.owner.register(
      'component:ui/error-box',
      class extends Component {
        static template = hbs`<div class="error-box">{{@error}}</div>`;
      }
    );
  });

  async function renderSearchBar(context, props = {}) {
    context.setProperties({
      onSearch: () => {},
      clearSearchResults: () => {},
      clearErrors: () => {},
      onCriterionChange: () => {},
      inputValue: '',
      queryErrors: [],
      ...props,
    });

    await render(hbs`<SearchBar
      @onSearch={{this.onSearch}}
      @clearSearchResults={{this.clearSearchResults}}
      @clearErrors={{this.clearErrors}}
      @onCriterionChange={{this.onCriterionChange}}
      @inputValue={{this.inputValue}}
      @basePlaceholder={{this.basePlaceholder}}
      @doSearchOnInputChange={{this.doSearchOnInputChange}}
      @doDebounce={{this.doDebounce}}
      @debounceTime={{this.debounceTime}}
      @showFilter={{this.showFilter}}
      @selectedCriterion={{this.selectedCriterion}}
      @queryErrors={{this.queryErrors}}
    />`);
  }

  // ---------- Basic Rendering ----------

  test('renders search input field with correct structure', async function (assert) {
    await renderSearchBar(this);
    assert.dom('.search-field').exists('search input field is rendered');
    assert.dom('.clear-field').exists('clear field container is present');
  });

  // ---------- Placeholder Text ----------

  test('displays custom placeholder text when provided', async function (assert) {
    await renderSearchBar(this, { basePlaceholder: 'Search items' });
    assert.dom('.search-field').hasAttribute('placeholder', 'Search items', 'placeholder matches provided text');
  });

  // ---------- Search Icon Visibility ----------

  test('shows search icon for manual search mode', async function (assert) {
    await renderSearchBar(this, { doSearchOnInputChange: false });
    assert.dom('.fa-search').exists('search icon is visible when manual search is enabled');
  });

  test('hides search icon for automatic search mode', async function (assert) {
    await renderSearchBar(this, { doSearchOnInputChange: true });
    assert.dom('.fa-search').doesNotExist('search icon is hidden when automatic search is enabled');
  });

  // ---------- Clear Button Visibility ----------

  test('displays clear button when input contains text', async function (assert) {
    await renderSearchBar(this, { inputValue: 'test' });
    assert.dom('.clear').exists('clear button is visible when input has value');
  });

  test('hides clear button when input is empty', async function (assert) {
    await renderSearchBar(this, { inputValue: '' });
    assert.dom('.clear').doesNotExist('clear button is hidden when input is empty');
  });

  // ---------- Clear Button Interaction ----------

  test('invokes clearSearchResults callback when clear button is clicked', async function (assert) {
    assert.expect(1);
    await renderSearchBar(this, {
      inputValue: 'test',
      clearSearchResults: () => {
        assert.ok(true, 'clearSearchResults callback was invoked');
      },
    });
    await click('.clear');
  });

  // ---------- Search Icon Interaction ----------

  test('triggers search with trimmed and lowercased query when search icon is clicked', async function (assert) {
    assert.expect(2);
    await renderSearchBar(this, {
      inputValue: 'test query',
      doSearchOnInputChange: false,
      onSearch: (val) => {
        assert.ok(true, 'onSearch callback was invoked');
        assert.strictEqual(val, 'test query', 'search value is trimmed and lowercased');
      },
    });
    await click('.fa-search');
  });

  // ---------- Automatic Search Mode ----------

  test('automatically triggers search on input change when enabled', async function (assert) {
    assert.expect(1);
    await renderSearchBar(this, {
      inputValue: 'test',
      doSearchOnInputChange: true,
      onSearch: () => {
        assert.ok(true, 'onSearch is called automatically on input change');
      },
    });
    await fillIn('.search-field', 'test query');
    await triggerKeyEvent('.search-field', 'keyup', 'Enter');
  });

  test('does not trigger search on input change when automatic search is disabled', async function (assert) {
    let searchCalled = false;
    await renderSearchBar(this, {
      inputValue: 'test',
      doSearchOnInputChange: false,
      onSearch: () => {
        searchCalled = true;
      },
    });
    await fillIn('.search-field', 'test query');
    await triggerKeyEvent('.search-field', 'keyup', 'Enter');
    assert.false(searchCalled, 'onSearch is not called when automatic search is disabled');
  });

  // ---------- Filter Dropdown Visibility ----------

  test('displays filter dropdown when showFilter is enabled', async function (assert) {
    await renderSearchBar(this, { showFilter: true });
    assert.dom('.select-bar').exists('filter dropdown is visible when showFilter is true');
  });

  test('hides filter dropdown when showFilter is disabled', async function (assert) {
    await renderSearchBar(this, { showFilter: false });
    assert.dom('.select-bar').doesNotExist('filter dropdown is hidden when showFilter is false');
  });

  // ---------- Filter Integration ----------

  test('appends selected criterion to placeholder text when filter is shown', async function (assert) {
    await renderSearchBar(this, {
      basePlaceholder: 'Search',
      showFilter: true,
      selectedCriterion: 'name',
    });
    assert.dom('.search-field').hasAttribute('placeholder', 'Search by name', 'placeholder includes selected criterion');
  });

  // ---------- Input Normalization ----------

  test('normalizes input by trimming whitespace and converting to lowercase', async function (assert) {
    assert.expect(1);
    await renderSearchBar(this, {
      inputValue: '  TEST QUERY  ',
      doSearchOnInputChange: false,
      onSearch: (val) => {
        assert.strictEqual(val, 'test query', 'input is trimmed and lowercased before search');
      },
    });
    await click('.fa-search');
  });

  // ---------- Callback Parameters ----------

  test('passes selected criterion to onSearch callback', async function (assert) {
    assert.expect(1);
    await renderSearchBar(this, {
      inputValue: 'test',
      doSearchOnInputChange: false,
      selectedCriterion: 'username',
      onSearch: (val, criterion) => {
        assert.strictEqual(criterion, 'username', 'criterion is passed to onSearch callback');
      },
    });
    await click('.fa-search');
  });

  // ---------- Edge Cases ----------

  test('handles missing onSearch callback without throwing error', async function (assert) {
    await renderSearchBar(this, {
      inputValue: 'test',
      doSearchOnInputChange: false,
      onSearch: undefined,
    });
    await click('.fa-search');
    assert.ok(true, 'component handles missing onSearch callback gracefully');
  });

  test('handles missing clearSearchResults callback without throwing error', async function (assert) {
    await renderSearchBar(this, {
      inputValue: 'test',
      clearSearchResults: undefined,
    });
    await click('.clear');
    assert.ok(true, 'component handles missing clearSearchResults callback gracefully');
  });

  // ---------- Error Display ----------

  test('renders error messages container', async function (assert) {
    await renderSearchBar(this);
    assert.dom('.error-messages').exists('error messages container is rendered');
  });
});
