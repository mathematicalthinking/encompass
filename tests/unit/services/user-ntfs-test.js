import Service from '@ember/service';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

class StoreStub extends Service {
  responses = [];

  peekAll(modelName) {
    return modelName === 'response' ? this.responses : [];
  }
}

class UtilityMethodsStub extends Service {
  getBelongsToId(record, relationshipName) {
    return record?.relationshipIds?.[relationshipName];
  }
}

function notification(properties = {}) {
  return {
    isTrashed: false,
    wasSeen: false,
    saveCalls: 0,
    save() {
      this.saveCalls += 1;
      return Promise.resolve(this);
    },
    ...properties,
  };
}

module('Unit | Service | user-ntfs', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:store', StoreStub);
    this.owner.register('service:utility-methods', UtilityMethodsStub);
    this.service = this.owner.lookup('service:user-ntfs');
    this.store = this.owner.lookup('service:store');
  });

  test('setupProperties loads responses and notifications', async function (assert) {
    const responses = [{ id: 'response-1' }];
    const notifications = [notification()];
    const user = {
      notifications: Promise.resolve(notifications),
    };
    this.store.responses = responses;

    await this.service.setupProperties(user);

    assert.strictEqual(this.service.user, user);
    assert.strictEqual(this.service.responses, responses);
    assert.strictEqual(this.service.notifications, notifications);
    assert.true(this.service.areNtfsLoaded);
  });

  test('notification getters filter active response notifications', function (assert) {
    const mentorReply = notification({
      id: 'notification-1',
      notificationType: 'newMentorReply',
      primaryRecordType: 'response',
    });
    const unrelated = notification({
      id: 'notification-2',
      notificationType: 'workspaceUpdated',
      primaryRecordType: 'workspace',
    });
    const seenReply = notification({
      id: 'notification-3',
      notificationType: 'newApproverReply',
      primaryRecordType: 'response',
      wasSeen: true,
    });
    this.service.notifications = [mentorReply, unrelated, seenReply];

    assert.deepEqual(this.service.responseNotifications, [
      mentorReply,
      seenReply,
    ]);
    assert.deepEqual(this.service.newNotifications, [mentorReply, unrelated]);
    assert.deepEqual(this.service.newReplyNotifications, [
      mentorReply,
      seenReply,
    ]);
  });

  test('trashedResponses clears related notifications', function (assert) {
    const response = {
      id: 'response-1',
      isTrashed: true,
    };
    const relatedNotification = notification({
      primaryRecordType: 'response',
      relationshipIds: {
        response: 'response-1',
      },
    });
    this.service.responses = [response];
    this.service.notifications = [relatedNotification];

    assert.deepEqual(this.service.trashedResponses, [response]);
    assert.true(relatedNotification.isTrashed);
    assert.true(relatedNotification.wasSeen);
    assert.strictEqual(relatedNotification.saveCalls, 1);
  });

  test('findRelatedNtfs matches relationship and notification type', function (assert) {
    const response = { id: 'response-1' };
    const matchingNotification = notification({
      notificationType: 'mentorReplyRequiresApproval',
      primaryRecordType: 'response',
      relationshipIds: {
        response: 'response-1',
      },
    });
    this.service.notifications = [
      matchingNotification,
      notification({
        notificationType: 'newMentorReply',
        primaryRecordType: 'response',
        relationshipIds: {
          response: 'response-2',
        },
      }),
    ];

    assert.deepEqual(
      this.service.findRelatedNtfs(
        'response',
        response,
        'mentorReplyRequiresApproval'
      ),
      [matchingNotification]
    );
  });
});
