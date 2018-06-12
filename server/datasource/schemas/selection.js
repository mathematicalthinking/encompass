var mongoose = require('mongoose'),
    _        = require('underscore'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;

/**
  * @public
  * @class Selection
  * @description A Selection is an excerpt from a student Submission
  */
var SelectionSchema = new Schema({
//== Shared properties (Because Monggose doesn't support schema inheritance)
    createdBy: {type:ObjectId, ref:'User'},
    createDate: {type:Date, 'default':Date.now()},
    isTrashed: {type: Boolean, 'default': false},
//====
    /* Coordinates are used by the frontend to help highlight a selection within submission text */
    coordinates: String,
    text: {type: String, required: true},
    submission: {type:ObjectId, ref:'Submission', required: true},
    workspace: {type:ObjectId, ref:'Workspace'},
    comments: [{type:ObjectId, ref:'Comment'}],
    taggings: [{type:ObjectId, ref:'Tagging'}]
  }, {versionKey: false});


/**
  * ## Pre-Validation
  * Before saving we must verify (synchonously) that:
  */ 
SelectionSchema.pre('save', function (next) {
  var toObjectId = function(elem, ind, arr) {
    if( !(elem instanceof mongoose.Types.ObjectId) && !_.isUndefined(elem) ) {
      arr[ind] = mongoose.Types.ObjectId(elem);
    }
  };

  /** + Every ID reference in our object is properly typed. 
    *   This needs to be done BEFORE any other operation so
    *   that native lookups and updates don't fail.
    */
  try {
    this.comments.forEach(toObjectId);
    this.taggings.forEach(toObjectId);
    next();
  }
  catch(err) {
    next(new Error(err.message));
  }
});

/** And (asynchronously) that:
  *
  * + The Submission exists
  */
SelectionSchema.pre('save', true, function (next, done) {
  mongoose.models.Submission.findById(this.submission)
    .lean()
    .exec(function (err, found) {
      if (err) { 
        next(new Error(err.message)); 
      } 
      else { next(); }
      done();
    });
});

/* + The Workspace exists */
SelectionSchema.pre('save', true, function (next, done) {
  mongoose.models.Workspace.findById(this.workspace)
    .lean()
    .exec(function (err, found) {
      if (err) { 
        next(new Error(err.message)); 
      } 
      else { next(); }
      done();
    });
});

/**
  * ## Post-Validation
  * After saving we must ensure (synchonously) that:
  */
SelectionSchema.post('save', function (selection) {
  /* + If deleted, all references are also deleted */ 
  if( selection.isTrashed )
  {
    var selectionIdObj = mongoose.Types.ObjectId( selection._id );
    mongoose.models.Workspace.update({'_id': selection.workspace},
      {$pull: {'selections': selectionIdObj}},
      function (err, affected, result) {
        if (err) { 
          throw new Error(err.message); 
        }
      });

    mongoose.models.Submission.update({'_id': selection.submission},
      {$pull: {'selections': selectionIdObj}},
      function (err, affected, result) {
        if (err) { 
          throw new Error(err.message); 
        }
      });

    /*    + Note: Downstream reference updates must be `save`d
            to trigger their respective validators
    */
    selection.populate('taggings comments', function(err, doc) {
      doc.comments.forEach(function (comment) {
        comment.isTrashed = true;
        comment.save();
      });

      doc.taggings.forEach(function (tag) {
        tag.isTrashed = true;
        tag.save();
      });
    });
  }
  else { /* + If added, references are added everywhere necessary */ 
    mongoose.models.Workspace.update({'_id': selection.workspace},
      {$addToSet: {'selections': selection}},
      function (err, affected, result) {
        if (err) { 
          throw new Error(err.message); 
        }
      });

    mongoose.models.Submission.update({'_id': selection.submission},
      {$addToSet: {'selections': selection}},
      function (err, affected, result) {
        if (err) { 
          throw new Error(err.message); 
        }
      });
  }
});

module.exports.Selection = mongoose.model('Selection', SelectionSchema);
