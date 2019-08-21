const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

/**
  * @public
  * @class Tagging
  * @description A tagging is a one-to-one mapping between a Selection and a Folder
  * @see [Selection](./selection.html), [Folder](./folder.html)
  */
var TaggingSchema = new Schema({
//== Shared properties (Because Monggose doesn't support schema inheritance)
    createdBy: { type: ObjectId, ref: 'User' },
    createDate: { type: Date, 'default': Date.now() },
    isTrashed: { type: Boolean, 'default': false },
    lastModifiedBy: { type: ObjectId, ref: 'User' },
    lastModifiedDate: { type: Date, 'default': Date.now() },
//==
    workspace: { type: ObjectId, ref: 'Workspace' },
    selection: { type: ObjectId, ref: 'Selection' },
    folder: { type: ObjectId, ref: 'Folder' },
    originalTagging: { type: ObjectId, ref: 'Tagging' }, // when in a parent workspace to ref original
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
  let taggingIdObj = mongoose.Types.ObjectId( tagging._id );

  if( tagging.isTrashed ) {
    mongoose.models.Workspace.update({_id: tagging.workspace},
      {$pull: { taggings: taggingIdObj}},
      function(err, affected, result) {
        if (err) { throw new Error(err.message); }
      });

    mongoose.models.Folder.update({_id: tagging.folder},
      {$pull: { taggings: taggingIdObj}},
      function(err, affected, result) {
        if (err) { throw new Error(err.message); }
      });

    mongoose.models.Selection.update({_id: tagging.selection},
      {$pull: { taggings: taggingIdObj}},
      function(err, affected, result) {
        if (err) { throw new Error(err.message); }
      });
  }
  else { /* If added, references are added everywhere necessary */

    mongoose.models.Workspace.update({_id: tagging.workspace},
      {$addToSet: { taggings: taggingIdObj}},
      function(err, affected, result) {
        if (err) { throw new Error(err.message); }
      });

    mongoose.models.Folder.update({_id: tagging.folder},
      {$addToSet: { taggings: taggingIdObj}},
      function(err, affected, result) {
        if (err) { throw new Error(err.message); }
      });

    mongoose.models.Selection.update({_id: tagging.selection},
      {$addToSet: {taggings: taggingIdObj}},
      function(err, affected, result) {
        if (err) { throw new Error(err.message); }
      });
  }
});

module.exports.Tagging = mongoose.model('Tagging', TaggingSchema);
