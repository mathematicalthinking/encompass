import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

const IMG = 'data:image/png;base64,AAAA';

module('Integration | Component | answer-info', function (hooks) {
  setupRenderingTest(hooks);

  async function renderComponent(context, overrides = {}) {
    context.setProperties({
      answer: {
        answer: 'The brief answer',
        explanation: '<strong>because</strong> reasons',
        students: [{ username: 'alice' }],
        studentNames: ['Bob Roberts'],
      },
      showHideButton: false,
      onHide: () => {},
      ...overrides,
    });

    await render(hbs`
      <AnswerInfo
        @answer={{this.answer}}
        @showHideButton={{this.showHideButton}}
        @onHide={{this.onHide}}
      />
    `);
  }

  test('renders brief summary, explanation html, and contributors', async function (assert) {
    await renderComponent(this);

    assert.dom('#answer-info').exists();
    assert.dom('.brief-summary p').hasText('The brief answer');
    assert.dom('.explanation .explanation-body strong').hasText('because');
    assert.dom('.students li').exists({ count: 2 });
    assert.dom('.students').containsText('alice');
    assert.dom('.students').containsText('Bob Roberts');
  });

  test('keeps the brief summary even when it is the "See Image" placeholder', async function (assert) {
    await renderComponent(this, {
      answer: { ...this.answer, answer: 'See Image', explanation: `<img src="${IMG}">` },
    });

    assert.dom('.brief-summary p').hasText('See Image');
    assert.dom('.explanation .explanation-body img').exists('image stays in the explanation');
  });

  test('clicking the embedded explanation image opens the lightbox; clicking it closes', async function (assert) {
    await renderComponent(this, {
      answer: { ...this.answer, explanation: `<img src="${IMG}">` },
    });

    assert.dom('.image-overlay').doesNotExist();

    await click('.explanation-body img');
    assert.dom('.image-overlay').exists('lightbox opens on image click');
    assert.dom('.image-overlay img').hasAttribute('src', IMG);

    await click('.image-overlay');
    assert.dom('.image-overlay').doesNotExist('lightbox closes on click');
  });

  test('empty brief summary / explanation are omitted', async function (assert) {
    await renderComponent(this, {
      answer: { ...this.answer, answer: '', explanation: '' },
    });

    assert.dom('.brief-summary').doesNotExist();
    assert.dom('.explanation').doesNotExist();
  });

  test('the hide button only shows with @showHideButton and calls @onHide', async function (assert) {
    let hideCalls = 0;

    await renderComponent(this, { showHideButton: false });
    assert.dom('.hide-answer-btn').doesNotExist();

    await renderComponent(this, {
      showHideButton: true,
      onHide: () => {
        hideCalls += 1;
      },
    });
    assert.dom('.hide-answer-btn').exists();

    await click('.hide-answer-btn');
    assert.strictEqual(hideCalls, 1, 'onHide fired once');
  });
});
