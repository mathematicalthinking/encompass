import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Component from '@glimmer/component';

// The child VmtRoomList is still a classic component with its own
// dependencies; stub it so this stays a focused unit of vmt-activity-list-item.
class VmtRoomListStub extends Component {
  get firstRoom() {
    return this.args.rooms ? this.args.rooms[0] : null;
  }
}

module('Integration | Component | vmt-activity-list-item', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('component:vmt-room-list', VmtRoomListStub);
    this.owner.register(
      'template:components/vmt-room-list',
      hbs`
        <div class='vmt-room-list-stub'>
          <button
            type='button'
            class='stub-room-select'
            {{on 'click' (fn @onItemSelect this.firstRoom)}}
          >
            select room
          </button>
        </div>
      `
    );
  });

  async function renderComponent(context, overrides = {}) {
    context.setProperties({
      activity: {
        _id: 'activity-1',
        name: 'Pattern Talk',
        image: 'https://example.com/img with space.png',
        rooms: [{ _id: 'room-1', name: 'Room A' }],
      },
      showCheckbox: true,
      selectedActivityIds: [],
      selectedRoomIds: [],
      selectedActivities: [],
      selectedRooms: [],
      onSelect: (activity) => {
        context.selectedActivities = [...context.selectedActivities, activity];
      },
      onRoomSelect: (room) => {
        context.selectedRooms = [...context.selectedRooms, room];
      },
      ...overrides,
    });

    await render(hbs`
      <VmtActivityListItem
        @activity={{this.activity}}
        @showCheckbox={{this.showCheckbox}}
        @selectedActivityIds={{this.selectedActivityIds}}
        @selectedRoomIds={{this.selectedRoomIds}}
        @onSelect={{this.onSelect}}
        @onRoomSelect={{this.onRoomSelect}}
      />
    `);
  }

  test('it renders the activity inside the .vmt-activity-list-item wrapper', async function (assert) {
    await renderComponent(this);

    assert
      .dom('.vmt-activity-list-item')
      .exists(
        'preserves the wrapper element the SCSS + selenium selector rely on'
      );
    assert.dom('.vmt-activity-list-item .card-heading').hasText('Pattern Talk');
  });

  test('it shows the checkbox only when showCheckbox is true', async function (assert) {
    await renderComponent(this, { showCheckbox: false });
    assert.dom('input[name="selectedActivities"]').doesNotExist();

    await renderComponent(this, { showCheckbox: true });
    assert.dom('input[name="selectedActivities"]').exists();
  });

  test('the checkbox reflects whether the activity is already selected', async function (assert) {
    await renderComponent(this, { selectedActivityIds: ['activity-1'] });
    assert.dom('input[name="selectedActivities"]').isChecked();

    await renderComponent(this, { selectedActivityIds: ['other-activity'] });
    assert.dom('input[name="selectedActivities"]').isNotChecked();
  });

  test('clicking the checkbox calls onSelect with the activity', async function (assert) {
    await renderComponent(this);

    await click('input[name="selectedActivities"]');

    assert.strictEqual(
      this.selectedActivities.length,
      1,
      'onSelect fired once'
    );
    assert.strictEqual(
      this.selectedActivities[0],
      this.activity,
      'onSelect receives the activity object'
    );
  });

  test('toggling rooms reveals the room list and flips the icon', async function (assert) {
    await renderComponent(this);

    assert.dom('i.fa-plus-square').hasAttribute('title', 'Show rooms');
    assert.dom('.vmt-room-list-stub').doesNotExist();

    await click('i.fa-plus-square');

    assert
      .dom('.vmt-room-list-stub')
      .exists('child room list renders when expanded');
    assert.dom('i.fa-minus-square').hasAttribute('title', 'Hide rooms');

    await click('i.fa-minus-square');

    assert.dom('.vmt-room-list-stub').doesNotExist('toggles back off');
    assert.dom('i.fa-plus-square').exists();
  });

  test('selecting a room bubbles up through onRoomSelect', async function (assert) {
    await renderComponent(this);
    await click('i.fa-plus-square');

    await click('.stub-room-select');

    assert.strictEqual(this.selectedRooms.length, 1, 'onRoomSelect fired once');
    assert.strictEqual(
      this.selectedRooms[0],
      this.activity.rooms[0],
      'onRoomSelect receives the room'
    );
  });

  test('expanding the image shows and hides the full-size view', async function (assert) {
    await renderComponent(this);

    assert.dom('.full-image').doesNotExist();

    await click('.overlay button');
    assert.dom('.full-image').exists();
    assert
      .dom('.full-image img')
      .hasAttribute(
        'src',
        'https://example.com/img with space.png',
        'full image uses the raw (unencoded) image url'
      );

    await click('.full-image .fa-times');
    assert.dom('.full-image').doesNotExist('closing hides it again');
  });

  test('the card background uses the encoded image uri', async function (assert) {
    await renderComponent(this);

    assert
      .dom('.card-image')
      .hasAttribute(
        'style',
        /img%20with%20space\.png/,
        'background url() is percent-encoded'
      );
  });
});
