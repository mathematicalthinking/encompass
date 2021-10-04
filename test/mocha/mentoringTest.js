// REQUIRE MODULES
const chai = require('chai');
const chaiHttp = require('chai-http');

// REQUIRE FILES
const helpers = require('./helpers');

const expect = chai.expect;
const host = helpers.host;
const baseUrl = "/api/responses/";

chai.use(chaiHttp);

// let indirectMentor = {
//   _id: '5c6f4075b1ccdf96abab26fe',
//   username: 'mentort1',
//   password: 'test',
//   newResponse: {
//     text: 'This response should have status of pendingApproval once created.',
//   },
//   alreadyApprovedResponse: {
//     _id: '5c6eca77a89be9751158ce0c',
//   }
// };

let ownerApprover = {
  userId: '5c6eb49c9852e5710311d634',
  username: 'mtgstudent1',
  password: 'test',
  alreadyApprovedResponse: {
    _id: '5c6eca77a89be9751158ce0c',
    text: 'Hello mtgstudent2,\n\nYou wrote: \n\n         Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n\n     ...and I wondered about...\n\n\t\tWhat did you mean here?\n\n',
  },
  approvedButReadResponse: {
    _id: '5c9262343fd67ae4f1f924c3',
    text: "<p>This is a test response with no selections or comments.</p>",
  }
};

function updateResponse(id, putBody, agent) {
  return agent
    .put(`${baseUrl}${id}`)
    .send(putBody);
}

function updateResponseStatus(id, newStatus, agent, creator, text, source='submission') {
  let putBody = {
    response: {
      createdBy: creator,
      status: newStatus,
      text: text,
      source
    }
  };

  return updateResponse(id, putBody, agent);
}

describe('With approver capabilities', function() {
  this.timeout('10s');
  const agent = chai.request.agent(host);
  const { username, password, alreadyApprovedResponse, approvedButReadResponse, userId } = ownerApprover;

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

  describe('Changing status of already approved response', function() {
    function updateStatuses(responseToUpdate, describeDescription, errorDetails) {
      describe(describeDescription, function() {

      });
      let newStatuses = ['pendingApproval', 'needsRevisions', 'draft', 'superceded'];

      return Promise.all(newStatuses.map((status) => {
        it(`should succesfully change status to ${status} `, async function() {
          let res = await updateResponseStatus(responseToUpdate._id, status, agent, userId, responseToUpdate.text);

          if (errorDetails) {
            expect(res.status).to.eql(errorDetails.responseStatus);
            expect(res.body.errors[0].detail).to.eql(errorDetails.errorMessage);
          } else {
            expect(res.body.response.status).to.eql(status);
          }
        });
      }));
    }

    updateStatuses(alreadyApprovedResponse, 'Changing status before response has been read by recipient');

    updateStatuses(approvedButReadResponse, 'Changing status after response has been read by recipient', {
      responseStatus: 422,
      errorMessage: 'A response\'s status cannot be changed once it has been read by its recipient',
    });

  });
});