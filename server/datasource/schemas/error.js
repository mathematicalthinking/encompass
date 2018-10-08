const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

/**
  * @public
  * @class Error
  * @description We store errors from the frontend
  */
var ErrorSchema = new Schema({
//== To be depricated or modified
//== Shared properties (Because Monggose doesn't support schema inheritance)
    createdBy:  {type:ObjectId, ref:'User'},
    createDate: {type:Date,    'default':Date.now()},
    isTrashed:  {type:Boolean, 'default': false},
//====
    type:       {type:String},
    message:    {type:String},
    stack:      {type:String},
    object:     {type:Object}
  }, {versionKey: false});

module.exports.Error = mongoose.model('Error', ErrorSchema);
