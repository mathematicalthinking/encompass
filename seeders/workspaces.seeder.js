var Seeder = require('mongoose-data-seed').Seeder;
var Workspace = require('../server/datasource/schemas').Workspace;


var data = [
  {
    _id: "53e1156db48b12793f000442",
    "createdBy": "5b245760ac75842be3189525",
    comments: ["53e12264b48b12793f000b84", "53e12507b48b12793f000b91","5bbbba86a6a7ee1a9a5ebc75"],
    createDate: "2014-08-04T15:55:20.978Z",
    editors: ["53a43f7c729e9ef59ba7ebf2", "529518daba1cd3d8c4013344", "5b245760ac75842be3189525"],
    folders: ["53e11604b48b12793f0004ee", "53e1165eb48b12793f0005e7", "53e1166db48b12793f0005e9", "53e118f3b48b12793f000a41", "53e11b0ab48b12793f000ab1"],
    isTrashed: false,
    mode: "private",
    name: "Feathers and Fur / Period 5 Basic Math",
    owner: "5b245760ac75842be3189525",
    organization: "5b4a64a028e4b75919c28512",
    responses: ["5b1aef7ae53645e768926123"],
    selections: ["53e11942b48b12793f000a5f", "53e11b38b48b12793f000ab7", "53e11ec4b48b12793f000b34", "53e11f20b48b12793f000b3a", "53e11f82b48b12793f000b44", "53e12158b48b12793f000b68", "53e12211b48b12793f000b7e", "53e1223cb48b12793f000b80", "53e1223eb48b12793f000b81", "53e12503b48b12793f000b90","5bbbba75a6a7ee1a9a5ebc74"],
    submissions: ["53e1156db48b12793f000418", "53e1156db48b12793f00042e", "53e1156db48b12793f000420", "53e1156db48b12793f000425", "53e1156db48b12793f000416", "53e1156db48b12793f000421", "53e1156db48b12793f000432", "53e1156db48b12793f000436", "53e1156db48b12793f00041a", "53e1156db48b12793f00042f", "53e1156db48b12793f00041e", "53e1156db48b12793f000430", "53e1156db48b12793f00043e", "53e1156db48b12793f000419", "53e1156db48b12793f00042d", "53e1156db48b12793f000438", "53e1156db48b12793f00041b", "53e1156db48b12793f000434", "53e1156db48b12793f000417", "53e1156db48b12793f000427", "53e1156db48b12793f000423", "53e1156db48b12793f000440", "53e1156db48b12793f000407", "53e1156db48b12793f000437", "53e1156db48b12793f000422", "53e1156db48b12793f000433", "53e1156db48b12793f000428", "53e1156db48b12793f00043d", "53e1156db48b12793f00042c", "53e1156db48b12793f00041d", "53e1156db48b12793f000439", "53e1156db48b12793f000414", "53e1156db48b12793f00041f", "53e1156db48b12793f00043a", "53e1156db48b12793f000415", "53e1156db48b12793f000426"],
    taggings: ["53e1194bb48b12793f000a62", "53e11b5eb48b12793f000abb", "53e11eceb48b12793f000b36", "53e11fa8b48b12793f000b48", "53e12250b48b12793f000b83", "53e12518b48b12793f000b92"],
    permissions: [
        {
            "user" : "53a43f7c729e9ef59ba7ebf2",
            "global" : "approver",
            "folders" : 3,
            "comments" : 4,
            "selections" : 4,
            "feedback" : "approver",
            "submissions" : {
                "all" : true,
                "submissionIds" : []
            }
        },
        {
            "user" : "529518daba1cd3d8c4013344",
            "global" : "approver",
            "folders" : 3,
            "comments" : 4,
            "selections" : 4,
            "feedback" : "approver",
            "submissions" : {
                "all" : true,
                "submissionIds" : []
            }
        },
        {
            "user" : "5b245760ac75842be3189525",
            "global" : "approver",
            "folders" : 3,
            "comments" : 4,
            "selections" : 4,
            "feedback" : "approver",
            "submissions" : {
                "all" : true,
                "submissionIds" : []
            }
        }
    ]
  },   {
    _id: "53e36522b48b12793f000d3b",
    comments: ["53e37a4ab48b12793f00104c"],
    createDate: "2014-08-04T15:55:20.978Z",
    "createdBy": "5b245760ac75842be3189525",
    editors: ["52964714e4bad7087700014e", "52b05fae729e9ef59ba7eb4d", "53d274a032f2863240001a71", "52964653e4bad7087700014b", "52a88def729e9ef59ba7eb4c", "5370dc9c8f3e3d1f21000022", "52a88ae2729e9ef59ba7eb4b", "529646eae4bad7087700014d", "53a355a932f2863240000026", "5b245760ac75842be3189525"],
    folders: ["53e36a0bb48b12793f000d3c", "53e36a31b48b12793f000d3d", "53e36ab5b48b12793f000d40", "53e36cdbb48b12793f000d43", "53e36d26b48b12793f000d45", "53e37466b48b12793f000d47", "53e374adb48b12793f000d4c", "53e374d2b48b12793f000d4e", "53e3751ab48b12793f000d50", "53e37554b48b12793f000d54", "53e37758b48b12793f001040", "53e377b5b48b12793f001044", "53e37aa4b48b12793f00104f", "53e37af0b48b12793f001054", "53e37b28b48b12793f001057", "53e37b47b48b12793f00105a", "53e37b71b48b12793f00105d", "53e37c3eb48b12793f00106a", "53e37c7cb48b12793f00106d", "53e37da2b48b12793f00107a", "53e37e41b48b12793f00108b", "53e37e94b48b12793f00108e", "53e37edbb48b12793f001091", "53e37f0fb48b12793f001096", "53e37f38b48b12793f001099", "53e38a96b48b12793f0010d2", "53e38e28b48b12793f0010d9"],
    isTrashed: false,
    mode: "public",
    name: "ESI 2014 Wednesday Reflection / EnCoMPASS Summer Institute 2014",
    owner: "529518daba1cd3d8c4013344",
    responses: [],
    selections: ["53e36a96b48b12793f000d3e", "53e36ac7b48b12793f000d41", "53e36d13b48b12793f000d44", "53e3746fb48b12793f000d48", "53e3748db48b12793f000d4a", "53e374c7b48b12793f000d4d", "53e37525b48b12793f000d51", "53e3753eb48b12793f000d53", "53e37571b48b12793f000d56", "53e37710b48b12793f00103c", "53e37724b48b12793f00103e", "53e37769b48b12793f001042", "53e379dfb48b12793f00104a", "53e37a83b48b12793f00104d", "53e37ab0b48b12793f001050", "53e37aceb48b12793f001052", "53e37afbb48b12793f001055", "53e37b34b48b12793f001058", "53e37b52b48b12793f00105b", "53e37b80b48b12793f00105e", "53e37b99b48b12793f001060", "53e37be2b48b12793f001066", "53e37c15b48b12793f001068", "53e37c63b48b12793f00106b", "53e37c87b48b12793f00106e", "53e37cb2b48b12793f001070", "53e37cecb48b12793f001072", "53e37d00b48b12793f001074", "53e37d21b48b12793f001076", "53e37d43b48b12793f001078", "53e37daeb48b12793f00107b", "53e37db9b48b12793f00107d", "53e37dcfb48b12793f00107f", "53e37de2b48b12793f001081", "53e37df2b48b12793f001083", "53e37e02b48b12793f001085", "53e37e1cb48b12793f001087", "53e37e2eb48b12793f001089", "53e37e46b48b12793f00108c", "53e37eb4b48b12793f00108f", "53e37eebb48b12793f001092", "53e37ef7b48b12793f001094", "53e37f14b48b12793f001097", "53e37f3cb48b12793f00109a", "53e37f4bb48b12793f00109c", "53e37f97b48b12793f00109e", "53e37fa8b48b12793f0010a0", "53e3894fb48b12793f0010b4", "53e38965b48b12793f0010b9", "53e3898eb48b12793f0010bb", "53e38a6bb48b12793f0010cc", "53e38a77b48b12793f0010ce", "53e38ac3b48b12793f0010d4", "53e38ad0b48b12793f0010d6", "53e38ad7b48b12793f0010d7", "53e38e41b48b12793f0010da", "53e38e4cb48b12793f0010dc", "53e38e83b48b12793f0010de", "53e38eaab48b12793f0010e0", "53e38ec2b48b12793f0010e2", "53e38ec9b48b12793f0010e4"],
    submissions: ["53e36522729e9ef59ba7f4dd", "53e36522729e9ef59ba7f4dc", "53e36522729e9ef59ba7f4da", "53e36522729e9ef59ba7f4d3", "53e36522729e9ef59ba7f4d2", "53e36522729e9ef59ba7f4d6", "53e36522729e9ef59ba7f4e1", "53e36522729e9ef59ba7f4d9", "53e36522729e9ef59ba7f4d4", "53e36522729e9ef59ba7f4db", "53e36522729e9ef59ba7f4d7", "53e36522729e9ef59ba7f4d5", "53e36522729e9ef59ba7f4e2", "53e36522729e9ef59ba7f4d8", "53e36522729e9ef59ba7f4df", "53e36522729e9ef59ba7f4e0", "53e36522729e9ef59ba7f4de"],
    taggings: ["53e36ad3b48b12793f000d42", "53e36d2bb48b12793f000d46", "53e37478b48b12793f000d49", "53e37492b48b12793f000d4b", "53e374dcb48b12793f000d4f", "53e37529b48b12793f000d52", "53e37560b48b12793f000d55", "53e37583b48b12793f000d57", "53e37715b48b12793f00103d", "53e3772cb48b12793f00103f", "53e3777cb48b12793f001043", "53e379e4b48b12793f00104b", "53e37a87b48b12793f00104e", "53e37ab7b48b12793f001051", "53e37ad4b48b12793f001053", "53e37b0eb48b12793f001056", "53e37b3bb48b12793f001059", "53e37b57b48b12793f00105c", "53e37b8ab48b12793f00105f", "53e37ba1b48b12793f001061", "53e37be8b48b12793f001067", "53e37c1ab48b12793f001069", "53e37c69b48b12793f00106c", "53e37c9bb48b12793f00106f", "53e37cc1b48b12793f001071", "53e37cf5b48b12793f001073", "53e37d05b48b12793f001075", "53e37d27b48b12793f001077", "53e37d47b48b12793f001079", "53e37db1b48b12793f00107c", "53e37dc3b48b12793f00107e", "53e37dd7b48b12793f001080", "53e37deab48b12793f001082", "53e37df8b48b12793f001084", "53e37e07b48b12793f001086", "53e37e23b48b12793f001088", "53e37e33b48b12793f00108a", "53e37e4cb48b12793f00108d", "53e37ec4b48b12793f001090", "53e37eeeb48b12793f001093", "53e37efeb48b12793f001095", "53e37f19b48b12793f001098", "53e37f43b48b12793f00109b", "53e37f4eb48b12793f00109d", "53e37f9cb48b12793f00109f", "53e37faab48b12793f0010a1", "53e38959b48b12793f0010b8", "53e38971b48b12793f0010ba", "53e38a53b48b12793f0010cb", "53e38a6fb48b12793f0010cd", "53e38aa6b48b12793f0010d3", "53e38accb48b12793f0010d5", "53e38adbb48b12793f0010d8", "53e38e46b48b12793f0010db", "53e38e5eb48b12793f0010dd", "53e38ea3b48b12793f0010df", "53e38eb2b48b12793f0010e1", "53e38ec6b48b12793f0010e3", "53e38edcb48b12793f0010e5", "53e36a9bb48b12793f000d3f"],
    "permissions": [
        {
            "user" : "52964714e4bad7087700014e",
            "global" : "approver",
            "folders" : 3,
            "comments" : 4,
            "selections" : 4,
            "feedback" : "approver",
            "submissions" : {
                "all" : true,
                "submissionIds" : []
            }
        },
        {
            "user" : "52b05fae729e9ef59ba7eb4d",
            "global" : "approver",
            "folders" : 3,
            "comments" : 4,
            "selections" : 4,
            "feedback" : "approver",
            "submissions" : {
                "all" : true,
                "submissionIds" : []
            }
        },
        {
            "user" : "53d274a032f2863240001a71",
            "global" : "approver",
            "folders" : 3,
            "comments" : 4,
            "selections" : 4,
            "feedback" : "approver",
            "submissions" : {
                "all" : true,
                "submissionIds" : []
            }
        },
        {
            "user" : "52964653e4bad7087700014b",
            "global" : "approver",
            "folders" : 3,
            "comments" : 4,
            "selections" : 4,
            "feedback" : "approver",
            "submissions" : {
                "all" : true,
                "submissionIds" : []
            }
        },
        {
            "user" : "52a88def729e9ef59ba7eb4c",
            "global" : "approver",
            "folders" : 3,
            "comments" : 4,
            "selections" : 4,
            "feedback" : "approver",
            "submissions" : {
                "all" : true,
                "submissionIds" : []
            }
        },
        {
            "user" : "5370dc9c8f3e3d1f21000022",
            "global" : "approver",
            "folders" : 3,
            "comments" : 4,
            "selections" : 4,
            "feedback" : "approver",
            "submissions" : {
                "all" : true,
                "submissionIds" : []
            }
        },
        {
            "user" : "52a88ae2729e9ef59ba7eb4b",
            "global" : "approver",
            "folders" : 3,
            "comments" : 4,
            "selections" : 4,
            "feedback" : "approver",
            "submissions" : {
                "all" : true,
                "submissionIds" : []
            }
        },
        {
            "user" : "529646eae4bad7087700014d",
            "global" : "approver",
            "folders" : 3,
            "comments" : 4,
            "selections" : 4,
            "feedback" : "approver",
            "submissions" : {
                "all" : true,
                "submissionIds" : []
            }
        },
        {
            "user" : "53a355a932f2863240000026",
            "global" : "approver",
            "folders" : 3,
            "comments" : 4,
            "selections" : 4,
            "feedback" : "approver",
            "submissions" : {
                "all" : true,
                "submissionIds" : []
            }
        },
        {
            "user" : "5b245760ac75842be3189525",
            "global" : "approver",
            "folders" : 3,
            "comments" : 4,
            "selections" : 4,
            "feedback" : "approver",
            "submissions" : {
                "all" : true,
                "submissionIds" : []
            }
        }
    ]
  },
  {
    "_id" : "5bb814d19885323f6d894974",
    "mode" : "private",
    "organization": "5b4e4d5f808c7eebc9f9e82c",
    "name" : "Summer's Org Problem Workspace",
    "owner": "5b4e4b48808c7eebc9f9e827",
    "createdBy": "5b4e4b48808c7eebc9f9e827",
    "lastModifiedBy" : "5b4e4b48808c7eebc9f9e827",
    "lastViewed" : "2018-10-06T01:50:09.797Z",
    "taggings" : ["5bbb9d5dc2aa0a1696840cea"],
    "comments" : ["5bbb9d86c2aa0a1696840ceb"],
    "selections" : ["5bbb9d57c2aa0a1696840ce9"],
    "responses" : [],
    "submissions" : [
        "5bb814d19885323f6d894973"
    ],
    "submissionSet" : {
        "description" : {
            "group" : {
                "name" : "Summer's Algebra 2 1st Period"
            },
            "puzzle" : {
                "title" : "Summer's Org Problem"
            },
            "lastSubmissionDate" : "2018-10-06T01:50:09.789Z",
            "firstSubmissionDate" : "2018-10-06T01:50:09.789Z",
            "pdSource" : "default"
        },
        "criteria" : {
            "puzzle" : {
                "puzzleId" : "5b9173e23da5efca74705772"
            },
            "group" : {
                "groupId" : "5b9149a32ecaf7c30dd4748f"
            },
            "pdSet" : "default"
        }
    },
    "folders" : [
        "5bb814d19885323f6d894975",
        "5bb814d19885323f6d894976",
        "5bb814d19885323f6d894977",
        "5bb814d19885323f6d894978"
    ],
    "editors" : [],
    "lastModifiedDate" : "2018-10-06T01:50:09.797Z",
    "isTrashed" : false,
    "createDate" : "2018-10-06T01:44:45.159Z"
},
{
    "_id" : "5bbd146aecd6e597fd89da76",
    "isTrashed" : true,
    "createdBy" : "5b4e4b48808c7eebc9f9e827",
    "owner" : "5b4e4b48808c7eebc9f9e827",
    "name" : "trashed workspace"
},
{
    "_id" : "5bec36958c73047613e2f34e",
    "mode" : "private",
    "name" : "Summer's Test Workspace 1",
    "owner" : "5b4e4b48808c7eebc9f9e827",
    "organization": "5b4e4d5f808c7eebc9f9e82c",
    "createdBy" : "5b4e4b48808c7eebc9f9e827",
    "lastModifiedBy" : "5b4e4b48808c7eebc9f9e827",
    "lastViewed" : "2018-11-14T15:00:52.991Z",
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
            }
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
                "userOnly": true,
                "submissionIds": [],
            }
        },
        {
            "user" : "5b1e7bf9a5d2157ef4c911a6",
            "global": "directMentor",
            "selections" : 2,
            "folders" : 2,
            "comments" : 2,
            "feedback" : "preAuth",
            "submissions" : {
                "all" : true,
                "submissionIds" : []
            }
        },
        {
            "user" : "5b7321ee59a672806ec903d5",
            "global": "indirectMentor",
            "selections" : 2,
            "folders" : 2,
            "comments" : 2,
            "feedback" : "authReq",
            "submissions" : {
                "all" : true,
                "submissionIds" : []
            }
        },
        {
            "user" : "5b914a102ecaf7c30dd47492",
            "global": "custom",
            "selections" : 2,
            "folders" : 0,
            "comments" : 2,
            "feedback" : "authReq",
            "submissions" : {
                "all" : false,
                "userOnly": true,
                "submissionIds": [],
            }
        }
    ],
    "taggings" : ["5bec37f48c73047613e2f367","5bec38018c73047613e2f368","5bec38338c73047613e2f36b","5bec386a8c73047613e2f36d"],
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
        "5bec64f7aa4a927d50cd5ba0"
    ],
    "submissions" : [
        "5bec36958c73047613e2f34c",
        "5bec36958c73047613e2f34d"
    ],
    "submissionSet" : {
        "description" : {
            "group" : {
                "name" : "Summer's Algebra 2 1st Period"
            },
            "puzzle" : {
                "title" : "Summer's Private Problem"
            },
            "lastSubmissionDate" : "2018-11-14T14:52:05.678Z",
            "firstSubmissionDate" : "2018-11-14T14:52:05.677Z",
            "pdSource" : "default"
        },
        "criteria" : {
            "puzzle" : {
                "puzzleId" : "5b9173e23da5efca74705772"
            },
            "group" : {
                "groupId" : "5b9149a32ecaf7c30dd4748f"
            },
            "pdSet" : "default"
        }
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
    "linkedAssignment": "5b91743a3da5efca74705773",
    "doAllowSubmissionUpdates": true,
    "lastModifiedDate" : "2018-11-14T14:52:05.688Z",
    "isTrashed" : false,
    "createDate" : "2018-11-14T14:30:46.526Z"
},
{
    "_id" : "5c6ebc4a9852e5710311d641",
    "mode" : "private",
    "name" : "MTG Congruent Rectangles",
    "owner" : "5c6eb45d9852e5710311d633",
    "organization" : "5c6df20a9466896b1c5d84af",
    "createdBy" : "5c6eb45d9852e5710311d633",
    "lastModifiedBy" : "5c6eb45d9852e5710311d633",
    "lastViewed" : "2019-02-21T14:57:14.704Z",
    "doAllowSubmissionUpdates" : true,
    "permissions" : [],
    "taggings" : [],
    "comments" : [],
    "selections" : [],
    "responses" : [],
    "submissions" : [
        "5c6ebc4a9852e5710311d63e",
        "5c6ebc4a9852e5710311d63f",
        "5c6ebc4a9852e5710311d640"
    ],
    "submissionSet" : {
        "description" : {
            "group" : {
                "name" : "MTG Period 1"
            },
            "puzzle" : {
                "title" : "Seven Congruent Rectangles"
            },
            "lastSubmissionDate" : "2019-02-21T14:57:14.692Z",
            "firstSubmissionDate" : "2019-02-21T14:57:14.690Z",
            "pdSource" : "default"
        },
        "criteria" : {
            "puzzle" : {
                "puzzleId" : "5bac07fcea4c0a230b2c7ab0"
            },
            "group" : {
                "groupId" : "5c6eb4d49852e5710311d637"
            },
            "pdSet" : "default"
        }
    },
    "folders" : [],
    "editors" : [],
    "lastModifiedDate" : "2019-02-21T14:57:14.704Z",
    "isTrashed" : false,
    "createDate" : "2019-02-21T13:00:49.171Z"
},
{
    "_id" : "5c6ebc4a9852e5710311d63f",
    "createdBy" : "5c6eb4ac9852e5710311d635",
    "answer" : "5c6eb8319852e5710311d63c",
    "responses" : [],
    "workspaces" : [
        "5c6ebc4a9852e5710311d641"
    ],
    "comments" : [],
    "selections" : [],
    "teacher" : {
        "id" : "5c6eb45d9852e5710311d633"
    },
    "teachers" : [],
    "pdSet" : "default",
    "publication" : {
        "publicationId" : null,
        "puzzle" : {
            "title" : "Seven Congruent Rectangles",
            "problemId" : "5bac07fcea4c0a230b2c7ab0"
        }
    },
    "clazz" : {
        "sectionId" : "5c6eb4d49852e5710311d637",
        "name" : "MTG Period 1"
    },
    "creator" : {
        "studentId" : "5c6eb4ac9852e5710311d635",
        "username" : "mtgstudent2"
    },
    "lastModifiedDate" : "2019-02-21T13:00:49.176Z",
    "isTrashed" : false,
    "createDate" : "2019-02-21T14:57:14.691Z"
},
{
    "_id" : "5c6ebc4a9852e5710311d63e",
    "createdBy" : "5c6eb49c9852e5710311d634",
    "answer" : "5c6eb7f89852e5710311d639",
    "responses" : [],
    "workspaces" : [
        "5c6ebc4a9852e5710311d641"
    ],
    "comments" : [],
    "selections" : [],
    "teacher" : {
        "id" : "5c6eb45d9852e5710311d633"
    },
    "teachers" : [],
    "pdSet" : "default",
    "publication" : {
        "publicationId" : null,
        "puzzle" : {
            "title" : "Seven Congruent Rectangles",
            "problemId" : "5bac07fcea4c0a230b2c7ab0"
        }
    },
    "clazz" : {
        "sectionId" : "5c6eb4d49852e5710311d637",
        "name" : "MTG Period 1"
    },
    "creator" : {
        "studentId" : "5c6eb49c9852e5710311d634",
        "username" : "mtgstudent1"
    },
    "lastModifiedDate" : "2019-02-21T13:00:49.176Z",
    "isTrashed" : false,
    "createDate" : "2019-02-21T14:57:14.690Z"
},
{
    "_id" : "5c6ebc4a9852e5710311d640",
    "createdBy" : "5c6eb4c19852e5710311d636",
    "answer" : "5c6eb85d9852e5710311d63d",
    "responses" : [],
    "workspaces" : [
        "5c6ebc4a9852e5710311d641"
    ],
    "comments" : [],
    "selections" : [],
    "teacher" : {
        "id" : "5c6eb45d9852e5710311d633"
    },
    "teachers" : [],
    "pdSet" : "default",
    "publication" : {
        "publicationId" : null,
        "puzzle" : {
            "title" : "Seven Congruent Rectangles",
            "problemId" : "5bac07fcea4c0a230b2c7ab0"
        }
    },
    "clazz" : {
        "sectionId" : "5c6eb4d49852e5710311d637",
        "name" : "MTG Period 1"
    },
    "creator" : {
        "studentId" : "5c6eb4c19852e5710311d636",
        "username" : "mtgstudent3"
    },
    "lastModifiedDate" : "2019-02-21T13:00:49.176Z",
    "isTrashed" : false,
    "createDate" : "2019-02-21T14:57:14.692Z"
}
];

var WorkspacesSeeder = Seeder.extend({
  shouldRun: function () {
    return Workspace.count().exec().then(count => count === 0);
  },
  run: function () {
    return Workspace.create(data);
  }
});

module.exports = WorkspacesSeeder;
