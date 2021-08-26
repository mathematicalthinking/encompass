const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

/**
 * @public
 * @class SectionGroup
 * @description Groups belong to a Section and can contain many students
 */

const GroupSchema = new Schema({
  createdBy: { type: ObjectId, ref: 'User' },
  createDate: { type: Date, default: Date.now() },
  isTrashed: { type: Boolean, default: false },
  lastModifiedBy: { type: ObjectId, ref: 'User' },
  lastModifiedDate: { type: Date, default: Date.now() },
  name: { type: 'string' },
  section: { type: ObjectId, ref: 'Section' },
  students: [{ type: ObjectId, ref: 'User' }],
});

module.exports.Group = mongoose.model('Group', GroupSchema);
