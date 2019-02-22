var Seeder = require('mongoose-data-seed').Seeder;
var Notification = require('../server/datasource/schemas').Notification;

var data = [
//   {
//     "_id" : "5c6eca77a89be9751158ce0d",
//     "createdBy" : "5c6eb49c9852e5710311d634",
//     "recipient" : "5c6eb4ac9852e5710311d635",
//     "response" : "5c6eca77a89be9751158ce0c",
//     "primaryRecordType" : "response",
//     "notificationType" : "newMentorReply",
//     "text" : "You have received a new mentor reply.",
//     "wasSeen" : false,
//     "lastModifiedDate" : "2019-02-21T15:12:36.830Z",
//     "isTrashed" : false,
//     "createDate" : "2019-02-21T15:12:36.830Z"
// }
];

var NotificationsSeeder = Seeder.extend({
  shouldRun: function () {
    return Notification.count().exec().then(count => count === 0);
  },
  run: function () {
    return Notification.create(data);
  }
});

module.exports = NotificationsSeeder;