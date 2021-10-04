
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const User = require('../schemas/user').User;


/**
  * @public
  * @class Organization
  * @description Organizations are used to categorize problems
  * @todo Create or use external organizations for problem?
  */
var OrganizationSchema = new Schema({
  //== Shared properties (Because Mongoose doesn't support schema inheritance)
  createdBy: { type: ObjectId, ref: 'User', required: true },
  createDate: { type: Date, 'default': Date.now() },
  isTrashed: { type: Boolean, 'default': false },
  lastModifiedBy: { type: ObjectId, ref: 'User' },
  lastModifiedDate: { type: Date, 'default': Date.now() },
  //====
  name: { type: String, required: true },
  recommendedProblems: [{type: ObjectId, ref: 'Problem'}]
}, { versionKey: false });

OrganizationSchema.methods.getMemberCount = function(id) {
  return User.find({isTrashed: false, organization: id}).lean().exec().then((users) => {
    return users.length;
  })
  .catch((err) => {
    console.error('err org member count', err);
    console.trace();
    return new Error(err);
  });
};

/**
  * ## Pre-Validation
  * Before saving we must verify (synchonously) that:
  */
// OrganizationSchema.pre('save', function (next) {
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
// OrganizationSchema.post('save', function (Organization) {
//   var update = { $addToSet: { 'Organizations': Organization } };
//   if (Organization.isTrashed) {
//     var OrganizationIdObj = mongoose.Types.ObjectId(Organization._id);
//     /* + If deleted, all references are also deleted */
//     update = { $pull: { 'Organizations': OrganizationIdObj } };
//   }

//   if (Organization.workspace) {
//     mongoose.models.Workspace.update({ '_id': Organization.workspace },
//       update,
//       function (err, affected, result) {
//         if (err) {
//           throw new Error(err.message);
//         }
//       });
//   }

//   if (Organization.submission) {
//     mongoose.models.Submission.update({ '_id': Organization.submission },
//       update,
//       function (err, affected, result) {
//         if (err) {
//           throw new Error(err.message);
//         }
//       });
//   }

// });

module.exports.Organization = mongoose.model('Organization', OrganizationSchema);
