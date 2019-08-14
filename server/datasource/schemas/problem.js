const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

/**
  * @public
  * @class Problem
  * @description Problems are submitted by teachers, we allow image uploads
  * @todo Allow images to be used as supplment or entire problem?
  */
var ProblemSchema = new Schema({
  //== Shared properties (Because Mongoose doesn't support schema inheritance)
  createdBy: { type: ObjectId, ref: 'User', required: true },
  createDate: { type: Date, 'default': Date.now() },
  isTrashed: { type: Boolean, 'default': false },
  lastModifiedBy: { type: ObjectId, ref: 'User' },
  lastModifiedDate: { type: Date, 'default': Date.now() },
  //====
  title: { type: String, required: true, trim: true },
  puzzleId: { type: Number },  // old POWs converted puzzle id
  text: { type: String },
  imageUrl: { type: String },
  sourceUrl: { type: String },
  image: { type: ObjectId, ref: 'Image' },
  additionalInfo: { type: String },
  origin: { type: ObjectId, ref: 'Problem' },
  modifiedBy: { type: ObjectId, ref: 'User' },
  privacySetting: { type: String, enum: ['M', 'O', 'E'] },
  copyrightNotice: { type: String },
  sharingAuth: { type: String },
  author: { type: String },
  organization: { type: ObjectId, ref: 'Organization' },
  categories: [{ type: ObjectId, ref: 'Category' }],
  keywords: [{ type: String }],
  isUsed: { type: Boolean, 'default': false },
  status: { type: String, enum: ['approved', 'pending', 'flagged'] },
  flagReason: {
    flaggedBy: { type: ObjectId, ref: 'User' },
    reason: { type: String },
    flaggedDate: { type: Date, },
  },
  contexts: [{type: String, enum: [
    'PoW', 'VMT'
  ]}],
}, { versionKey: false });

module.exports.Problem = mongoose.model('Problem', ProblemSchema);
