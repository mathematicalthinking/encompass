var Seeder = require('mongoose-data-seed').Seeder;
var FolderSet = require('../server/datasource/schemas').FolderSet;

var data = [
  {
    "_id" : "5bec409176124a776f2ff00e",
    "name" : "Test Nested Folder Set",
    "privacySetting" : "O",
    "organization": "5b4e4d5f808c7eebc9f9e82c",
    "createdBy" : "5b4e4b48808c7eebc9f9e827",
    "lastModifiedBy" : "5b4e4b48808c7eebc9f9e827",
    "folders" : [
        {
            "name" : "Top Level 1",
            "weight" : 0,
            "children" : [
                {
                    "name" : "2nd Level 1",
                    "weight" : 0,
                    "children" : [
                        {
                            "name" : "3rd Level 1",
                            "weight" : 0,
                            "children" : []
                        }
                    ]
                },
                {
                    "name" : "2nd Level 2",
                    "weight" : 0,
                    "children" : []
                }
            ]
        },
        {
            "name" : "Top Level 2",
            "weight" : 0,
            "children" : [
                {
                    "name" : "2nd Level 3",
                    "weight" : 0,
                    "children" : [
                        {
                            "name" : "3rd Level 2",
                            "weight" : 0,
                            "children" : [
                                {
                                    "name" : "4th Level 1",
                                    "weight" : 0,
                                    "children" : []
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "name" : "Top Level 3",
            "weight" : 0,
            "children" : []
        }
    ],
    "lastModifiedDate" : "2018-11-14T15:34:26.904Z",
    "isTrashed" : false,
    "createDate" : "2018-11-14T15:34:26.904Z"
},

{"_id" : "5be5c5b1528e311460c0dd9e",
"name" : "Paul's Private Folder Set",
"privacySetting" : "M",
"createdBy" : "5b7321ee59a672806ec903d5",
"lastModifiedBy" : "5b7321ee59a672806ec903d5",
"organization": "5b4a64a028e4b75919c28512",
"folders" : [
    {
        "name" : "Reasonable",
        "weight" : 100,
        "children" : [
            {
                "name" : "Correct",
                "weight" : 101,
                "children" : []
            },
            {
                "name" : "Incorrect",
                "weight" : 102,
                "children" : []
            }
        ]
    },
    {
        "name" : "Ridiculous",
        "weight" : 200,
        "children" : []
    }
],
"lastModifiedDate" :"2018-12-09T17:36:47.506Z",
"isTrashed" : false,
"createDate" : "2018-12-09T17:36:47.506Z"},
{
    "_id" : "5c1ba70fcdc05df4b5edc60c",
    "name" : "Rick's Public Folder Set",
    "privacySetting" : "E",
    "createdBy" : "5b245760ac75842be3189525",
    "lastModifiedBy" : "5b245760ac75842be3189525",
    "folders" : [
        {
            "name" : "Interesting",
            "weight" : 0,
            "children" : []
        },
        {
            "name" : "More Info Needed",
            "weight" : 0,
            "children" : []
        },
        {
            "name" : "Guess and Check",
            "weight" : 0,
            "children" : []
        }
    ],
    "organization": "5b4a64a028e4b75919c28512",
    "lastModifiedDate" : "2018-12-19T20:51:34.529Z",
    "isTrashed" : false,
    "createDate" : "2018-12-19T20:51:34.529Z"
}
];


var FolderSetsSeeder = Seeder.extend({
  shouldRun: function () {
    return FolderSet.count().exec().then(count => count === 0);
  },
  run: function () {
    return FolderSet.create(data);
  }
});

module.exports = FolderSetsSeeder;
