import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | guiders-create', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.originalGuiders = window.guiders;
    this.createdOptions = null;
    this.hideAllCalls = 0;
    window.guiders = {
      createGuider: (options) => {
        this.createdOptions = options;
        return { options };
      },
      hideAll: () => {
        this.hideAllCalls += 1;
        return 'hidden';
      },
    };
    this.service = this.owner.lookup('service:guiders-create');
  });

  hooks.afterEach(function () {
    window.guiders = this.originalGuiders;
  });

  test('createGuider delegates with modern defaults', function (assert) {
    const onClose = () => {};
    const result = this.service.createGuider(
      'intro',
      'next-step',
      'Welcome',
      'Description',
      '#target',
      '#highlight',
      'bottom',
      [{ name: 'Next' }],
      true,
      '300px',
      onClose
    );

    assert.strictEqual(result.options, this.createdOptions);
    assert.deepEqual(this.createdOptions, {
      id: 'intro',
      next: 'next-step',
      title: 'Welcome',
      description: 'Description',
      attachTo: '#target',
      highlight: '#highlight',
      position: 'bottom',
      buttons: [{ name: 'Next' }],
      overlay: true,
      width: '300px',
      onClose,
      xButton: true,
      closeOnEscape: true,
      autoFocus: true,
      classString: 'guide-item',
    });
  });

  test('createGuider removes an existing guider with the same id', function (assert) {
    const existingGuider = document.createElement('div');
    existingGuider.id = 'intro';
    document.body.appendChild(existingGuider);

    this.service.createGuider(
      'intro',
      null,
      'Welcome',
      'Description',
      null,
      null,
      null,
      [{ name: 'Next' }],
      true,
      null,
      null
    );

    assert.notOk(document.getElementById('intro'));
  });

  test('hideAll delegates to the guider library', function (assert) {
    assert.strictEqual(this.service.hideAll(), 'hidden');
    assert.strictEqual(this.hideAllCalls, 1);
  });
});
