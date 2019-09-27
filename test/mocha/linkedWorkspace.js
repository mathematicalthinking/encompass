// REQUIRE MODULES
const chai = require('chai');
const chaiHttp = require('chai-http');

// REQUIRE FILES
const helpers = require('./helpers');
const userFixtures = require('./userFixtures');

const expect = chai.expect;
const host = helpers.host;

const { putApiResourceById, getApiResourceById } = helpers;

chai.use(chaiHttp);

let nonCollabStudent = {
  username: 'morganf',
  password: 'morganf',
  assignment: {
    _id: '5b91743a3da5efca74705773'
  },
  workspace: {
    _id: '5bec36958c73047613e2f34e',
  }
};

let relatedTeacher = {
  username: 'teachertaylor',
  password: 'teachertaylor',
  section: {
    _id: '5b9149a32ecaf7c30dd4748f',
  },
  assignment: {
    _id: '5b91743a3da5efca74705773'
  },
  workspace: {
    _id: '5bec36958c73047613e2f34e',
  }
};

describe('API requests related to the linking of workspaces/assignments', function() {
  this.timeout('10s');
  const agent = chai.request.agent(host);

  describe('Accessing a linkedWorkspace from a non-collab student', function() {
    let { username, password, workspace } = nonCollabStudent;

    before(async function(){
      try {
        await helpers.setup(agent, username, password);
      }catch(err) {
        console.log(err);
      }
    });

    after(() => {
      agent.close();
    });

    it('should not be able to access', function() {
      return getApiResourceById(agent, 'workspaces', workspace._id)
        .then((result) => {
          expect(result).to.have.status(403);
        })
        .catch((err) => {
          throw(err);
        });
    });
  });

  describe('Accessing a linkedWorkspace as a teacher of related section', function() {

    let { username, password, workspace } = relatedTeacher;

    before(async function(){
      try {
        await helpers.setup(agent, username, password);
      }catch(err) {
        console.log(err);
      }
    });

    after(() => {
      agent.close();
    });

    it('should be able to access', function() {
      return getApiResourceById(agent, 'workspaces', workspace._id)
        .then((result) => {
          expect(result).to.have.status(200);
        })
        .catch((err) => {
          throw(err);
        });
    });

  });

  describe('Unlinking an assignment from workspace', function() {
    let updateResults;
    let updatedWorkspace;
    let user = userFixtures.users.teacherMT;
    let { username, password } = user.details;
    let workspace = {
      "_id" : "5bec36958c73047613e2f34e",
      "mode" : "private",
      "name" : "Summer's Test Workspace 1",
      "owner" : "5b4e4b48808c7eebc9f9e827",
      "organization" : "5b4e4d5f808c7eebc9f9e82c",
      "createdBy" : "5b4e4b48808c7eebc9f9e827",
      "lastModifiedBy" : "5b7321ee59a672806ec903d5",
      "lastViewed" : "2019-08-21T15:17:57.265Z",
      "linkedAssignment" : "5b91743a3da5efca74705773",
      "doOnlyUpdateLastViewed" : false,
      "doAllowSubmissionUpdates" : true,
      "permissions" : [
          {
              "user" : "5b99146e25b620610ceead75",
              "global" : "custom",
              "folders" : 0,
              "selections" : 2,
              "comments" : 2,
              "feedback" : "authReq",
              "submissions" : {
                  "all" : true,
                  "submissionIds" : []
              },
          },
          {
              "user" : "5b9149c22ecaf7c30dd47490",
              "global" : "custom",
              "folders" : 1,
              "selections" : 1,
              "comments" : 1,
              "feedback" : "none",
              "submissions" : {
                  "all" : false,
                  "userOnly" : true,
                  "submissionIds" : []
              },
          },
          {
              "user" : "5b1e7bf9a5d2157ef4c911a6",
              "global" : "directMentor",
              "selections" : 2,
              "folders" : 2,
              "comments" : 2,
              "feedback" : "preAuth",
              "submissions" : {
                  "all" : true,
                  "submissionIds" : []
              },
          },
          {
              "user" : "5b7321ee59a672806ec903d5",
              "global" : "indirectMentor",
              "selections" : 2,
              "folders" : 2,
              "comments" : 2,
              "feedback" : "authReq",
              "submissions" : {
                  "all" : true,
                  "submissionIds" : []
              },
          },
          {
              "user" : "5b914a102ecaf7c30dd47492",
              "global" : "custom",
              "selections" : 2,
              "folders" : 0,
              "comments" : 2,
              "feedback" : "authReq",
              "submissions" : {
                  "all" : false,
                  "userOnly" : true,
                  "submissionIds" : []
              },
          },
      ],
      "taggings" : [
          "5bec37f48c73047613e2f367",
          "5bec38018c73047613e2f368",
          "5bec38338c73047613e2f36b",
          "5bec386a8c73047613e2f36d"
      ],
      "comments" : [
          "5bec375d8c73047613e2f35e",
          "5bec37708c73047613e2f35f",
          "5bec37a08c73047613e2f364",
          "5bec37e38c73047613e2f366"
      ],
      "selections" : [
          "5bec373d8c73047613e2f35c",
          "5bec37408c73047613e2f35d",
          "5bec37838c73047613e2f361",
          "5bec37a78c73047613e2f365"
      ],
      "responses" : [
          "5bec6497aa4a927d50cd5b9b",
          "5bec64f7aa4a927d50cd5ba0",
          "5c87ddf1a2fb212cd72de56a",
          "5c87de03a2fb212cd72de56c"
      ],
      "submissions" : [
          "5bec36958c73047613e2f34c",
          "5bec36958c73047613e2f34d"
      ],
      "submissionSet" : {
          "description" : {
              "pdSource" : "default",
              "firstSubmissionDate" : "2018-11-14T14:52:05.677Z",
              "lastSubmissionDate" : "2018-11-14T14:52:05.678Z",
              "puzzle" : {
                  "title" : "Summer's Private Problem"
              },
              "group" : {
                  "name" : "Summer's Algebra 2 1st Period"
              },
          },
          "criteria" : {
              "pdSet" : "default",
              "group" : {
                  "groupId" : "5b9149a32ecaf7c30dd4748f"
              },
              "puzzle" : {
                  "puzzleId" : "5b9173e23da5efca74705772"
              },
          },
      },
      "folders" : [
          "5bec36c58c73047613e2f352",
          "5bec36ca8c73047613e2f353",
          "5bec36cd8c73047613e2f354",
          "5bec36dd8c73047613e2f355",
          "5bec36e98c73047613e2f356",
          "5bec36f78c73047613e2f357",
          "5bec37048c73047613e2f358",
          "5bec37108c73047613e2f359",
          "5bec371f8c73047613e2f35a"
      ],
      "editors" : [],
      "lastModifiedDate" : "2019-03-12T16:27:47.826Z",
      "isTrashed" : false,
      "createDate" : "2018-11-14T14:30:46.526Z",
      "childWorkspaces" : [],
      "workspaceType" : "markup"
      };
      let assignmentId = workspace.linkedAssignment;

    delete workspace.linkedAssignment;
    let originalLastModifiedDate = workspace.lastModifiedDate;

    before(async function(){
      try {
        await helpers.setup(agent, username, password);
        updateResults = await putApiResourceById(agent, 'workspaces', workspace._id, workspace);
        expect(updateResults).to.have.status(200);
        updatedWorkspace = updateResults.body.workspace;
      }catch(err) {
        console.log(err);
      }
    });

    it('should remove linkedAssignment', function() {
      expect(updatedWorkspace.linkedAssignment).to.not.exist;
    });

    it('Should update meta data', function() {
      expect(updatedWorkspace.lastModifiedDate).to.not.eql(originalLastModifiedDate);
      expect(updatedWorkspace.lastModifiedBy).to.eql(user.details._id);
    });

    it(`Should have removed workspace from assignment's linked workspaces`, async function() {
      let results = await getApiResourceById(agent, 'assignments', assignmentId);
      let assignment = results.body.assignment;

      expect(assignment.linkedWorkspaces.map(id => id.toString())).to.not.include(workspace._id);
    });


  });
});