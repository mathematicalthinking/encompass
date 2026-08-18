import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

function notification(properties = {}) {
  return {
    isTrashed: false,
    wasSeen: false,
    ...properties,
  };
}

module('Unit | Service | user-ntfs', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.service = this.owner.lookup('service:user-ntfs');
  });

  test('setupProperties loads notifications', async function (assert) {
    const notifications = [notification()];
    const user = {
      notifications: Promise.resolve(notifications),
    };

    await this.service.setupProperties(user);

    assert.strictEqual(this.service.notifications, notifications);
    assert.true(this.service.areNtfsLoaded);
  });

  test('newNotifications filters seen and trashed notifications', function (assert) {
    const activeNotification = notification({
      id: 'notification-1',
    });
    const trashedNotification = notification({
      id: 'notification-2',
      isTrashed: true,
    });
    const seenNotification = notification({
      id: 'notification-3',
      wasSeen: true,
    });
    this.service.notifications = [
      activeNotification,
      trashedNotification,
      seenNotification,
    ];

    assert.deepEqual(this.service.newNotifications, [activeNotification]);
  });
});
