// REQUIRE MODULES
const chai = require('chai');
const chaiHttp = require('chai-http');

// REQUIRE FILES
const helpers = require('./helpers');

const expect = chai.expect;
const host = helpers.host;

const { putApiResourceById, getApiResourceById } = helpers;

chai.use(chaiHttp);

let assignment = {
  "_id" : "5b91743a3da5efca74705773",
  "name" : "Summer's Org Problem / Sep 6th 2018",
  "assignedDate" : "2018-09-06T04:00:00.000Z",
  "dueDate" : "2018-11-30T05:00:00.000Z",
  "createdBy" : "5b4e4b48808c7eebc9f9e827",
  "lastModifiedBy" : null,
  "section" : "5b9149a32ecaf7c30dd4748f",
  "problem" : "5b9173e23da5efca74705772",
  "assignmentType" : "problem",
  "linkedWorkspaces" : ["5bec36958c73047613e2f34e", "5d5d60ef4f217a59dfbbdeeb"],
  "answers" : [
      "5bb813fc9885323f6d894972",
      "5bec35898c73047613e2f34b"
  ],
  "students" : [
      "5b9149c22ecaf7c30dd47490",
      "5b9149f52ecaf7c30dd47491",
      "5b914a102ecaf7c30dd47492",
      "5b99146e25b620610ceead75"
  ],
  "lastModifiedDate" : null,
  "isTrashed" : false,
  "createDate" : "2018-09-06T18:38:50.073Z"
};

describe('Creating Parent workspace from assignment', function() {
  this.timeout('10s');
  const agent = chai.request.agent(host);

  let parentWorkspaceRequest = {
    doCreate: true,
    childWorkspaces: assignment.linkedWorkspaces
  };

  let results;
  let updatedAssn;

  let originalLinkedWorkspaceIds = assignment.linkedWorkspaces;

  let originalLinkedWs;

  assignment.parentWorkspaceRequest = parentWorkspaceRequest;
  before(async function() {
    await helpers.setup(agent, 'ssmith', 'ssmith');

    originalLinkedWs = await Promise.all(originalLinkedWorkspaceIds.map((id) => {
      return getApiResourceById(agent, 'workspaces', id.toString())
      .then(results => results.body.workspace);
    }));
    results = await putApiResourceById(agent, 'assignments', assignment._id.toString(), assignment);

    expect(results).to.have.status(200);
    updatedAssn = results.body.assignment;
  });

  it('should not have modified linked workspace data', async function() {
    let linkedWorkspaces = updatedAssn.linkedWorkspaces;
    let parentWsId = updatedAssn.parentWorkspace;

    expect(linkedWorkspaces).to.have.members(originalLinkedWorkspaceIds);

    let populatedLinkedWorkspaces = await Promise.all((linkedWorkspaces.map((wsId) => {
      return getApiResourceById(agent, 'workspaces', wsId)
      .then(results => results.body.workspace);
    })));


    populatedLinkedWorkspaces.forEach((ws, ix) => {
      let { folders, comments, selections, taggings, responses, submissions, parentWorkspaces } = ws;
      expect(folders).to.have.members(originalLinkedWs[ix].folders);
      expect(comments).to.have.members(originalLinkedWs[ix].comments);
      expect(selections).to.have.members(originalLinkedWs[ix].selections);
      expect(taggings).to.have.members(originalLinkedWs[ix].taggings);
      expect(responses).to.have.members(originalLinkedWs[ix].responses);
      expect(submissions).to.have.members(originalLinkedWs[ix].submissions);
      expect(parentWorkspaces).to.have.members([parentWsId]);

    });

  });

});