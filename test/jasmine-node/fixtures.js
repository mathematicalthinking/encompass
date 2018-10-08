/**
  * # Test Fixtures
  * @description This is the mock data to be used in REST API tests
  * @authors Damola Mabogunje <damola@mathforum.org>
  * @since 1.0.1
  */

var mongoose = require('mongoose');

module.exports = {
  users: {
    guest: {
      _id: 1,
      username: 'anon',
      name: 'Guest',
      isGuest: true
    },
    user: {
      _id: mongoose.Types.ObjectId('5345cdf441cf92283b000001').toString(),
      username: 'user_test',
      name: 'Test User',
      isAuthorized: true,
      key:'8040b627-0d16-404e-93d6-0fdbaccdc084',
      isTrashed: false,
      createDate: new Date('2014-01-12').toISOString()
    },
    admin: {
      _id: mongoose.Types.ObjectId('5345cdf441cf92283b000002').toString(),
      username: 'admin_test',
      name: 'Test Admin',
      isAuthorized: true,
      isAdmin: true,
      key:'8040b627-0d16-404e-93d6-0fdbaccdc085',
      isTrashed: false,
      createDate: new Date('2014-01-12').toISOString()
    }
  }
};

module.exports.submissions = {
  mine: {
    _id: mongoose.Types.ObjectId('5345cdf441cf92283b000003').toString(),
    powId: 1,
    shortAnswer: "short",
    longAnswer: "long",
    createdBy: module.exports.users.admin._id,
    workspaces: [],
    comments: [],
    selections: [],
    isTrashed: false,
    createDate: new Date('2014-01-12').toISOString()
  },
  pd: {
    _id: mongoose.Types.ObjectId('5345cdf441cf92283b000004').toString(),
    powId: 2,
    shortAnswer: "short",
    longAnswer: "long",
    createdBy: module.exports.users.user._id,
    isTrashed: false,
    createDate: new Date('2014-01-12').toISOString()
  }
};

