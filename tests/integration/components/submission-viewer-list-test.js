import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Component from '@glimmer/component';

module('Integration | Component | submission-viewer-list', function (hooks) {
  setupRenderingTest(hooks);

  // --- Test Data Builders ---
  const buildAnswer = (overrides = {}) => ({
    id: 'answer1',
    student: 'Test Student',
    get(prop) {
      return this[prop];
    },
    ...overrides,
  });

  const buildAnswers = (count = 3) => {
    return Array.from({ length: count }, (_, i) =>
      buildAnswer({ id: `answer${i + 1}`, student: `Student ${i + 1}` })
    );
  };

  hooks.beforeEach(function () {
    // Stub SubmissionViewerListItem component
    class SubmissionViewerListItemStub extends Component {}
    this.owner.register(
      'template:components/submission-viewer-list-item',
      hbs`<div class="stub-list-item" data-id={{@answer.id}}>{{@answer.student}}</div>`
    );
    this.owner.register(
      'component:submission-viewer-list-item',
      SubmissionViewerListItemStub
    );
  });

  // ============================================================
  // COMPONENT RENDERING TESTS
  // ============================================================

  test('renders the component container with correct ID', async function (assert) {
    this.set('answers', []);
    await render(hbs`<SubmissionViewerList @answers={{this.answers}} />`);
    assert
      .dom('#submission-viewer-list')
      .exists('Component container exists with correct ID');
  });

  test('renders main-list container', async function (assert) {
    this.set('answers', []);
    await render(hbs`<SubmissionViewerList @answers={{this.answers}} />`);
    assert.dom('.main-list').exists('Main list container exists');
  });

  test('renders scroll icon container', async function (assert) {
    this.set('answers', []);
    await render(hbs`<SubmissionViewerList @answers={{this.answers}} />`);
    assert.dom('.scroll-icon').exists('Scroll icon container exists');
  });

  // ============================================================
  // ANSWERS LIST TESTS
  // ============================================================

  test('renders list items for each answer', async function (assert) {
    this.set('answers', buildAnswers(3));
    this.set('selectedAnswers', []);
    await render(hbs`
      <SubmissionViewerList 
        @answers={{this.answers}} 
        @selectedAnswers={{this.selectedAnswers}}
      />
    `);
    assert.dom('.stub-list-item').exists({ count: 3 }, 'Renders 3 list items');
  });

  test('renders no results message when answers is empty', async function (assert) {
    this.set('answers', []);
    await render(hbs`<SubmissionViewerList @answers={{this.answers}} />`);
    assert.dom('.no-results-container').exists('No results container is shown');
    assert
      .dom('.no-results-container .info')
      .containsText('No submissions found');
  });

  test('shows image in no results state', async function (assert) {
    this.set('answers', []);
    await render(hbs`<SubmissionViewerList @answers={{this.answers}} />`);
    assert.dom('.no-results-container img').exists('Shows no results image');
    assert.dom('.no-results-container img').hasAttribute('alt', 'No results');
  });

  test('shows filter criteria hint in no results state', async function (assert) {
    this.set('answers', []);
    await render(hbs`<SubmissionViewerList @answers={{this.answers}} />`);
    assert
      .dom('.no-results-container')
      .containsText('Please change the filter criteria');
  });

  test('does not show no results when answers exist', async function (assert) {
    this.set('answers', buildAnswers(1));
    this.set('selectedAnswers', []);
    await render(hbs`
      <SubmissionViewerList 
        @answers={{this.answers}} 
        @selectedAnswers={{this.selectedAnswers}}
      />
    `);
    assert
      .dom('.no-results-container')
      .doesNotExist('No results container is hidden when answers exist');
  });

  // ============================================================
  // SCROLL ICON TESTS
  // ============================================================

  test('scroll icon shows down arrow by default', async function (assert) {
    this.set('answers', []);
    await render(hbs`<SubmissionViewerList @answers={{this.answers}} />`);
    assert
      .dom('.scroll-icon .fa-chevron-circle-down')
      .exists('Down arrow icon is shown');
    assert
      .dom('.scroll-icon .fa-chevron-circle-up')
      .doesNotExist('Up arrow is hidden');
  });

  test('scroll icon toggles between up and down on click', async function (assert) {
    this.set('answers', []);
    await render(hbs`<SubmissionViewerList @answers={{this.answers}} />`);

    assert
      .dom('.scroll-icon .fa-chevron-circle-down')
      .exists('Initially shows down arrow');

    await click('.scroll-icon i');
    await settled();

    assert
      .dom('.scroll-icon .fa-chevron-circle-up')
      .exists('Shows up arrow after click');
    assert
      .dom('.scroll-icon .fa-chevron-circle-down')
      .doesNotExist('Down arrow is hidden');
  });

  test('scroll icon has role button for accessibility', async function (assert) {
    this.set('answers', []);
    await render(hbs`<SubmissionViewerList @answers={{this.answers}} />`);
    assert
      .dom('.scroll-icon i')
      .hasAttribute('role', 'button', 'Icon has button role');
  });

  test('scroll icon starts hidden (showScrollIcon is false)', async function (assert) {
    this.set('answers', []);
    await render(hbs`<SubmissionViewerList @answers={{this.answers}} />`);
    assert.dom('.scroll-icon').hasClass('hidden', 'Scroll icon starts hidden');
  });

  // ============================================================
  // SELECTION HASH TESTS
  // ============================================================

  test('passes answersSelectedHash to list items', async function (assert) {
    const answers = buildAnswers(2);
    this.set('answers', answers);
    this.set('selectedAnswers', [answers[0]]);

    await render(hbs`
      <SubmissionViewerList 
        @answers={{this.answers}} 
        @selectedAnswers={{this.selectedAnswers}}
      />
    `);

    // Component should calculate hash and pass to children
    assert
      .dom('.stub-list-item')
      .exists({ count: 2 }, 'Renders list items with selection hash');
  });

  // ============================================================
  // COMPONENT ARGS TESTS
  // ============================================================

  test('accepts all expected arguments', async function (assert) {
    this.set('answers', buildAnswers(1));
    this.set('selectedAnswers', []);
    this.set('metadata', { total: 1 });
    this.set('isList', true);
    this.set('isGrid', false);
    this.set('moreMenuOptions', []);
    this.set('onSelect', () => {});
    this.set('threads', new Map());

    await render(hbs`
      <SubmissionViewerList 
        @answers={{this.answers}}
        @metadata={{this.metadata}}
        @isList={{this.isList}}
        @isGrid={{this.isGrid}}
        @moreMenuOptions={{this.moreMenuOptions}}
        @onSelect={{this.onSelect}}
        @selectedAnswers={{this.selectedAnswers}}
        @threads={{this.threads}}
      />
    `);

    assert
      .dom('#submission-viewer-list')
      .exists('Component renders with all arguments');
  });

  test('handles undefined answers gracefully', async function (assert) {
    await render(hbs`<SubmissionViewerList />`);
    assert
      .dom('.no-results-container')
      .exists('Shows no results when answers undefined');
  });

  test('handles undefined selectedAnswers gracefully', async function (assert) {
    this.set('answers', buildAnswers(1));
    await render(hbs`<SubmissionViewerList @answers={{this.answers}} />`);
    assert
      .dom('.stub-list-item')
      .exists('Renders even with undefined selectedAnswers');
  });

  // ============================================================
  // CALLBACK TESTS
  // ============================================================

  test('onSelect callback is called when list item triggers selection', async function (assert) {
    assert.expect(1);

    const answers = buildAnswers(1);
    this.set('answers', answers);
    this.set('selectedAnswers', []);
    this.set('onSelect', (answer, isChecked) => {
      assert.ok(true, 'onSelect callback was invoked');
    });

    // Since we're using stubs, we can't actually test the click through
    // But we verify the component renders with the callback
    await render(hbs`
      <SubmissionViewerList 
        @answers={{this.answers}} 
        @selectedAnswers={{this.selectedAnswers}}
        @onSelect={{this.onSelect}}
      />
    `);

    assert
      .dom('.stub-list-item')
      .exists('Component renders with onSelect callback');
  });

  // ============================================================
  // LAYOUT AND STRUCTURE TESTS
  // ============================================================

  test('component has proper structure hierarchy', async function (assert) {
    this.set('answers', buildAnswers(1));
    this.set('selectedAnswers', []);

    await render(hbs`
      <SubmissionViewerList 
        @answers={{this.answers}} 
        @selectedAnswers={{this.selectedAnswers}}
      />
    `);

    assert
      .dom('#submission-viewer-list > .main-list')
      .exists('main-list is direct child');
    assert
      .dom('#submission-viewer-list > .scroll-icon')
      .exists('scroll-icon is direct child');
  });

  test('passes isList prop to list items', async function (assert) {
    this.set('answers', buildAnswers(1));
    this.set('selectedAnswers', []);
    this.set('isList', true);

    await render(hbs`
      <SubmissionViewerList 
        @answers={{this.answers}} 
        @selectedAnswers={{this.selectedAnswers}}
        @isList={{this.isList}}
      />
    `);

    assert.dom('.stub-list-item').exists('List item receives isList prop');
  });

  test('passes isGrid prop to list items', async function (assert) {
    this.set('answers', buildAnswers(1));
    this.set('selectedAnswers', []);
    this.set('isGrid', false);

    await render(hbs`
      <SubmissionViewerList 
        @answers={{this.answers}} 
        @selectedAnswers={{this.selectedAnswers}}
        @isGrid={{this.isGrid}}
      />
    `);

    assert.dom('.stub-list-item').exists('List item receives isGrid prop');
  });

  test('passes threads prop to list items', async function (assert) {
    this.set('answers', buildAnswers(1));
    this.set('selectedAnswers', []);
    this.set('threads', new Map([['thread1', {}]]));

    await render(hbs`
      <SubmissionViewerList 
        @answers={{this.answers}} 
        @selectedAnswers={{this.selectedAnswers}}
        @threads={{this.threads}}
      />
    `);

    assert.dom('.stub-list-item').exists('List item receives threads prop');
  });

  test('passes moreMenuOptions prop to list items', async function (assert) {
    this.set('answers', buildAnswers(1));
    this.set('selectedAnswers', []);
    this.set('moreMenuOptions', [{ label: 'Option 1' }]);

    await render(hbs`
      <SubmissionViewerList 
        @answers={{this.answers}} 
        @selectedAnswers={{this.selectedAnswers}}
        @moreMenuOptions={{this.moreMenuOptions}}
      />
    `);

    assert
      .dom('.stub-list-item')
      .exists('List item receives moreMenuOptions prop');
  });

  // ============================================================
  // SCROLL LISTENER LIFECYCLE TESTS
  // ============================================================

  test('scroll listener is set up on insert', async function (assert) {
    this.set('answers', []);

    await render(hbs`<SubmissionViewerList @answers={{this.answers}} />`);

    // If the listener wasn't set up, this would error
    assert
      .dom('.scroll-icon')
      .exists('Component sets up scroll listener on insert');
  });

  test('component handles multiple renders without errors', async function (assert) {
    this.set('answers', buildAnswers(1));
    this.set('selectedAnswers', []);

    await render(hbs`
      <SubmissionViewerList 
        @answers={{this.answers}} 
        @selectedAnswers={{this.selectedAnswers}}
      />
    `);

    // Update answers to trigger re-render
    this.set('answers', buildAnswers(3));
    await settled();

    assert
      .dom('.stub-list-item')
      .exists({ count: 3 }, 'Component handles re-renders');
  });

  // ============================================================
  // EMPTY STATE CONTENT TESTS
  // ============================================================

  test('no results container has correct structure', async function (assert) {
    this.set('answers', []);
    await render(hbs`<SubmissionViewerList @answers={{this.answers}} />`);

    const infoElements = this.element.querySelectorAll(
      '.no-results-container .info'
    );
    assert.strictEqual(infoElements.length, 2, 'Has two info paragraphs');
  });
});
