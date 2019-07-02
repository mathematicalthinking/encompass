const { ObjectId, ISODate } = require('./utils');

module.exports = [
/* 1 */
{
  "_id" : ObjectId("5b1e7b2aa5d2157ef4c91108"),
  "sectionId" : 26916,
  "name" : "Drexel University",
  "organization" : ObjectId("5b4a64a028e4b75919c28512"),
  "createdBy" : ObjectId("5b245760ac75842be3189525"),
  "assignments" : [],
  "students" : [
      ObjectId("5b368afdca1375a94fabde39")
  ],
  "teachers" : [
      ObjectId("5b1e7bf9a5d2157ef4c911a6")
  ],
  "lastModifiedDate" : ISODate("2019-07-01T17:23:27.859Z"),
  "isTrashed" : false,
  "createDate" : ISODate("2019-07-01T17:23:27.859Z")
},

/* 2 */
{
  "_id" : ObjectId("5b913e723add43b868ae9804"),
  "name" : "Morty's Math 101",
  "sectionPassword" : null,
  "createdBy" : ObjectId("5b245841ac75842be3189526"),
  "lastModifiedBy" : null,
  "organization" : ObjectId("5b4a64a028e4b75919c28512"),
  "assignments" : [
      ObjectId("5b9146a83add43b868ae9809")
  ],
  "students" : [
      ObjectId("5b913ea33add43b868ae9805"),
      ObjectId("5b913eaf3add43b868ae9806"),
      ObjectId("5b913ebe3add43b868ae9807")
  ],
  "teachers" : [
      ObjectId("5b245841ac75842be3189526")
  ],
  "lastModifiedDate" : null,
  "isTrashed" : false,
  "createDate" : ISODate("2018-09-06T14:49:22.982Z")
},

/* 3 */
{
  "_id" : ObjectId("5b9149a32ecaf7c30dd4748f"),
  "name" : "Summer's Algebra 2 1st Period",
  "sectionPassword" : null,
  "createdBy" : ObjectId("5b4e4b48808c7eebc9f9e827"),
  "lastModifiedBy" : null,
  "organization" : ObjectId("5b4e4d5f808c7eebc9f9e82c"),
  "assignments" : [
      ObjectId("5b91743a3da5efca74705773")
  ],
  "students" : [
      ObjectId("5b9149c22ecaf7c30dd47490"),
      ObjectId("5b9149f52ecaf7c30dd47491"),
      ObjectId("5b914a102ecaf7c30dd47492"),
      ObjectId("5b99146e25b620610ceead75"),
      ObjectId("5b4e5180a2eed65e2434d475")
  ],
  "teachers" : [
      ObjectId("5b4e4b48808c7eebc9f9e827"),
      ObjectId("5b914a802ecaf7c30dd47493")
  ],
  "lastModifiedDate" : null,
  "isTrashed" : false,
  "createDate" : ISODate("2018-09-06T15:37:07.827Z")
},

/* 4 */
{
  "_id" : ObjectId("5bbdfaaaecd6e597fd8d3d42"),
  "createdBy" : ObjectId("5b4e4b48808c7eebc9f9e827"),
  "assignments" : [],
  "students" : [],
  "teachers" : [],
  "lastModifiedDate" : ISODate("2019-07-01T17:23:27.859Z"),
  "isTrashed" : true,
  "createDate" : ISODate("2019-07-01T17:23:27.859Z")
},

/* 5 */
{
  "_id" : ObjectId("5c6eb4d49852e5710311d637"),
  "name" : "MTG Period 1",
  "sectionPassword" : null,
  "createdBy" : ObjectId("5c6eb45d9852e5710311d633"),
  "lastModifiedBy" : null,
  "organization" : ObjectId("5c6df20a9466896b1c5d84af"),
  "assignments" : [
      ObjectId("5c6eb5199852e5710311d638")
  ],
  "students" : [
      ObjectId("5c6eb49c9852e5710311d634"),
      ObjectId("5c6eb4ac9852e5710311d635"),
      ObjectId("5c6eb4c19852e5710311d636")
  ],
  "teachers" : [
      ObjectId("5c6eb45d9852e5710311d633")
  ],
  "lastModifiedDate" : null,
  "isTrashed" : false,
  "createDate" : ISODate("2019-02-21T14:25:24.711Z")
},
];