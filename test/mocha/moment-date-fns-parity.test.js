const { expect } = require('chai');
const moment = require('moment');
const {
  endOfDay,
  format,
  formatDistanceToNow,
  isValid,
  parse,
  startOfDay,
} = require('date-fns');

// npx mocha test/mocha/moment-date-fns-parity.test.js

describe('moment vs date-fns parity (server)', function () {
  it('commentApi sinceDate startOfDay matches moment', function () {
    const sinceDate = '02/06/2026';
    const momentValue = moment(sinceDate, 'L').startOf('day').toDate();

    const parsedDate = parse(sinceDate, 'P', new Date());
    expect(isValid(parsedDate)).to.equal(true);
    const dateFnsValue = startOfDay(parsedDate);

    expect(dateFnsValue.getTime()).to.equal(momentValue.getTime());
  });

  it('answerApi start/end of day matches moment', function () {
    const startDate = '2026-02-05T10:20:30.000Z';
    const endDate = '2026-02-07T11:22:33.000Z';

    const momentStart = moment(startDate).startOf('day').toDate();
    const momentEnd = moment(endDate).endOf('day').toDate();

    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    expect(isValid(startDateObj)).to.equal(true);
    expect(isValid(endDateObj)).to.equal(true);

    const dateFnsStart = startOfDay(startDateObj);
    const dateFnsEnd = endOfDay(endDateObj);

    expect(dateFnsStart.getTime()).to.equal(momentStart.getTime());
    expect(dateFnsEnd.getTime()).to.equal(momentEnd.getTime());
  });

  it('assignmentApi formatted date matches moment', function () {
    const assignedDate = new Date(2026, 1, 6, 9, 30, 0);
    const momentValue = moment(assignedDate).format('MMM Do YYYY');
    const dateFnsValue = format(assignedDate, 'MMM do yyyy');

    expect(dateFnsValue).to.equal(momentValue);
  });

  it('relative time output matches for multi-day differences', function () {
    const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
    const momentValue = moment(fiveDaysAgo).fromNow();
    const dateFnsValue = formatDistanceToNow(fiveDaysAgo, { addSuffix: true });

    expect(dateFnsValue).to.equal(momentValue);
  });
});
