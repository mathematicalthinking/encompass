var Seeder = require('mongoose-data-seed').Seeder;
var Response = require('../server/datasource/schemas').Response;

var data = [
  {
    "_id": "5b1aef7ae53645e768926123",
    "text": "ytytu",
    "original": null,
    "source": "submission",
    "createdBy": "5b245760ac75842be3189525",
    "submission": "53e1156db48b12793f00043d",
    "workspace": "53e1156db48b12793f000442",
    "comments": [],
    "selections": [],
    "isTrashed": false,
    "createDate": "2018-06-08T21:04:58.683Z",
    "status": 'approved',
    "responseType": "mentor",
  },
  {
    "_id" : "5bbe0224ecd6e597fd8eea13",
    "isTrashed" : true,
    "source": "submission",
    "text": "trashed response",
    "createdBy": "5b245760ac75842be3189525",
  },
  {
    "_id" : "5bec6497aa4a927d50cd5b9b",
    "text" : "Hi Ashley, \n\nThis is my feedback...",
    "original" : null,
    "source" : "submission",
    "createdBy" : "5b4e4b48808c7eebc9f9e827",
    "lastModifiedBy" : null,
    "recipient" : "5b9149c22ecaf7c30dd47490",
    "submission" : "5bec36958c73047613e2f34d",
    "workspace" : "5bec36958c73047613e2f34e",
    "comments" : [
        "5bec37a08c73047613e2f364",
        "5bec37e38c73047613e2f366"
    ],
    "selections" : [
        "5bec37838c73047613e2f361",
        "5bec37a78c73047613e2f365"
    ],
    "status": 'approved',
    "responseType": "mentor",
    "lastModifiedDate" : null,
    "isTrashed" : false,
    "createDate" : "2018-11-14T18:08:23.341Z"
},
{
    "_id" : "5bec64f7aa4a927d50cd5ba0",
    "text" : "Hi Tracy, \n\nHere is my response....",
    "original" : null,
    "source" : "submission",
    "createdBy" : "5b4e4b48808c7eebc9f9e827",
    "lastModifiedBy" : null,
    "recipient" : "5b914a102ecaf7c30dd47492",
    "submission" : "5bec36958c73047613e2f34c",
    "workspace" : "5bec36958c73047613e2f34e",
    "comments" : [
        "5bec375d8c73047613e2f35e",
        "5bec37708c73047613e2f35f"
    ],
    "selections" : [
        "5bec373d8c73047613e2f35c",
        "5bec37408c73047613e2f35d"
    ],
    "status": 'approved',
    "responseType": "mentor",
    "lastModifiedDate" : null,
    "isTrashed" : false,
    "createDate" : "2018-11-14T18:09:59.610Z"
},
{
  "_id" : "5c6eca77a89be9751158ce0c",
  "text" : "Hello mtgstudent2,\n\nYou wrote: \n\n         Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n\n     ...and I wondered about...\n\n\t\tWhat did you mean here?\n\n",
  "original" : "Hello mtgstudent2,\n\nYou wrote: \n\n         Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n\n     ...and I wondered about...\n\n\t\tWhat did you mean here?\n\n",
  "source" : "submission",
  "responseType" : "mentor",
  "note" : null,
  "status" : "approved",
  "createdBy" : "5c6eb49c9852e5710311d634",
  "lastModifiedBy" : null,
  "recipient" : "5c6eb4ac9852e5710311d635",
  "submission" : "5c6ec5eba89be9751158ce08",
  "workspace" : "5c6ec5eba89be9751158ce06",
  "priorRevision" : null,
  "reviewedResponse" : null,
  "approvedBy" : null,
  "isNewlySuperceded" : false,
  "isNewlyNeedsRevisions" : false,
  "isNewPending" : false,
  "isNewApproved" : true,
  "isNewlyApproved" : false,
  "isApproverNoteOnly" : false,
  "wasReadByApprover" : false,
  "wasReadByRecipient" : false,
  "comments" : [
      "5c6ec924a89be9751158ce0b"
  ],
  "selections" : [
      "5c6ec919a89be9751158ce0a"
  ],
  "lastModifiedDate" : null,
  "isTrashed" : false,
  "createDate" : "2019-02-21T15:57:43.792Z"
}
];

var ResponsesSeeder = Seeder.extend({
  shouldRun: function () {
    return Response.count().exec().then(count => count === 0);
  },
  run: function () {
    return Response.create(data);
  }
});

module.exports = ResponsesSeeder;
