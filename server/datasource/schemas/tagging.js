var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    Workspace = require('./workspace'),
    Selection = require('./selection'),
    Folder = require('./folder');

/**
  * @public
  * @class Tagging
  * @description A tagging is a one-to-one mapping between a Selection and a Folder
  * @see [Selection](./selection.html), [Folder](./folder.html)
  */
var TaggingSchema = new Schema({
//== Shared properties (Because Monggose doesn't support schema inheritance)
    createdBy: {type:ObjectId, ref:'User'},
    createDate: {type:Date, 'default':Date.now()},
    isTrashed: {type: Boolean, 'default': false},
//==
    workspace: {type:ObjectId, ref:'Workspace', required: true},
    selection: {type:ObjectId, ref:'Selection', required:true},
    folder: {type:ObjectId, ref:'Folder', required:true}
  }, {
    versionKey: false,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  });

/**
  * ## Pre-Validation
  */
TaggingSchema.pre('validate', true, function (next, done) {
  mongoose.models.Selection.findById(this.selection)
    .lean()
    .exec(function (err, found) {
      if (err) { next(new Error(err.message)); } 
      else {
        if(!this.workspace) {
          this.workspace = found.workspace;
        }

        next(); 
      }
      done();
    });
});
 
/*
  * ## Pre-Save
  * Before saving we must verify (asynchonously) that:
  */ 
/* + The Selection exists */
TaggingSchema.pre('save', true, function (next, done) {
  mongoose.models.Selection.findById(this.selection)
    .lean()
    .exec(function (err, found) {
      if (err) { next(new Error(err.message)); } 
      else { 
        next(); 
      }
      done();
    });
});

/* + The Folder exists */
TaggingSchema.pre('save', true, function (next, done) {
  mongoose.models.Folder.findById(this.folder)
    .lean()
    .exec(function (err, found) {
      if (err) { next(new Error(err.message)); } 
      else { next(); }
      done();
    });
});

/* + The Workspace exists */
TaggingSchema.pre('save', true, function (next, done) {
  mongoose.models.Workspace.findById(this.workspace)
    .lean()
    .exec(function (err, found) {
      if (err) { next(new Error(err.message)); } 
      else { next(); }
      done();
    });
});

/**
  * ## Post-Validation
  * After saving we must ensure (synchronously) that:
  */ 
TaggingSchema.post('save', function (tagging) {
  /* + If deleted, all references are updated */
  if( tagging.isTrashed ) {

    var taggingIdObj = mongoose.Types.ObjectId( tagging._id );
    mongoose.models.Workspace.update({'taggings': tagging.workspace},
      {$pull: {"taggings": taggingIdObj}},
      function(err, affected, result) {
        if (err) { throw new Error(err.message); }
      });
    
    mongoose.models.Folder.update({'_id': tagging.folder},
      {$pull: {"taggings": taggingIdObj}},
      function(err, affected, result) {
        if (err) { throw new Error(err.message); }
      });

    mongoose.models.Selection.update({'_id': tagging.selection},
      {$pull: {"taggings": taggingIdObj}},
      function(err, affected, result) {
        if (err) { throw new Error(err.message); }
      });
  }
  else { /* If added, references are added everywhere necessary */

    mongoose.models.Workspace.update({'taggings': tagging.workspace},
      {$addToSet: {"taggings": tagging}},
      function(err, affected, result) {
        if (err) { throw new Error(err.message); }
      });

    mongoose.models.Folder.update({'_id': tagging.folder},
      {$addToSet: {"taggings": tagging}},
      function(err, affected, result) {
        if (err) { throw new Error(err.message); }
      });

    mongoose.models.Selection.update({'_id': tagging.selection},
      {$addToSet: {"taggings": tagging}},
      function(err, affected, result) {
        if (err) { throw new Error(err.message); }
      });
  }
});

module.exports.Tagging = mongoose.model('Tagging', TaggingSchema);
