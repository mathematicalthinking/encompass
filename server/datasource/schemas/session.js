var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  _ = require('underscore'),
  ObjectId = Schema.ObjectId;

/**
  * @public
  * @class Session
  * @description Sessions are text documents based on selections and comments
  */
var SessionSchema = new Schema({
  //== Shared properties (Because Mongoose doesn't support schema inheritance)
  createdBy: { type: ObjectId, ref: 'User' },
  createDate: { type: Date, 'default': Date.now() },
  isTrashed: { type: Boolean, 'default': false },
  //====
  _id: String,
  // session: {
  //   passport: {
  //     user: String
  //   }
  // },
  expires: Date
}, { versionKey: false });

/**
  * ## Pre-Validation
  * Before saving we must verify (synchonously) that:
  */
// SessionSchema.pre('save', function (next) {
//   var toObjectId = function (elem, ind, arr) {
//     if (!(elem instanceof mongoose.Types.ObjectId) && !_.isUndefined(elem)) {
//       arr[ind] = mongoose.Types.ObjectId(elem);
//     }
//   };

//   /** + Every ID reference in our object is properly typed.
//     *   This needs to be done BEFORE any other operation so
//     *   that native lookups and updates don't fail.
//     */
//   try {
//     this.selections.forEach(toObjectId);
//     this.comments.forEach(toObjectId);
//     next();
//   }
//   catch (err) {
//     next(new Error(err.message));
//   }
// });

/**
  * ## Post-Validation
  * After saving we must ensure (synchonously) that:
  */
// SessionSchema.post('save', function (Session) {
//   var update = { $addToSet: { 'Sessions': Session } };
//   if (Session.isTrashed) {
//     var SessionIdObj = mongoose.Types.ObjectId(Session._id);
//     /* + If deleted, all references are also deleted */
//     update = { $pull: { 'Sessions': SessionIdObj } };
//   }

//   if (Session.workspace) {
//     mongoose.models.Workspace.update({ '_id': Session.workspace },
//       update,
//       function (err, affected, result) {
//         if (err) {
//           throw new Error(err.message);
//         }
//       });
//   }

//   if (Session.submission) {
//     mongoose.models.Submission.update({ '_id': Session.submission },
//       update,
//       function (err, affected, result) {
//         if (err) {
//           throw new Error(err.message);
//         }
//       });
//   }

// });

module.exports.Session = mongoose.model('Session', SessionSchema);
