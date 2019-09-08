const chai = require('chai');
const mongoose = require('mongoose');

const expect = chai.expect;

const helpers = require('../../../server/utils/mongoose');

let { isValidMongoId, areObjectIdsEqual, didObjectIdArrayFieldChange } = helpers;

describe('isValidMongoId', function() {
  it('should return false if passed no arguments', function() {
    expect(isValidMongoId()).to.eql(false);
  });

  it('should return false if passed undefined value', function() {
    expect(isValidMongoId(undefined)).to.eql(false);
  });

  it('should return false if passed null', function() {
    expect(isValidMongoId(null)).to.eql(false);
  });

  it('should return false if passed empty string', function() {
    expect(isValidMongoId('')).to.eql(false);
  });

  it('should return false if passed a number', function() {
    expect(isValidMongoId(543495154192672663942128)).to.eql(false);
  });

  it('should return false if passed an invalid 24 digit string', function() {
    expect(isValidMongoId('524*470803459a0b3018243c')).to.eql(false);
  });

  it('should return true if passed a string with valid format', function() {
    let id = mongoose.Types.ObjectId().toHexString();
    expect(isValidMongoId(id)).to.eql(true);
  });

  it('should return true if passed a valid ObjectId', function() {
    let id = mongoose.Types.ObjectId();
    expect(isValidMongoId(id)).to.eql(true);
  });
});

describe('areObjectIdsEqual', function() {
  describe('passing invalid arguments', function() {
    it('should return false if passed 0 arguments', function() {
      expect(areObjectIdsEqual()).to.eql(false);
    });

    it('should return false if passed equal strings that are not objectIds', function() {
      expect(areObjectIdsEqual('cat', 'cat')).to.eql(false);
    });

    it('should return false if passed 2 different valid ObjectIds', function() {
      let id1 = mongoose.Types.ObjectId();
      let id2 = mongoose.Types.ObjectId();
      expect(areObjectIdsEqual(id1, id2)).to.be.false;
    });

    it('should return false if passed 2 different valid ObjectIds in string format', function() {
      let id1 = mongoose.Types.ObjectId().toHexString();
      let id2 = mongoose.Types.ObjectId().toHexString();
      expect(areObjectIdsEqual(id1, id2)).to.be.false;
    });

    it('should return false if passed 1 object id and another different string (valid format)', function() {
      let oId = mongoose.Types.ObjectId();
      let stringId = mongoose.Types.ObjectId().toHexString();

      expect(areObjectIdsEqual(oId, stringId)).to.be.false;
    });

    it('should return true if passed 2 equivalent object ids', function() {
      let id = mongoose.Types.ObjectId();
      expect(areObjectIdsEqual(id, id)).to.be.true;
    });

    it('should return true if passed 2 equivalent hex strings', function() {
      let id = mongoose.Types.ObjectId().toHexString();
      expect(areObjectIdsEqual(id, id)).to.be.true;
    });

    it('should return true if passed 1 object id and its string equivalent', function() {
      let oId = mongoose.Types.ObjectId();
      let string = oId.toHexString();

      expect(areObjectIdsEqual(oId, string)).to.be.true;
    });


  });
});

describe('didObjectIdArrayChange', function() {
  let fn = didObjectIdArrayFieldChange;
  let id1 = mongoose.Types.ObjectId();
  let id2 = mongoose.Types.ObjectId();
  let id3 = mongoose.Types.ObjectId();

  it('should return false if passed no arguments', function() {
    expect(fn()).to.eql(false);
  });

  it('should return false if passed 2 empty arrays', function() {
    expect(fn([], [])).to.eql(false);
  });

  it('should return true if passed 1 empty array and 1 non array', function() {
    expect(fn([], '')).to.eql(true);
  });

  it('should return true if passed 1 empty array and 1 non empty array', function() {
    expect(fn([], [id1])).to.eql(true);
  });

  it('should return true if passed 1 nonempty array and 1 empty array', function() {
    expect(fn([id2], [])).to.eql(true);
  });

  it('should return false if passed identical arrays in same order', function() {
    expect(fn([id1, id2], [id1, id2])).to.eql(false);
  });

  it('should return false if passed identical arrays in diff order', function() {
    expect(fn([id1, id2], [id2, id1])).to.eql(false);
  });

  it('should return true if passed different arrays of same length', function() {
    expect(fn([id1, id3], [id2, id1])).to.eql(true);
  });

  it('should return true if passed different arrays of same length', function() {
    expect(fn([id1, id3], [id2, id1])).to.eql(true);
  });

  it('should return true if passed different arrays of diff length', function() {
    expect(fn([id1, id3, id2], [id2, id1])).to.eql(true);
  });




});