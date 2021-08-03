const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const _ = require('underscore');
const ObjectId = Schema.ObjectId;

const { resolveParentUpdates } = require('../api/parentWorkspaceApi');

/**
  * @public
  * @class Selection
  * @description A Selection is an excerpt from a student Submission, this allows for a text selection or an image tagging
  */
var SelectionSchema = new Schema({
//== Shared properties (Because Monggose doesn't support schema inheritance)
    createdBy: { type: ObjectId, ref: 'User', required: true },
    createDate: { type: Date, 'default': Date.now() },
    isTrashed: { type: Boolean, 'default': false },
    lastModifiedBy: { type: ObjectId, ref: 'User' },
    lastModifiedDate: { type: Date, 'default': Date.now() },
//====
    /* Coordinates are used by the frontend to help highlight a selection within submission text */
    coordinates: { type: String, required: true },
    text: { type: String, required: true },
    submission: { type: ObjectId, ref: 'Submission', required: true },
    workspace: { type: ObjectId, ref: 'Workspace' },
    comments: [{type: ObjectId, ref: 'Comment'}],
    taggings: [{type: ObjectId, ref: 'Tagging'}],
    relativeCoords: {
      tagLeftPct: Number,
      tagTopPct: Number,
    },
    relativeSize: {
      widthPct: Number,
      heightPct: Number
    },
    imageTagLink: { type: String }, // for image-tag selections; link to image
    imageSrc: { type: String}, // either base-64 for old images, or link to image record,
    vmtInfo: {
      startTime: { type: Number },
      endTime: { type: Number }
    },
    originalSelection: { type: ObjectId, ref: 'Selection' }, // when in a parent workspace to ref original

    /*
    For post save hook use only
    */
    wasNew: { type: Boolean, default: false, select: false },
    updatedFields: [ { type: String, select: false } ],
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
    this.wasNew = this.isNew;
    if (!this.wasNew) {
      this.updatedFields = this.modifiedPaths();
    }

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
  let selectionIdObj = mongoose.Types.ObjectId( selection._id );

  /* + If deleted, all references are also deleted */
  if( selection.isTrashed )
  {
    mongoose.models.Workspace.update({_id: selection.workspace},
      {$pull: { selections : selectionIdObj }},
      function (err, affected, result) {
        if (err) {
          throw new Error(err.message);
        }
      });

    mongoose.models.Submission.update({_id: selection.submission},
      {$pull: { selections : selectionIdObj }},
      function (err, affected, result) {
        if (err) {
          throw new Error(err.message);
        }
      });

    /*    + Note: Downstream reference updates must be `save`d
            to trigger their respective validators
    */
    selection.populate('taggings comments', function(err, doc) {
      if (err) {
        throw new Error(err.message);
      }
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
    mongoose.models.Workspace.update({_id: selection.workspace},
      {$addToSet: { selections : selectionIdObj}},
      function (err, affected, result) {
        if (err) {
          throw new Error(err.message);
        }
      });

    mongoose.models.Submission.update({_id: selection.submission},
      {$addToSet: { selections : selectionIdObj }},
      function (err, affected, result) {
        if (err) {
          throw new Error(err.message);
        }
      });
  }

  let { updatedFields, wasNew } = selection;

  let wereUpdatedFields =
    Array.isArray(updatedFields) && updatedFields.length > 0;

  if (wasNew) {
    resolveParentUpdates(
      selection.createdBy,
      selection,
      'selection',
      'create'
    ).catch(err => {
      console.log('Error creating parent selection: ', err);
    });
  } else if (wereUpdatedFields) {
    let allowedParentUpdateFields = [
      'isTrashed',
      'relativeCoords',
      'relativeSize'
    ];
    let parentFieldsToUpdate = updatedFields.filter(field => {
      return allowedParentUpdateFields.includes(field);
    });

    if (parentFieldsToUpdate.length === 0) {
      return;
    }

    resolveParentUpdates(
      selection.lastModifiedBy,
      selection,
      'selection',
      'update',
      parentFieldsToUpdate
    ).catch(err => {
      console.log('Error updating parent selection: ', err);
    });
  }
});

module.exports.Selection = mongoose.model('Selection', SelectionSchema);
