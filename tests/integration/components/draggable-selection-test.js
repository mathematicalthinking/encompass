import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';

module('Integration | Component | draggable-selection', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    class UtilityMethodsService extends Service {
      getBelongsToId(record, key) {
        if (!record || !key) {
          return null;
        }

        const value = record[key];
        if (!value) {
          return null;
        }

        if (typeof value === 'object') {
          return value.id ?? null;
        }

        return value;
      }

      getTimeStringFromMs(ms) {
        return String(ms ?? '');
      }
    }

    class CurrentUserService extends Service {
      id = 'u1';
      isAdmin = false;
      isStudent = false;
    }

    class CurrentSelectionService extends Service {
      isCurrentSelection() {
        return false;
      }
    }

    class AlertService extends Service {
      modalCalls = [];
      toastCalls = [];
      modalResult = { value: true };

      showModal(...args) {
        this.modalCalls.push(args);
        return Promise.resolve(this.modalResult);
      }

      showToast(...args) {
        this.toastCalls.push(args);
      }
    }

    this.owner.register('service:utility-methods', UtilityMethodsService);
    this.owner.register('service:currentUser', CurrentUserService);
    this.owner.register('service:currentSelection', CurrentSelectionService);
    this.owner.register('service:sweet-alert', AlertService);
  });

  function createSelection(overrides = {}) {
    return {
      id: 'sel-1',
      text: 'x + 1',
      createDate: Date.now(),
      imageTagLink: '',
      createdBy: { id: 'u1', username: 'owner-user' },
      ...overrides,
    };
  }

  async function renderSelection(context, props = {}) {
    context.setProperties({
      selection: props.selection || createSelection(),
      canDeleteSelections:
        props.canDeleteSelections === undefined
          ? true
          : props.canDeleteSelections,
      onDelete: props.onDelete || (() => {}),
    });

    await render(hbs`<DraggableSelection
      @selection={{this.selection}}
      @canDeleteSelections={{this.canDeleteSelections}}
      @deleteSelection={{this.onDelete}}
    />`);
  }

  function registerCurrentUser(owner, overrides = {}) {
    owner.unregister('service:currentUser');
    owner.register(
      'service:currentUser',
      class extends Service {
        id = 'u1';
        isAdmin = false;
        isStudent = false;

        constructor() {
          super(...arguments);
          Object.assign(this, overrides);
        }
      }
    );
  }

  test('shows delete icon for owner even when canDeleteSelections is false', async function (assert) {
    await renderSelection(this, {
      selection: createSelection({
        createdBy: { id: 'u1', username: 'owner' },
      }),
      canDeleteSelections: false,
    });

    assert.dom('.fa-minus-circle').exists();
  });

  test('hides delete icon for non-admin user on another user selection', async function (assert) {
    await renderSelection(this, {
      selection: createSelection({
        createdBy: { id: 'u2', username: 'other' },
      }),
      canDeleteSelections: true,
    });

    assert.dom('.fa-minus-circle').doesNotExist();
  });

  test('shows delete icon for admin on another user selection when permission allows', async function (assert) {
    registerCurrentUser(this.owner, {
      id: 'u1',
      isAdmin: true,
      isStudent: false,
    });

    await renderSelection(this, {
      selection: createSelection({
        createdBy: { id: 'u2', username: 'other' },
      }),
      canDeleteSelections: true,
    });

    assert.dom('.fa-minus-circle').exists();
  });

  test('hides delete icon for admin on another user selection when canDeleteSelections is false', async function (assert) {
    registerCurrentUser(this.owner, {
      id: 'u1',
      isAdmin: true,
      isStudent: false,
    });

    await renderSelection(this, {
      selection: createSelection({
        createdBy: { id: 'u2', username: 'other' },
      }),
      canDeleteSelections: false,
    });

    assert.dom('.fa-minus-circle').doesNotExist();
  });

  test('hides delete icon when admin is acting as student on another user selection', async function (assert) {
    registerCurrentUser(this.owner, {
      id: 'u1',
      isAdmin: true,
      isStudent: true,
    });

    await renderSelection(this, {
      selection: createSelection({
        createdBy: { id: 'u2', username: 'other' },
      }),
      canDeleteSelections: true,
    });

    assert.dom('.fa-minus-circle').doesNotExist();
  });

  test('uses admin warning modal copy for admin cross-user delete', async function (assert) {
    registerCurrentUser(this.owner, {
      id: 'u1',
      isAdmin: true,
      isStudent: false,
    });

    let deletedSelection = null;
    await renderSelection(this, {
      selection: createSelection({
        createdBy: { id: 'u2', username: 'other' },
      }),
      canDeleteSelections: true,
      onDelete: (selection) => {
        deletedSelection = selection;
      },
    });

    const alert = this.owner.lookup('service:sweet-alert');
    alert.modalResult = { value: false };

    await click('.fa-minus-circle');

    assert.strictEqual(alert.modalCalls.length, 1);
    assert.strictEqual(
      alert.modalCalls[0][1],
      'This selection belongs to another user. Delete it anyway?'
    );
    assert.strictEqual(
      alert.modalCalls[0][3],
      'Yes, delete another user selection'
    );
    assert.strictEqual(deletedSelection, null);
  });

  test('uses standard modal copy for owner delete and calls callback on confirm', async function (assert) {
    let deletedSelection = null;
    const selection = createSelection({
      createdBy: { id: 'u1', username: 'owner' },
    });

    await renderSelection(this, {
      selection,
      canDeleteSelections: false,
      onDelete: (selected) => {
        deletedSelection = selected;
      },
    });

    const alert = this.owner.lookup('service:sweet-alert');
    alert.modalResult = { value: true };

    await click('.fa-minus-circle');

    assert.strictEqual(alert.modalCalls.length, 1);
    assert.strictEqual(
      alert.modalCalls[0][1],
      'Are you sure you want to delete this selection?'
    );
    assert.strictEqual(alert.modalCalls[0][3], 'Yes, delete it');
    assert.strictEqual(deletedSelection, selection);
  });

  test('renders image from imageSrc fallback when imageTagLink is missing', async function (assert) {
    const fallbackSrc = 'https://example.com/fallback-image.png';

    await renderSelection(this, {
      selection: createSelection({
        text: 'image selection',
        imageTagLink: '',
        imageSrc: fallbackSrc,
        workspace: { id: 'ws-1' },
        submission: { id: 'sub-1' },
      }),
      canDeleteSelections: true,
    });

    assert.dom('.img-tag-thmb').hasAttribute('src', fallbackSrc);

    await click('.overlay button');
    assert.dom('.full-image img').hasAttribute('src', fallbackSrc);
  });
});
