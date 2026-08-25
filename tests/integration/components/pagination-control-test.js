import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | pagination-control', function (hooks) {
  setupRenderingTest(hooks);

  test('shows the page status and controls when there is more than one page', async function (assert) {
    this.set('details', { currentPage: 2, pageCount: 5 });
    this.set('onChange', () => {});

    await render(
      hbs`<PaginationControl @details={{this.details}} @initiatePageChange={{this.onChange}} />`
    );

    assert.dom('.page-status').includesText('2');
    assert.dom('.page-status').includesText('5');
    assert.dom('.fa-caret-left').exists();
    assert.dom('.fa-caret-right').exists();
  });

  test('hides the controls when there is only one page', async function (assert) {
    this.set('details', { currentPage: 1, pageCount: 1 });

    await render(hbs`<PaginationControl @details={{this.details}} />`);

    assert.dom('.nav-arrows').doesNotExist();
  });

  test('forward and backward request the next and previous page (wrapping at the ends)', async function (assert) {
    const pages = [];
    this.set('details', { currentPage: 2, pageCount: 5 });
    this.set('onChange', (p) => pages.push(p));

    await render(
      hbs`<PaginationControl @details={{this.details}} @initiatePageChange={{this.onChange}} />`
    );

    await click('.fa-caret-right');
    await click('.fa-caret-left');

    assert.deepEqual(pages, [3, 1], 'forward → page 3, backward → page 1');
  });
});
