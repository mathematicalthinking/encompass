const { ObjectId, ISODate } = require('./utils');

module.exports = [
/* 1 */
{
    "_id" : ObjectId("5bbd146aecd6e597fd89da76"),
    "createdBy" : ObjectId("5b4e4b48808c7eebc9f9e827"),
    "owner" : ObjectId("5b4e4b48808c7eebc9f9e827"),
    "name" : "trashed workspace",
    "doOnlyUpdateLastViewed" : false,
    "doAllowSubmissionUpdates" : true,
    "permissions" : [],
    "taggings" : [],
    "comments" : [],
    "selections" : [],
    "responses" : [],
    "submissions" : [],
    "folders" : [],
    "editors" : [],
    "lastModifiedDate" : ISODate("2019-07-01T17:23:27.838Z"),
    "isTrashed" : true,
    "createDate" : ISODate("2019-07-01T17:23:27.838Z")
},

/* 2 */
{
    "_id" : ObjectId("5c6ec5eba89be9751158ce06"),
    "sourceWorkspace" : ObjectId("5c6ebc4a9852e5710311d641"),
    "name" : "mtgstudent 1 - MTG Congruent Rectangle",
    "owner" : ObjectId("5c6eb49c9852e5710311d634"),
    "mode" : "private",
    "createdBy" : ObjectId("5c6eb45d9852e5710311d633"),
    "organization" : ObjectId("5c6df20a9466896b1c5d84af"),
    "lastViewed" : ISODate("2019-03-20T15:54:04.829Z"),
    "lastModifiedBy" : ObjectId("5c6eb45d9852e5710311d633"),
    "linkedAssignment" : null,
    "doOnlyUpdateLastViewed" : false,
    "doAllowSubmissionUpdates" : true,
    "permissions" : [],
    "taggings" : [],
    "comments" : [
        ObjectId("5c6ec924a89be9751158ce0b")
    ],
    "selections" : [
        ObjectId("5c6ec919a89be9751158ce0a")
    ],
    "responses" : [
        ObjectId("5c6eca77a89be9751158ce0c"),
        ObjectId("5c9262343fd67ae4f1f924c3")
    ],
    "submissions" : [
        ObjectId("5c6ec5eba89be9751158ce07"),
        ObjectId("5c6ec5eba89be9751158ce08"),
        ObjectId("5c6ec5eba89be9751158ce09")
    ],
    "submissionSet" : {
        "description" : {
            "group" : {
                "name" : "MTG Period 1"
            },
            "puzzle" : {
                "title" : "Seven Congruent Rectangles"
            },
            "lastSubmissionDate" : "2019-02-21T15:38:19.875Z",
            "firstSubmissionDate" : "2019-02-21T15:38:19.872Z",
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
        },
    },
    "folders" : [],
    "editors" : [],
    "lastModifiedDate" : ISODate("2019-02-21T15:51:05.992Z"),
    "isTrashed" : false,
    "createDate" : ISODate("2019-02-21T15:12:36.795Z")
},

/* 3 */
{
    "_id" : ObjectId("5bb814d19885323f6d894974"),
    "mode" : "private",
    "organization" : ObjectId("5b4e4d5f808c7eebc9f9e82c"),
    "name" : "Summer's Org Problem Workspace",
    "owner" : ObjectId("5b4e4b48808c7eebc9f9e827"),
    "createdBy" : ObjectId("5b4e4b48808c7eebc9f9e827"),
    "lastModifiedBy" : ObjectId("5b4e4b48808c7eebc9f9e827"),
    "lastViewed" : ISODate("2018-10-06T01:50:09.797Z"),
    "doOnlyUpdateLastViewed" : false,
    "doAllowSubmissionUpdates" : true,
    "permissions" : [],
    "taggings" : [
        ObjectId("5bbb9d5dc2aa0a1696840cea")
    ],
    "comments" : [
        ObjectId("5bbb9d86c2aa0a1696840ceb")
    ],
    "selections" : [
        ObjectId("5bbb9d57c2aa0a1696840ce9")
    ],
    "responses" : [],
    "submissions" : [
        ObjectId("5bb814d19885323f6d894973")
    ],
    "submissionSet" : {
        "description" : {
            "pdSource" : "default",
            "firstSubmissionDate" : "2018-10-06T01:50:09.789Z",
            "lastSubmissionDate" : "2018-10-06T01:50:09.789Z",
            "puzzle" : {
                "title" : "Summer's Org Problem"
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
        ObjectId("5bb814d19885323f6d894975"),
        ObjectId("5bb814d19885323f6d894976"),
        ObjectId("5bb814d19885323f6d894977"),
        ObjectId("5bb814d19885323f6d894978")
    ],
    "editors" : [],
    "lastModifiedDate" : ISODate("2018-10-06T01:50:09.797Z"),
    "isTrashed" : false,
    "createDate" : ISODate("2018-10-06T01:44:45.159Z")
},

/* 4 */
{
    "_id" : ObjectId("53e36522b48b12793f000d3b"),
    "createdBy" : ObjectId("5b245760ac75842be3189525"),
    "mode" : "public",
    "name" : "ESI 2014 Wednesday Reflection / EnCoMPASS Summer Institute 2014",
    "owner" : ObjectId("529518daba1cd3d8c4013344"),
    "doOnlyUpdateLastViewed" : false,
    "doAllowSubmissionUpdates" : true,
    "permissions" : [
        {
            "user" : ObjectId("52964714e4bad7087700014e"),
            "global" : "approver",
            "folders" : 3,
            "comments" : 4,
            "selections" : 4,
            "feedback" : "approver",
            "submissions" : {
                "all" : true,
                "submissionIds" : []
            },
        },
        {
            "user" : ObjectId("52b05fae729e9ef59ba7eb4d"),
            "global" : "approver",
            "folders" : 3,
            "comments" : 4,
            "selections" : 4,
            "feedback" : "approver",
            "submissions" : {
                "all" : true,
                "submissionIds" : []
            },
        },
        {
            "user" : ObjectId("53d274a032f2863240001a71"),
            "global" : "approver",
            "folders" : 3,
            "comments" : 4,
            "selections" : 4,
            "feedback" : "approver",
            "submissions" : {
                "all" : true,
                "submissionIds" : []
            },
        },
        {
            "user" : ObjectId("52964653e4bad7087700014b"),
            "global" : "approver",
            "folders" : 3,
            "comments" : 4,
            "selections" : 4,
            "feedback" : "approver",
            "submissions" : {
                "all" : true,
                "submissionIds" : []
            },
        },
        {
            "user" : ObjectId("52a88def729e9ef59ba7eb4c"),
            "global" : "approver",
            "folders" : 3,
            "comments" : 4,
            "selections" : 4,
            "feedback" : "approver",
            "submissions" : {
                "all" : true,
                "submissionIds" : []
            },
        },
        {
            "user" : ObjectId("5370dc9c8f3e3d1f21000022"),
            "global" : "approver",
            "folders" : 3,
            "comments" : 4,
            "selections" : 4,
            "feedback" : "approver",
            "submissions" : {
                "all" : true,
                "submissionIds" : []
            },
        },
        {
            "user" : ObjectId("52a88ae2729e9ef59ba7eb4b"),
            "global" : "approver",
            "folders" : 3,
            "comments" : 4,
            "selections" : 4,
            "feedback" : "approver",
            "submissions" : {
                "all" : true,
                "submissionIds" : []
            },
        },
        {
            "user" : ObjectId("529646eae4bad7087700014d"),
            "global" : "approver",
            "folders" : 3,
            "comments" : 4,
            "selections" : 4,
            "feedback" : "approver",
            "submissions" : {
                "all" : true,
                "submissionIds" : []
            },
        },
        {
            "user" : ObjectId("53a355a932f2863240000026"),
            "global" : "approver",
            "folders" : 3,
            "comments" : 4,
            "selections" : 4,
            "feedback" : "approver",
            "submissions" : {
                "all" : true,
                "submissionIds" : []
            },
        },
        {
            "user" : ObjectId("5b245760ac75842be3189525"),
            "global" : "approver",
            "folders" : 3,
            "comments" : 4,
            "selections" : 4,
            "feedback" : "approver",
            "submissions" : {
                "all" : true,
                "submissionIds" : []
            },
        },
    ],
    "taggings" : [
        ObjectId("53e36ad3b48b12793f000d42"),
        ObjectId("53e36d2bb48b12793f000d46"),
        ObjectId("53e37478b48b12793f000d49"),
        ObjectId("53e37492b48b12793f000d4b"),
        ObjectId("53e374dcb48b12793f000d4f"),
        ObjectId("53e37529b48b12793f000d52"),
        ObjectId("53e37560b48b12793f000d55"),
        ObjectId("53e37583b48b12793f000d57"),
        ObjectId("53e37715b48b12793f00103d"),
        ObjectId("53e3772cb48b12793f00103f"),
        ObjectId("53e3777cb48b12793f001043"),
        ObjectId("53e379e4b48b12793f00104b"),
        ObjectId("53e37a87b48b12793f00104e"),
        ObjectId("53e37ab7b48b12793f001051"),
        ObjectId("53e37ad4b48b12793f001053"),
        ObjectId("53e37b0eb48b12793f001056"),
        ObjectId("53e37b3bb48b12793f001059"),
        ObjectId("53e37b57b48b12793f00105c"),
        ObjectId("53e37b8ab48b12793f00105f"),
        ObjectId("53e37ba1b48b12793f001061"),
        ObjectId("53e37be8b48b12793f001067"),
        ObjectId("53e37c1ab48b12793f001069"),
        ObjectId("53e37c69b48b12793f00106c"),
        ObjectId("53e37c9bb48b12793f00106f"),
        ObjectId("53e37cc1b48b12793f001071"),
        ObjectId("53e37cf5b48b12793f001073"),
        ObjectId("53e37d05b48b12793f001075"),
        ObjectId("53e37d27b48b12793f001077"),
        ObjectId("53e37d47b48b12793f001079"),
        ObjectId("53e37db1b48b12793f00107c"),
        ObjectId("53e37dc3b48b12793f00107e"),
        ObjectId("53e37dd7b48b12793f001080"),
        ObjectId("53e37deab48b12793f001082"),
        ObjectId("53e37df8b48b12793f001084"),
        ObjectId("53e37e07b48b12793f001086"),
        ObjectId("53e37e23b48b12793f001088"),
        ObjectId("53e37e33b48b12793f00108a"),
        ObjectId("53e37e4cb48b12793f00108d"),
        ObjectId("53e37ec4b48b12793f001090"),
        ObjectId("53e37eeeb48b12793f001093"),
        ObjectId("53e37efeb48b12793f001095"),
        ObjectId("53e37f19b48b12793f001098"),
        ObjectId("53e37f43b48b12793f00109b"),
        ObjectId("53e37f4eb48b12793f00109d"),
        ObjectId("53e37f9cb48b12793f00109f"),
        ObjectId("53e37faab48b12793f0010a1"),
        ObjectId("53e38959b48b12793f0010b8"),
        ObjectId("53e38971b48b12793f0010ba"),
        ObjectId("53e38a53b48b12793f0010cb"),
        ObjectId("53e38a6fb48b12793f0010cd"),
        ObjectId("53e38aa6b48b12793f0010d3"),
        ObjectId("53e38accb48b12793f0010d5"),
        ObjectId("53e38adbb48b12793f0010d8"),
        ObjectId("53e38e46b48b12793f0010db"),
        ObjectId("53e38e5eb48b12793f0010dd"),
        ObjectId("53e38ea3b48b12793f0010df"),
        ObjectId("53e38eb2b48b12793f0010e1"),
        ObjectId("53e38ec6b48b12793f0010e3"),
        ObjectId("53e38edcb48b12793f0010e5"),
        ObjectId("53e36a9bb48b12793f000d3f")
    ],
    "comments" : [
        ObjectId("53e37a4ab48b12793f00104c")
    ],
    "selections" : [
        ObjectId("53e36a96b48b12793f000d3e"),
        ObjectId("53e36ac7b48b12793f000d41"),
        ObjectId("53e36d13b48b12793f000d44"),
        ObjectId("53e3746fb48b12793f000d48"),
        ObjectId("53e3748db48b12793f000d4a"),
        ObjectId("53e374c7b48b12793f000d4d"),
        ObjectId("53e37525b48b12793f000d51"),
        ObjectId("53e3753eb48b12793f000d53"),
        ObjectId("53e37571b48b12793f000d56"),
        ObjectId("53e37710b48b12793f00103c"),
        ObjectId("53e37724b48b12793f00103e"),
        ObjectId("53e37769b48b12793f001042"),
        ObjectId("53e379dfb48b12793f00104a"),
        ObjectId("53e37a83b48b12793f00104d"),
        ObjectId("53e37ab0b48b12793f001050"),
        ObjectId("53e37aceb48b12793f001052"),
        ObjectId("53e37afbb48b12793f001055"),
        ObjectId("53e37b34b48b12793f001058"),
        ObjectId("53e37b52b48b12793f00105b"),
        ObjectId("53e37b80b48b12793f00105e"),
        ObjectId("53e37b99b48b12793f001060"),
        ObjectId("53e37be2b48b12793f001066"),
        ObjectId("53e37c15b48b12793f001068"),
        ObjectId("53e37c63b48b12793f00106b"),
        ObjectId("53e37c87b48b12793f00106e"),
        ObjectId("53e37cb2b48b12793f001070"),
        ObjectId("53e37cecb48b12793f001072"),
        ObjectId("53e37d00b48b12793f001074"),
        ObjectId("53e37d21b48b12793f001076"),
        ObjectId("53e37d43b48b12793f001078"),
        ObjectId("53e37daeb48b12793f00107b"),
        ObjectId("53e37db9b48b12793f00107d"),
        ObjectId("53e37dcfb48b12793f00107f"),
        ObjectId("53e37de2b48b12793f001081"),
        ObjectId("53e37df2b48b12793f001083"),
        ObjectId("53e37e02b48b12793f001085"),
        ObjectId("53e37e1cb48b12793f001087"),
        ObjectId("53e37e2eb48b12793f001089"),
        ObjectId("53e37e46b48b12793f00108c"),
        ObjectId("53e37eb4b48b12793f00108f"),
        ObjectId("53e37eebb48b12793f001092"),
        ObjectId("53e37ef7b48b12793f001094"),
        ObjectId("53e37f14b48b12793f001097"),
        ObjectId("53e37f3cb48b12793f00109a"),
        ObjectId("53e37f4bb48b12793f00109c"),
        ObjectId("53e37f97b48b12793f00109e"),
        ObjectId("53e37fa8b48b12793f0010a0"),
        ObjectId("53e3894fb48b12793f0010b4"),
        ObjectId("53e38965b48b12793f0010b9"),
        ObjectId("53e3898eb48b12793f0010bb"),
        ObjectId("53e38a6bb48b12793f0010cc"),
        ObjectId("53e38a77b48b12793f0010ce"),
        ObjectId("53e38ac3b48b12793f0010d4"),
        ObjectId("53e38ad0b48b12793f0010d6"),
        ObjectId("53e38ad7b48b12793f0010d7"),
        ObjectId("53e38e41b48b12793f0010da"),
        ObjectId("53e38e4cb48b12793f0010dc"),
        ObjectId("53e38e83b48b12793f0010de"),
        ObjectId("53e38eaab48b12793f0010e0"),
        ObjectId("53e38ec2b48b12793f0010e2"),
        ObjectId("53e38ec9b48b12793f0010e4")
    ],
    "responses" : [],
    "submissions" : [
        ObjectId("53e36522729e9ef59ba7f4dd"),
        ObjectId("53e36522729e9ef59ba7f4dc"),
        ObjectId("53e36522729e9ef59ba7f4da"),
        ObjectId("53e36522729e9ef59ba7f4d3"),
        ObjectId("53e36522729e9ef59ba7f4d2"),
        ObjectId("53e36522729e9ef59ba7f4d6"),
        ObjectId("53e36522729e9ef59ba7f4e1"),
        ObjectId("53e36522729e9ef59ba7f4d9"),
        ObjectId("53e36522729e9ef59ba7f4d4"),
        ObjectId("53e36522729e9ef59ba7f4db"),
        ObjectId("53e36522729e9ef59ba7f4d7"),
        ObjectId("53e36522729e9ef59ba7f4d5"),
        ObjectId("53e36522729e9ef59ba7f4e2"),
        ObjectId("53e36522729e9ef59ba7f4d8"),
        ObjectId("53e36522729e9ef59ba7f4df"),
        ObjectId("53e36522729e9ef59ba7f4e0"),
        ObjectId("53e36522729e9ef59ba7f4de")
    ],
    "folders" : [
        ObjectId("53e36a0bb48b12793f000d3c"),
        ObjectId("53e36a31b48b12793f000d3d"),
        ObjectId("53e36ab5b48b12793f000d40"),
        ObjectId("53e36cdbb48b12793f000d43"),
        ObjectId("53e36d26b48b12793f000d45"),
        ObjectId("53e37466b48b12793f000d47"),
        ObjectId("53e374adb48b12793f000d4c"),
        ObjectId("53e374d2b48b12793f000d4e"),
        ObjectId("53e3751ab48b12793f000d50"),
        ObjectId("53e37554b48b12793f000d54"),
        ObjectId("53e37758b48b12793f001040"),
        ObjectId("53e377b5b48b12793f001044"),
        ObjectId("53e37aa4b48b12793f00104f"),
        ObjectId("53e37af0b48b12793f001054"),
        ObjectId("53e37b28b48b12793f001057"),
        ObjectId("53e37b47b48b12793f00105a"),
        ObjectId("53e37b71b48b12793f00105d"),
        ObjectId("53e37c3eb48b12793f00106a"),
        ObjectId("53e37c7cb48b12793f00106d"),
        ObjectId("53e37da2b48b12793f00107a"),
        ObjectId("53e37e41b48b12793f00108b"),
        ObjectId("53e37e94b48b12793f00108e"),
        ObjectId("53e37edbb48b12793f001091"),
        ObjectId("53e37f0fb48b12793f001096"),
        ObjectId("53e37f38b48b12793f001099"),
        ObjectId("53e38a96b48b12793f0010d2"),
        ObjectId("53e38e28b48b12793f0010d9")
    ],
    "editors" : [
        ObjectId("52964714e4bad7087700014e"),
        ObjectId("52b05fae729e9ef59ba7eb4d"),
        ObjectId("53d274a032f2863240001a71"),
        ObjectId("52964653e4bad7087700014b"),
        ObjectId("52a88def729e9ef59ba7eb4c"),
        ObjectId("5370dc9c8f3e3d1f21000022"),
        ObjectId("52a88ae2729e9ef59ba7eb4b"),
        ObjectId("529646eae4bad7087700014d"),
        ObjectId("53a355a932f2863240000026"),
        ObjectId("5b245760ac75842be3189525")
    ],
    "lastModifiedDate" : ISODate("2019-07-01T17:23:27.838Z"),
    "isTrashed" : false,
    "createDate" : ISODate("2014-08-04T15:55:20.978Z")
},

/* 5 */
{
    "_id" : ObjectId("53e1156db48b12793f000442"),
    "createdBy" : ObjectId("5b245760ac75842be3189525"),
    "mode" : "private",
    "name" : "Feathers and Fur / Period 5 Basic Math",
    "owner" : ObjectId("5b245760ac75842be3189525"),
    "organization" : ObjectId("5b4a64a028e4b75919c28512"),
    "doOnlyUpdateLastViewed" : false,
    "doAllowSubmissionUpdates" : true,
    "permissions" : [
        {
            "user" : ObjectId("53a43f7c729e9ef59ba7ebf2"),
            "global" : "approver",
            "folders" : 3,
            "comments" : 4,
            "selections" : 4,
            "feedback" : "approver",
            "submissions" : {
                "all" : true,
                "submissionIds" : []
            },
        },
        {
            "user" : ObjectId("529518daba1cd3d8c4013344"),
            "global" : "approver",
            "folders" : 3,
            "comments" : 4,
            "selections" : 4,
            "feedback" : "approver",
            "submissions" : {
                "all" : true,
                "submissionIds" : []
            },
        },
        {
            "user" : ObjectId("5b245760ac75842be3189525"),
            "global" : "approver",
            "folders" : 3,
            "comments" : 4,
            "selections" : 4,
            "feedback" : "approver",
            "submissions" : {
                "all" : true,
                "submissionIds" : []
            },
        },
    ],
    "taggings" : [
        ObjectId("53e1194bb48b12793f000a62"),
        ObjectId("53e11b5eb48b12793f000abb"),
        ObjectId("53e11eceb48b12793f000b36"),
        ObjectId("53e11fa8b48b12793f000b48"),
        ObjectId("53e12250b48b12793f000b83"),
        ObjectId("53e12518b48b12793f000b92")
    ],
    "comments" : [
        ObjectId("53e12264b48b12793f000b84"),
        ObjectId("53e12507b48b12793f000b91"),
        ObjectId("5bbbba86a6a7ee1a9a5ebc75")
    ],
    "selections" : [
        ObjectId("53e11942b48b12793f000a5f"),
        ObjectId("53e11b38b48b12793f000ab7"),
        ObjectId("53e11ec4b48b12793f000b34"),
        ObjectId("53e11f20b48b12793f000b3a"),
        ObjectId("53e11f82b48b12793f000b44"),
        ObjectId("53e12158b48b12793f000b68"),
        ObjectId("53e12211b48b12793f000b7e"),
        ObjectId("53e1223cb48b12793f000b80"),
        ObjectId("53e1223eb48b12793f000b81"),
        ObjectId("53e12503b48b12793f000b90"),
        ObjectId("5bbbba75a6a7ee1a9a5ebc74")
    ],
    "responses" : [
        ObjectId("5b1aef7ae53645e768926123")
    ],
    "submissions" : [
        ObjectId("53e1156db48b12793f000418"),
        ObjectId("53e1156db48b12793f00042e"),
        ObjectId("53e1156db48b12793f000420"),
        ObjectId("53e1156db48b12793f000425"),
        ObjectId("53e1156db48b12793f000416"),
        ObjectId("53e1156db48b12793f000421"),
        ObjectId("53e1156db48b12793f000432"),
        ObjectId("53e1156db48b12793f000436"),
        ObjectId("53e1156db48b12793f00041a"),
        ObjectId("53e1156db48b12793f00042f"),
        ObjectId("53e1156db48b12793f00041e"),
        ObjectId("53e1156db48b12793f000430"),
        ObjectId("53e1156db48b12793f00043e"),
        ObjectId("53e1156db48b12793f000419"),
        ObjectId("53e1156db48b12793f00042d"),
        ObjectId("53e1156db48b12793f000438"),
        ObjectId("53e1156db48b12793f00041b"),
        ObjectId("53e1156db48b12793f000434"),
        ObjectId("53e1156db48b12793f000417"),
        ObjectId("53e1156db48b12793f000427"),
        ObjectId("53e1156db48b12793f000423"),
        ObjectId("53e1156db48b12793f000440"),
        ObjectId("53e1156db48b12793f000407"),
        ObjectId("53e1156db48b12793f000437"),
        ObjectId("53e1156db48b12793f000422"),
        ObjectId("53e1156db48b12793f000433"),
        ObjectId("53e1156db48b12793f000428"),
        ObjectId("53e1156db48b12793f00043d"),
        ObjectId("53e1156db48b12793f00042c"),
        ObjectId("53e1156db48b12793f00041d"),
        ObjectId("53e1156db48b12793f000439"),
        ObjectId("53e1156db48b12793f000414"),
        ObjectId("53e1156db48b12793f00041f"),
        ObjectId("53e1156db48b12793f00043a"),
        ObjectId("53e1156db48b12793f000415"),
        ObjectId("53e1156db48b12793f000426")
    ],
    "folders" : [
        ObjectId("53e11604b48b12793f0004ee"),
        ObjectId("53e1165eb48b12793f0005e7"),
        ObjectId("53e1166db48b12793f0005e9"),
        ObjectId("53e118f3b48b12793f000a41"),
        ObjectId("53e11b0ab48b12793f000ab1")
    ],
    "editors" : [
        ObjectId("53a43f7c729e9ef59ba7ebf2"),
        ObjectId("529518daba1cd3d8c4013344"),
        ObjectId("5b245760ac75842be3189525")
    ],
    "lastModifiedDate" : ISODate("2019-07-01T17:23:27.838Z"),
    "isTrashed" : false,
    "createDate" : ISODate("2014-08-04T15:55:20.978Z")
},

/* 6 */
{
    "_id" : ObjectId("5c6ebc4a9852e5710311d641"),
    "mode" : "private",
    "name" : "MTG Congruent Rectangles",
    "owner" : ObjectId("5c6eb45d9852e5710311d633"),
    "organization" : ObjectId("5c6df20a9466896b1c5d84af"),
    "createdBy" : ObjectId("5c6eb45d9852e5710311d633"),
    "lastModifiedBy" : ObjectId("5c6eb45d9852e5710311d633"),
    "lastViewed" : ISODate("2019-02-21T14:57:14.704Z"),
    "linkedAssignment" : null,
    "doOnlyUpdateLastViewed" : false,
    "doAllowSubmissionUpdates" : true,
    "permissions" : [
        {
            "user" : ObjectId("5c6f4075b1ccdf96abab26fe"),
            "global" : "indirectMentor",
            "folders" : 2,
            "selections" : 2,
            "comments" : 2,
            "feedback" : "authReq",
            "submissions" : {
                "all" : true,
                "userOnly" : false,
                "submissionIds" : []
            },
        },
        {
            "user" : ObjectId("5c6f4032b1ccdf96abab26fd"),
            "global" : "approver",
            "folders" : 3,
            "selections" : 4,
            "comments" : 4,
            "feedback" : "approver",
            "submissions" : {
                "all" : true,
                "userOnly" : false,
                "submissionIds" : []
            },
        },
    ],
    "taggings" : [],
    "comments" : [
        ObjectId("5c6f426fb1ccdf96abab2701")
    ],
    "selections" : [
        ObjectId("5c6f425bb1ccdf96abab2700")
    ],
    "responses" : [],
    "submissions" : [
        ObjectId("5c6ebc4a9852e5710311d63e"),
        ObjectId("5c6ebc4a9852e5710311d63f"),
        ObjectId("5c6ebc4a9852e5710311d640")
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
        },
    },
    "folders" : [],
    "editors" : [],
    "lastModifiedDate" : ISODate("2019-02-22T00:21:46.112Z"),
    "isTrashed" : false,
    "createDate" : ISODate("2019-02-21T13:00:49.171Z")
},

/* 7 */
{
    "_id" : ObjectId("5bec36958c73047613e2f34e"),
    "mode" : "private",
    "name" : "Summer's Test Workspace 1",
    "owner" : ObjectId("5b4e4b48808c7eebc9f9e827"),
    "organization" : ObjectId("5b4e4d5f808c7eebc9f9e82c"),
    "createdBy" : ObjectId("5b4e4b48808c7eebc9f9e827"),
    "lastModifiedBy" : ObjectId("5b7321ee59a672806ec903d5"),
    "lastViewed" : ISODate("2019-08-21T15:17:57.265Z"),
    "linkedAssignment" : ObjectId("5b91743a3da5efca74705773"),
    "doOnlyUpdateLastViewed" : false,
    "doAllowSubmissionUpdates" : true,
    "permissions" : [
        {
            "user" : ObjectId("5b99146e25b620610ceead75"),
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
            "user" : ObjectId("5b9149c22ecaf7c30dd47490"),
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
            "user" : ObjectId("5b1e7bf9a5d2157ef4c911a6"),
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
            "user" : ObjectId("5b7321ee59a672806ec903d5"),
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
            "user" : ObjectId("5b914a102ecaf7c30dd47492"),
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
        ObjectId("5bec37f48c73047613e2f367"),
        ObjectId("5bec38018c73047613e2f368"),
        ObjectId("5bec38338c73047613e2f36b"),
        ObjectId("5bec386a8c73047613e2f36d")
    ],
    "comments" : [
        ObjectId("5bec375d8c73047613e2f35e"),
        ObjectId("5bec37708c73047613e2f35f"),
        ObjectId("5bec37a08c73047613e2f364"),
        ObjectId("5bec37e38c73047613e2f366")
    ],
    "selections" : [
        ObjectId("5bec373d8c73047613e2f35c"),
        ObjectId("5bec37408c73047613e2f35d"),
        ObjectId("5bec37838c73047613e2f361"),
        ObjectId("5bec37a78c73047613e2f365")
    ],
    "responses" : [
        ObjectId("5bec6497aa4a927d50cd5b9b"),
        ObjectId("5bec64f7aa4a927d50cd5ba0"),
        ObjectId("5c87ddf1a2fb212cd72de56a"),
        ObjectId("5c87de03a2fb212cd72de56c")
    ],
    "submissions" : [
        ObjectId("5bec36958c73047613e2f34c"),
        ObjectId("5bec36958c73047613e2f34d")
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
        ObjectId("5bec36c58c73047613e2f352"),
        ObjectId("5bec36ca8c73047613e2f353"),
        ObjectId("5bec36cd8c73047613e2f354"),
        ObjectId("5bec36dd8c73047613e2f355"),
        ObjectId("5bec36e98c73047613e2f356"),
        ObjectId("5bec36f78c73047613e2f357"),
        ObjectId("5bec37048c73047613e2f358"),
        ObjectId("5bec37108c73047613e2f359"),
        ObjectId("5bec371f8c73047613e2f35a")
    ],
    "editors" : [],
    "lastModifiedDate" : ISODate("2019-03-12T16:27:47.826Z"),
    "isTrashed" : false,
    "createDate" : ISODate("2018-11-14T14:30:46.526Z"),
    "childWorkspaces" : [],
    "workspaceType" : "markup"
},

/* 8 */
{
    "_id" : ObjectId("5d5d60ef4f217a59dfbbdeeb"),
    "sourceWorkspace" : ObjectId("5bec36958c73047613e2f34e"),
    "name" : "tracyc: Summer's Test Workspace 1",
    "owner" : ObjectId("5b914a102ecaf7c30dd47492"),
    "mode" : "private",
    "createdBy" : ObjectId("5b4e4b48808c7eebc9f9e827"),
    "organization" : ObjectId("5b4e4d5f808c7eebc9f9e82c"),
    "childWorkspaces" : [],
    "workspaceType" : "markup",
    "doOnlyUpdateLastViewed" : false,
    "doAllowSubmissionUpdates" : true,
    "permissions" : [],
    "taggings" : [
        ObjectId("5d5d63054f217a59dfbbdefa"),
        ObjectId("5d5d634c4f217a59dfbbdefd")
    ],
    "comments" : [
        ObjectId("5d5d62f84f217a59dfbbdef9"),
        ObjectId("5d5d63384f217a59dfbbdefc")
    ],
    "selections" : [
        ObjectId("5d5d62e64f217a59dfbbdef7"),
        ObjectId("5d5d62e94f217a59dfbbdef8"),
        ObjectId("5d5d631c4f217a59dfbbdefb")
    ],
    "responses" : [
        ObjectId("5d5d635b4f217a59dfbbdefe")
    ],
    "submissions" : [
        ObjectId("5d5d60ef4f217a59dfbbdeec"),
        ObjectId("5d5d60ef4f217a59dfbbdeed")
    ],
    "submissionSet" : {
        "description" : {
            "group" : {
                "name" : "Summer's Algebra 2 1st Period"
            },
            "puzzle" : {
                "title" : "Summer's Private Problem"
            },
            "lastSubmissionDate" : ISODate("2019-08-21T15:19:11.856Z"),
            "firstSubmissionDate" : ISODate("2019-08-21T15:19:11.854Z"),
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
        },
    },
    "folders" : [
        ObjectId("5d5d60ef4f217a59dfbbdef0"),
        ObjectId("5d5d60ef4f217a59dfbbdef1"),
        ObjectId("5d5d60ef4f217a59dfbbdef6"),
        ObjectId("5d5d60ef4f217a59dfbbdef5"),
        ObjectId("5d5d60ef4f217a59dfbbdef4"),
        ObjectId("5d5d60ef4f217a59dfbbdeef"),
        ObjectId("5d5d60ef4f217a59dfbbdef3"),
        ObjectId("5d5d60ef4f217a59dfbbdeee"),
        ObjectId("5d5d60ef4f217a59dfbbdef2")
    ],
    "editors" : [],
    "lastModifiedDate" : ISODate("2019-08-21T15:35:49.971Z"),
    "isTrashed" : false,
    "createDate" : ISODate("2019-08-21T15:17:11.562Z"),
    "lastViewed" : ISODate("2019-08-21T15:29:26.693Z"),
    "lastModifiedBy" : ObjectId("5b914a102ecaf7c30dd47492"),
    "linkedAssignment" : ObjectId("5b91743a3da5efca74705773")
},
];