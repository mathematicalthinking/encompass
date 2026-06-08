import EmberObject from '@ember/object';
import Service from '@ember/service';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

class AlertStub extends Service {
  calls = [];

  showToast(...args) {
    this.calls.push(args);
  }
}

class StoreStub extends Service {
  payloads = [];
  responseThreads = [];

  pushPayload(payload) {
    this.payloads.push(payload);
  }

  peekAll(modelName) {
    if (modelName === 'response-thread') {
      return {
        toArray: () => this.responseThreads,
      };
    }

    return [];
  }
}

class UtilityMethodsStub extends Service {
  isNonEmptyObject(value) {
    return Boolean(value) && typeof value === 'object';
  }

  isNonEmptyString(value) {
    return typeof value === 'string' && value.length > 0;
  }

  isValidMongoId(value) {
    return /^[0-9a-f]{24}$/i.test(value);
  }

  getBelongsToId(record, relationshipName) {
    return record?.relationshipIds?.[relationshipName];
  }

  getHasManyIds(record, relationshipName) {
    return record?.relationshipIds?.[relationshipName] || [];
  }
}

class SocketStub {
  handlers = {};

  on(eventName, handler) {
    this.handlers[eventName] = handler;
  }
}

module('Unit | Service | socket-io', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:sweet-alert', AlertStub);
    this.owner.register('service:store', StoreStub);
    this.owner.register('service:utility-methods', UtilityMethodsStub);

    this.service = this.owner.lookup('service:socket-io');
    this.alert = this.owner.lookup('service:sweet-alert');
    this.store = this.owner.lookup('service:store');
    this.socket = new SocketStub();
    this.service.socket = this.socket;
  });

  test('setupListeners registers all socket events', function (assert) {
    this.service.setupListeners();

    assert.deepEqual(Object.keys(this.socket.handlers).sort(), [
      'CLEAR_NOTIFICATION',
      'CLEAR_RECORD',
      'NEW_NOTIFICATION',
      'UPDATED_RECORD',
    ]);
  });

  test('UPDATED_RECORD pushes the received payload', function (assert) {
    this.service.setupListeners();

    this.socket.handlers.UPDATED_RECORD({
      recordType: 'responses',
      updatedRecord: { _id: 'response-1' },
    });

    assert.deepEqual(this.store.payloads, [
      {
        responses: { _id: 'response-1' },
      },
    ]);
  });

  test('triggerToast uses notification text or a fallback', function (assert) {
    this.service.triggerToast({
      notificationType: 'newMentorReply',
    });

    assert.deepEqual(this.alert.calls[0], [
      'info',
      'You have received a newMentorReply notification.',
      'top-end',
      3000,
      false,
      null,
    ]);
  });

  test('findExistingResponseThread matches type and id', function (assert) {
    const expectedThread = EmberObject.create({
      id: 'thread-1',
      threadType: 'mentor',
    });
    this.store.responseThreads = [
      EmberObject.create({
        id: 'thread-2',
        threadType: 'submitter',
      }),
      expectedThread,
    ];

    assert.strictEqual(
      this.service.findExistingResponseThread('mentor', 'thread-1'),
      expectedThread
    );
  });
});
