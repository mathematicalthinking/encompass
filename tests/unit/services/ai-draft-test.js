import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

const relationship = (id = null, value = null) => ({
  id: () => id,
  value: () => value,
});

module('Unit | Service | ai-draft', function (hooks) {
  setupTest(hooks);

  test('recognizes an uploaded worksheet as student work', function (assert) {
    const service = this.owner.lookup('service:ai-draft');
    const submission = {
      uploadedFile: { savedFileName: 'worksheet.png' },
      belongsTo: () => relationship(),
    };

    assert.true(service.hasStudentWork(submission));
  });

  test('recognizes an explanation image on the loaded answer', function (assert) {
    const service = this.owner.lookup('service:ai-draft');
    const answer = {
      belongsTo(name) {
        return relationship(name === 'explanationImage' ? 'image-1' : null);
      },
    };
    const submission = {
      belongsTo: () => relationship('answer-1', answer),
    };

    assert.true(service.hasStudentWork(submission));
  });

  test('recognizes an additional image from the store', function (assert) {
    const service = this.owner.lookup('service:ai-draft');
    const answer = {
      belongsTo(name) {
        return relationship(name === 'additionalImage' ? 'image-2' : null);
      },
    };
    service.store.peekRecord = (type, id) =>
      type === 'answer' && id === 'answer-2' ? answer : null;
    const submission = {
      belongsTo: () => relationship('answer-2'),
    };

    assert.true(service.hasStudentWork(submission));
  });

  test('rejects a submission without text or images', function (assert) {
    const service = this.owner.lookup('service:ai-draft');
    const submission = {
      shortAnswer: '',
      longAnswer: '',
      belongsTo: () => relationship(),
    };

    assert.false(service.hasStudentWork(submission));
  });
});
