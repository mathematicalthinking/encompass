import { module, test } from 'qunit';
import moment from 'moment';
import { format, parse, subYears, isValid } from 'date-fns';

module('Unit | moment vs date-fns parity (client)', function () {
  test('submission-group revision label format matches moment', function (assert) {
    const date = new Date(2024, 0, 15, 13, 45, 0);
    const momentValue = moment(date).format('l h:mm');
    const datePart = new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    }).format(date);
    const timePart = format(date, 'h:mm');
    const dateFnsValue = `${datePart} ${timePart}`;
    assert.strictEqual(dateFnsValue, momentValue);
  });

  test('submission label date format matches moment', function (assert) {
    const date = new Date(2024, 6, 2, 8, 5, 0);
    const momentValue = moment(date).format('l');
    const dateFnsValue = new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    }).format(date);
    assert.strictEqual(dateFnsValue, momentValue);
  });

  test('workspace reports date format matches moment', function (assert) {
    const date = new Date(2024, 10, 9, 0, 0, 0);
    const momentValue = moment(date).format('MM/DD/YYYY');
    const dateFnsValue = format(date, 'MM/dd/yyyy');
    assert.strictEqual(dateFnsValue, momentValue);
  });

  test('metrics action date format matches moment', function (assert) {
    const date = new Date(2024, 3, 5, 9, 7, 12);
    const momentValue = moment(date).format('MM/DD/YY hh:mm:ss');
    const dateFnsValue = format(date, 'MM/dd/yy hh:mm:ss');
    assert.strictEqual(dateFnsValue, momentValue);
  });

  test('submissions-filter start/end date formatting matches moment', function (assert) {
    const baseDate = new Date(2024, 5, 1, 10, 0, 0);
    const momentStart = moment(baseDate).subtract(1, 'y').format('YYYY-MM-DD');
    const momentEnd = moment(baseDate).format('YYYY-MM-DD');

    const dateFnsStart = format(subYears(baseDate, 1), 'yyyy-MM-dd');
    const dateFnsEnd = format(baseDate, 'yyyy-MM-dd');

    assert.strictEqual(dateFnsStart, momentStart);
    assert.strictEqual(dateFnsEnd, momentEnd);
  });

  test('submissions-filter getMongoDate parsing matches moment', function (assert) {
    const htmlDateString = '2024-06-15';
    const momentValue = moment(htmlDateString, 'YYYY-MM-DD').toDate();
    const dateFnsValue = parse(htmlDateString, 'yyyy-MM-dd', new Date());

    assert.true(isValid(dateFnsValue));
    assert.strictEqual(dateFnsValue.getTime(), momentValue.getTime());
  });

  test('submissions-filter getEndDate matches moment behavior', function (assert) {
    const htmlDateString = '2024-06-15';
    const momentValue = moment(htmlDateString, 'YYYY-MM-DD').toDate();
    momentValue.setHours(23, 59, 59);

    const dateFnsValue = parse(htmlDateString, 'yyyy-MM-dd', new Date());
    assert.true(isValid(dateFnsValue));
    dateFnsValue.setHours(23, 59, 59);

    assert.strictEqual(dateFnsValue.getTime(), momentValue.getTime());
  });

  test('workspace-new-enc isDateRangeValid matches moment comparison', function (assert) {
    const start = '2024-06-01';
    const end = '2024-06-02';

    const momentStart = moment(start, 'YYYY-MM-DD');
    const momentEnd = moment(end, 'YYYY-MM-DD');
    const momentValue = momentEnd > momentStart;

    const dateFnsStart = parse(start, 'yyyy-MM-dd', new Date());
    const dateFnsEnd = parse(end, 'yyyy-MM-dd', new Date());
    const dateFnsValue =
      isValid(dateFnsStart) && isValid(dateFnsEnd)
        ? dateFnsEnd > dateFnsStart
        : false;

    assert.strictEqual(dateFnsValue, momentValue);
  });

  test('workspace-new-enc getMongoDate/getEndDate matches moment behavior', function (assert) {
    const htmlDateString = '2024-06-15';

    const momentMongo = moment(htmlDateString, 'YYYY-MM-DD').toDate();
    const dateFnsMongo = parse(htmlDateString, 'yyyy-MM-dd', new Date());
    assert.true(isValid(dateFnsMongo));
    assert.strictEqual(dateFnsMongo.getTime(), momentMongo.getTime());

    const momentEnd = moment(htmlDateString, 'YYYY-MM-DD').toDate();
    momentEnd.setHours(23, 59, 59);
    const dateFnsEnd = parse(htmlDateString, 'yyyy-MM-dd', new Date());
    dateFnsEnd.setHours(23, 59, 59);
    assert.strictEqual(dateFnsEnd.getTime(), momentEnd.getTime());
  });
});
