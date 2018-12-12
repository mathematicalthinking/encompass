var Seeder = require('mongoose-data-seed').Seeder;
var FolderSet = require('../server/datasource/schemas').FolderSet;

var data = [
  {
    "_id" : "5bec409176124a776f2ff00e",
    "name" : "Test Nested Folder Set",
    "privacySetting" : "E",
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
