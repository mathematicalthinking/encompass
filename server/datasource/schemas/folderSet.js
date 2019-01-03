const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

var folderObjectSchema = new Schema({
  name: { type: String },
  weight: { type: Number },
}, { _id: false, versionKey: false });

folderObjectSchema.add({
  children: [{ type: folderObjectSchema }]
});

var FolderSetSchema = new Schema({
  createdBy: { type: ObjectId, ref: 'User' },
  createDate: { type: Date, 'default': Date.now() },
  isTrashed: { type: Boolean, 'default': false },
  lastModifiedBy: { type: ObjectId, ref: 'User' },
  lastModifiedDate: { type: Date, 'default': Date.now() },
//====

name: { type: String },
privacySetting: {type: String, enum: ['M', 'O', 'E'] },
folders: [{type: folderObjectSchema }],
organization: { type: ObjectId, ref: 'Organization'},
}, {versionKey: false});



module.exports.FolderSet = mongoose.model('FolderSet', FolderSetSchema);
