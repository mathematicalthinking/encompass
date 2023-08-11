import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | json-csv', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let service = this.owner.lookup('service:json-csv');
    assert.ok(service);
  });

  test('_processValue handles string values correctly', function (assert) {
    let service = this.owner.lookup('service:json-csv');
    let inputValue = 'some,string';
    let expectedOutput = encodeURIComponent(JSON.stringify(inputValue)).replace(
      /,/g,
      ''
    );
    assert.equal(service._processValue(inputValue), expectedOutput);
  });

  test('_processValue handles non-string values correctly', function (assert) {
    let service = this.owner.lookup('service:json-csv');
    let inputValue = 42;
    assert.equal(service._processValue(inputValue), inputValue.toString());
  });

  test('arrayToCsv returns correct message for an empty array', function (assert) {
    let service = this.owner.lookup('service:json-csv');
    let inputValue = [];
    assert.equal(service.arrayToCsv(inputValue), 'No data to display');
  });

  test('arrayToCsv handles valid input correctly', function (assert) {
    let service = this.owner.lookup('service:json-csv');
    let inputValue = [
      { a: 'value1', b: 42 },
      { a: 'value2', b: 24 },
    ];
    let expectedOutput =
      'a,b\n' +
      encodeURIComponent(JSON.stringify('value1')).replace(/,/g, '') +
      ',42\n' +
      encodeURIComponent(JSON.stringify('value2')).replace(/,/g, '') +
      ',24';
    assert.equal(service.arrayToCsv(inputValue), expectedOutput);
  });

  test('arrayToCsv handles long valid input correctly', function (assert) {
    let service = this.owner.lookup('service:json-csv');
    let inputValue = [
      {
        dateOfSubmission: '8/10/2023',
        text: 'Now, is the time, for all good men, to come to the aid! of their &amp; country.',
      },
      {
        dateOfSubmission: '5/10/2023',
        text: 'Four, score, and seven years ago, our fathers brought forth to ...',
      },
    ];
    let expectedOutput =
      'dateOfSubmission,text\n' +
      '%228%2F10%2F2023%22,%22Now%2C%20is%20the%20time%2C%20for%20all%20good%20men%2C%20to%20come%20to%20the%20aid!%20of%20their%20%26amp%3B%20country.%22\n' +
      '%225%2F10%2F2023%22,%22Four%2C%20score%2C%20and%20seven%20years%20ago%2C%20our%20fathers%20brought%20forth%20to%20...%22';
    assert.equal(service.arrayToCsv(inputValue), expectedOutput);
  });

  test('arrayToCsv handles error condition', function (assert) {
    let service = this.owner.lookup('service:json-csv');
    let inputValue = [{ a: 'value1' }, { b: 42 }];
    let expectedOutput =
      "error: Cannot read properties of undefined (reading 'toString')";
    assert.equal(service.arrayToCsv(inputValue), expectedOutput);
  });
});
