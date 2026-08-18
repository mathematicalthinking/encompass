import { module, test } from 'qunit';
import { clearRender, render, settled } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | selectable-area', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.originalImageTagging = window.ImageTagging;
    this.originalSelectionHighlighting = window.SelectionHighlighting;
    this.imageTaggingInstances = [];
    this.selectionHighlightingInstances = [];

    const imageTaggingInstances = this.imageTaggingInstances;
    window.ImageTagging = class {
      constructor(args) {
        this.args = args;
        imageTaggingInstances.push(this);
      }

      onSave(callback) {
        this.saveCallback = callback;
      }

      getTag() {
        return null;
      }

      loadTags(tags) {
        this.tags = tags;
      }

      enable() {
        this.enabled = true;
      }

      disable() {
        this.enabled = false;
      }

      showAllTags() {
        this.showing = true;
      }

      removeAllTags() {
        this.showing = false;
      }

      destroy() {
        this.destroyed = true;
      }
    };

    const selectionHighlightingInstances = this.selectionHighlightingInstances;
    window.SelectionHighlighting = class {
      constructor(args) {
        this.args = args;
        selectionHighlightingInstances.push(this);
      }

      init(callback) {
        this.createCallback = callback;
      }

      getSelection() {
        return null;
      }

      loadSelections(selections) {
        this.selections = selections;
      }

      enableSelection() {
        this.enabled = true;
      }

      disableSelection() {
        this.enabled = false;
      }

      highlightAllSelections() {
        this.showing = true;
      }

      removeAllHighlights() {
        this.showing = false;
      }

      destroy() {
        this.destroyed = true;
      }
    };

    this.model = { id: 'submission-1' };
    this.sels = [];
    this.showImage = false;
    this.addSelection = () => {};
    this.handleTransition = () => {};
    this.setupResizeHandler = () => {};
    this.removeResizeHandler = () => {};
  });

  hooks.afterEach(function () {
    window.ImageTagging = this.originalImageTagging;
    window.SelectionHighlighting = this.originalSelectionHighlighting;
  });

  test('initializes against the rendered container', async function (assert) {
    this.showImage = true;

    await render(hbs`
      <div data-selection-scroll-container>
        <SelectableArea
          @model={{this.model}}
          @makingSelection={{true}}
          @showingSelections={{false}}
          @addSelection={{this.addSelection}}
          @handleTransition={{this.handleTransition}}
          @sels={{this.sels}}
          @setupResizeHandler={{this.setupResizeHandler}}
          @removeResizeHandler={{this.removeResizeHandler}}
        >
          <div data-selection-container>
            {{#if this.showImage}}
              <img src='/student-work.png' alt='Student work' />
            {{/if}}
          </div>
        </SelectableArea>
      </div>
    `);

    assert.strictEqual(this.imageTaggingInstances.length, 1);
    assert.strictEqual(this.selectionHighlightingInstances.length, 1);
    assert.strictEqual(
      this.imageTaggingInstances[0].args.targetContainer,
      this.element.querySelector('[data-selection-container]')
    );
  });

  test('registers images that appear after the initial render', async function (assert) {
    await render(hbs`
      <div data-selection-scroll-container>
        <SelectableArea
          @model={{this.model}}
          @makingSelection={{true}}
          @showingSelections={{false}}
          @addSelection={{this.addSelection}}
          @handleTransition={{this.handleTransition}}
          @sels={{this.sels}}
          @setupResizeHandler={{this.setupResizeHandler}}
          @removeResizeHandler={{this.removeResizeHandler}}
        >
          <div data-selection-container>
            {{#if this.showImage}}
              <img src='/student-work.png' alt='Student work' />
            {{/if}}
          </div>
        </SelectableArea>
      </div>
    `);

    assert.strictEqual(this.imageTaggingInstances.length, 1);

    this.set('showImage', true);
    await settled();

    assert.strictEqual(
      this.imageTaggingInstances.length,
      2,
      'the mutation observer rebuilds image tagging for the new image'
    );
    assert.true(this.imageTaggingInstances[0].destroyed);
    assert.true(this.imageTaggingInstances[1].enabled);
  });

  test('destroys observers and selection tools on removal', async function (assert) {
    await render(hbs`
      <div data-selection-scroll-container>
        <SelectableArea
          @model={{this.model}}
          @makingSelection={{true}}
          @showingSelections={{false}}
          @addSelection={{this.addSelection}}
          @handleTransition={{this.handleTransition}}
          @sels={{this.sels}}
          @setupResizeHandler={{this.setupResizeHandler}}
          @removeResizeHandler={{this.removeResizeHandler}}
        >
          <div data-selection-container>Submission</div>
        </SelectableArea>
      </div>
    `);

    const imageTagging = this.imageTaggingInstances[0];
    const selectionHighlighting = this.selectionHighlightingInstances[0];
    await clearRender();

    assert.true(imageTagging.destroyed);
    assert.true(selectionHighlighting.destroyed);
  });
});
