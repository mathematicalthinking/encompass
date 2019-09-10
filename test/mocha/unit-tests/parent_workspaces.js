const { expect } = require('chai');
const mongoose = require('mongoose');
const dbSetup  = require('../../data/restore');

const models = require('../../../server/datasource/schemas');
mongoose.Promise = global.Promise;

const { generateParentWorkspace } = require('../../../server/datasource/api/parentWorkspaceApi');
const fixtures = require('../fixtures/parent_workspaces');

let dbUri = 'mongodb://localhost:27017/encompass_seed';
const runTest = function(config, expectedResults, description, compareOptions = {doUseDeepEqual : true}) {
  describe(description, function() {
    this.timeout('20s');
    let results;
    before(async function() {
      try {
        results = await generateParentWorkspace(config);
        return;
      }catch(err) {
        throw(err);
      }
    });

    it('Should return results object', function() {
      expect(results).to.be.an('array');
      expect(results).to.lengthOf(2);
    });

    if (compareOptions.doUseDeepEqual) {
      it('Results should deep equal expected results', function() {
        expect(results).to.deep.equal(expectedResults);
      });
    } else {
      // can't use deep equal to determine success
      // because ids are unknow
      it('Error msg should be null', function() {
        expect(results[0]).to.eql(expectedResults.errorMsg);
      });

      it('Should correctly combine submissions', function() {
        let expectedLength = expectedResults.parentWorkspace.submissions.length;
        expect(results[1].submissions.length).to.eql(expectedLength);
      });

      it('Should correctly combine selections', function() {
        let expectedLength = expectedResults.parentWorkspace.selections.length;
        expect(results[1].selections.length).to.eql(expectedLength);
      });

      it('Should correctly combine comments', function() {
        let expectedLength = expectedResults.parentWorkspace.comments.length;
        expect(results[1].comments.length).to.eql(expectedLength);
      });

      it('Should correctly combine folders', function() {
        let expectedLength = expectedResults.parentWorkspace.folders.length;
        expect(results[1].folders.length).to.eql(expectedLength);
      });

      it('Should correctly combine taggings', function() {
        let expectedLength = expectedResults.parentWorkspace.taggings.length;
        expect(results[1].taggings.length).to.eql(expectedLength);
      });

      it('Should correctly combine responses', function() {
        let expectedLength = expectedResults.parentWorkspace.responses.length;
        expect(results[1].responses.length).to.eql(expectedLength);
      });

      it('Workspace type should be parent', function() {
        expect(results[1].workspaceType).to.eql(expectedResults.parentWorkspace.workspaceType);
      });

      it('Should have correct childWorkspaces', function() {
        expect(results[1].childWorkspaces.map(id => id.toString())).to.have.members(expectedResults.parentWorkspace.childWorkspaces);
      });

    }

  });
};

describe('Generating a Parent Workspace from a set of child workspaces', function() {
  this.timeout('10s');
  before(function() {
    mongoose.connect(dbUri, { useMongoClient: true});
   return dbSetup.prepTestDb();

  });
  after(function() {
    mongoose.connection.close();
  });
  describe('Invalid config value for child workspaces', async function() {
    let expectedResults = fixtures.results.noChildWorkspaces;

    await runTest({}, expectedResults, 'Undefined');
    await runTest({childWorkspaces: []}, expectedResults, 'Empty array');
  });

  describe('Multiple workspaces', async function() {
   let config = fixtures.configs.validMultiple;
    let expectedResults = fixtures.results.validMultiple;
  await runTest(config, expectedResults, 'Valid Multiple', { doUseDeepEqual: false });
  });
});