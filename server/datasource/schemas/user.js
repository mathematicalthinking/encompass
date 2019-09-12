const mongoose = require('mongoose');
const util = require('util');
const _ = require('underscore');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

/**
  * @public
  * @class Log
  * @description A single user history log of an event.
  *              Used as a subdocument of the user model
*/
var Log = new Schema({
  creator: { type: String, default: "system" },
  time: { type: Date, default: Date.now() },
  event: { type: String, required: true },
  duration: { type: Number, default: 0 },
  isError: { type: Boolean, default: false }
},
  {
    versionKey: false,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  });

Log.virtual('message').get(function () {
  var success = (this.isError) ? "unsuccessfully" : "successfully";
  var msg = "User `%s` performed %s on %s %s. It took %s ms";

  return util.format(msg, this.creator, this.event, this.time, success, this.duration);
});

/**
  * @public
  * @class User
  * @class User
  * @description EnCoMPASS user schema
  * @todo We need to decide how to handle different user types/roles
*/
var UserSchema = new Schema({
  //== Shared properties (Because Monggose doesn't support schema inheritance)
  createdBy: { type: ObjectId, ref: 'User' },
  createDate: { type: Date, 'default': Date.now() },
  isTrashed: { type: Boolean, 'default': false },
  lastModifiedBy: { type: ObjectId, ref: 'User' },
  lastModifiedDate: { type: Date, 'default': Date.now() },
  //====
  /* + The username is the mfapps username */
  username: { type: String, unique: true, required: true },
  accountType: { type: String, enum: ['A', 'P', 'T', 'S'], required: true },
  isAdmin: { type: Boolean, select: false }, // deprecated
  /* + Are they otherwise authorized for EnCoMPASS */
  isAuthorized: { type: Boolean, default: false },
  authorizedBy: { type: ObjectId, ref: 'User' },

  // 'student' or 'teacher' - only used by teacher accounts to determine if they are in teacher mode or student mode
  actingRole: { type: String, enum: ['teacher', 'student'] },
  name: { type: String },
  email: { type: String },
  avatar: { type: String },
  googleId: { type: String },
  isEmailConfirmed: { type: Boolean, default: false },
  organization: { type: ObjectId, ref: 'Organization' },
  organizationRequest: { type: String },
  location: { type: String },
  requestReason: { type: String },
  // We only use google for external auth, we can use these fields if we use more OAuths
  // authSource: String,
  // authUserId: String,
  sections: [{ sectionId: { type: ObjectId, ref: 'Section' }, role: String, _id: false}],
  answers: [{ type: ObjectId, ref: 'Answer' }],
  // Migrating from assignments to answers, keeping this in for tests - change apiTest for assinment to answer
  assignments: [{type: ObjectId, ref: 'Assignment'}],

  // workspaces where user has been added as a collaborator
  // only used for non-admins because admins can access any workspace by default
  collabWorkspaces: [{ type: ObjectId, ref: 'Workspace' }],
  hiddenWorkspaces: [{ type: ObjectId, ref: 'Workspace' }],
  notifications: [ { type: ObjectId, ref: 'Notification' } ],
  socketId: { type: String },
  seenTour: { type: Date },
  lastSeen: { type: Date },
  firstName: {type: String },
  lastName: {type: String },
  history: [Log], // currently not working,
  ssoId: {type: ObjectId},
  doForcePasswordChange: { type: Boolean, default: false },
  confirmEmailDate: { type: Date },
},
{
  versionKey: false,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

UserSchema.virtual('lastLogin')
  .get(function () {
    var logins = _.where(this.history, { event: 'Login' });
    var lastLogin = logins.slice(-1)[0];

    return (lastLogin) ? lastLogin.time : null;
  })
  .set(function (time) {
    this.history.push({
      event: 'Login',
      time: time,
    });
  });


UserSchema.virtual('lastImported')
  .get(function () {
    var imports = _.where(this.history, { event: 'PoW Import' });
    var lastImport = imports.slice(-1)[0];

    return (lastImport) ? lastImport.time : null;
  })
  .set(function (time) {
    this.history.push({
      event: 'PoW Import',
      time: time,
    });
  });

module.exports.User = mongoose.model('User', UserSchema);
