const _ = require('underscore');

const chai = require('chai');
const expect = chai.expect;

const fixtures = require('../fixtures/resize_explanation');

const { parseImageData } = require('../../../server/db_migration/resizeLargeImages');

function convertAndCompare(input, expectedResult) {

  let results = parseImageData(input);
  it('results should be an array', function() {
    expect(results).to.be.an.instanceOf(Array);
  });

  it('should match original string when joined with "" ', function() {
    expect(results.join('')).to.eql(expectedResult);
  });
}

_.each(fixtures, (val, key) => {
  let expectedResult = val.expectedResult || val.input;
  describe(val.description, function() {
    convertAndCompare(val.input, expectedResult);
  });

});