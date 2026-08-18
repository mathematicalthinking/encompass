import { module, test } from 'qunit';
import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { hbs } from 'ember-cli-htmlbars';

function setImageDimensions(image) {
  for (const [property, value] of Object.entries({
    width: 400,
    height: 300,
    clientWidth: 400,
    clientHeight: 300,
    naturalWidth: 400,
    naturalHeight: 300,
  })) {
    Object.defineProperty(image, property, {
      configurable: true,
      value,
    });
  }
}

function tag(id, overrides = {}) {
  return {
    id,
    parent: 'missing-old-image-id',
    coords: { left: 20, top: 30 },
    size: { width: 100, height: 80 },
    relativeCoords: { tagLeftPct: 0.05, tagTopPct: 0.1 },
    relativeSize: { widthPct: 0.25, heightPct: 0.25 },
    imageSrc: '/student-work.png',
    ...overrides,
  };
}

module('Integration | Vendor | image-tagging', function (hooks) {
  setupRenderingTest(hooks);

  test('keeps public string ids separate from internal array indexes', async function (assert) {
    await render(hbs`
      <div data-test-scroll>
        <div data-test-container>
          <img src='/student-work.png' alt='Student work' />
        </div>
      </div>
    `);

    const container = this.element.querySelector('[data-test-container]');
    const image = container.querySelector('img');
    setImageDimensions(image);

    const tagging = new window.ImageTagging({
      targetContainer: container,
      scrollableContainer: this.element.querySelector('[data-test-scroll]'),
    });
    const mongoId = '507f1f77bcf86cd799439011';
    tagging.loadTags([tag('1'), tag(mongoId), tag(1)]);

    assert.strictEqual(tagging.getTag('1').id, '1');
    assert.strictEqual(tagging.getTag(1).id, 1);
    assert.strictEqual(tagging.getTag(mongoId).id, mongoId);
    assert.strictEqual(tagging.getTag('1abc'), null);

    tagging.showTag('1');
    tagging.showTag(mongoId);
    tagging.showTag(1);
    assert.dom('#img-tag-0').exists();
    assert.dom('#img-tag-1').exists();
    assert.dom('#img-tag-2').exists();

    tagging.removeTag('1');
    assert.dom('#img-tag-0').doesNotExist();
    assert
      .dom('#img-tag-1')
      .exists('removing public id 1 leaves index 1 intact');
    assert
      .dom('#img-tag-2')
      .exists('numeric id 1 remains independently addressable');

    tagging.destroy();
  });

  test('does not coerce string ids to numeric ids', async function (assert) {
    await render(hbs`
      <div data-test-scroll>
        <div data-test-container>
          <img src='/student-work.png' alt='Student work' />
        </div>
      </div>
    `);

    const container = this.element.querySelector('[data-test-container]');
    setImageDimensions(container.querySelector('img'));

    const tagging = new window.ImageTagging({
      targetContainer: container,
      scrollableContainer: this.element.querySelector('[data-test-scroll]'),
    });
    tagging.loadTags([tag('1')]);

    assert.strictEqual(tagging.getTag(1), null);
    assert.strictEqual(tagging.getTag('1').id, '1');

    tagging.destroy();
  });

  test('recovers old saved tags by imageSrc and restores image state on destroy', async function (assert) {
    await render(hbs`
      <div data-test-scroll>
        <div data-test-container>
          <img src='/student-work.png' alt='Student work' />
        </div>
      </div>
    `);

    const container = this.element.querySelector('[data-test-container]');
    const image = container.querySelector('img');
    setImageDimensions(image);

    const tagging = new window.ImageTagging({
      targetContainer: container,
      scrollableContainer: this.element.querySelector('[data-test-scroll]'),
    });
    const savedTag = tag('507f1f77bcf86cd799439011');
    tagging.loadTags([savedTag]);
    tagging.showAllTags();

    assert.dom('#img-tag-0').exists();
    assert.strictEqual(savedTag.parent, image.id);

    image.dispatchEvent(
      new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
        clientX: 10,
        clientY: 10,
      })
    );
    assert.dom('#sel-box').exists();

    tagging.destroy();

    assert.dom('#img-tag-0').doesNotExist();
    assert.dom('#sel-box').doesNotExist();
    assert.notOk(image.hasAttribute('id'), 'generated image id is removed');
    assert.notOk(
      image.hasAttribute('draggable'),
      'original draggable state is restored'
    );
    assert.strictEqual(image.style.border, '', 'original border is restored');

    image.dispatchEvent(
      new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
        clientX: 10,
        clientY: 10,
      })
    );
    assert
      .dom('#sel-box')
      .doesNotExist('destroy removes image event listeners');
  });
});
