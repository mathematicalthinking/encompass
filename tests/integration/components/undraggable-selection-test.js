import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';

class UtilityMethodsStub extends Service {
  getTimeStringFromMs(ms) {
    return String(ms ?? '');
  }
}

class CurrentSelectionStub extends Service {
  isCurrentSelection() {
    return false;
  }
}

module('Integration | Component | undraggable-selection', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:utility-methods', UtilityMethodsStub);
    this.owner.register('service:current-selection', CurrentSelectionStub);
    this.owner.register('service:currentSelection', CurrentSelectionStub);
  });

  test('renders image from imageSrc fallback when imageTagLink is missing', async function (assert) {
    const fallbackSrc = 'https://example.com/fallback-image.png';

    this.set('selection', {
      id: 'sel-1',
      text: 'selection image',
      createDate: Date.now(),
      imageTagLink: '',
      imageSrc: fallbackSrc,
      createdBy: { id: 'u1', username: 'owner' },
      workspace: {
        id: 'ws-1',
        workspaceType: 'individual',
        get(key) {
          return this[key];
        },
      },
      submission: { id: 'sub-1' },
    });

    await render(hbs`<UndraggableSelection @selection={{this.selection}} />`);

    assert.dom('.img-tag-thmb').hasAttribute('src', fallbackSrc);

    await click('.overlay button');
    assert.dom('.full-image img').hasAttribute('src', fallbackSrc);
  });
});
