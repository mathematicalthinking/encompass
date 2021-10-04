const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const { resolveParentUpdates } = require('../api/parentWorkspaceApi');

/**
  * @public
  * @class Comment
  * @description A comment may be made by a user on a Selection, Submission, or Workspace.
  */
var CommentSchema = new Schema({
//== Shared properties (Because Monggose doesn't support schema inheritance)
  createdBy: { type: ObjectId, ref: 'User', required: true },
  createDate: { type: Date, 'default': Date.now() },
  isTrashed: { type: Boolean, 'default': false },
  lastModifiedBy: { type: ObjectId, ref: 'User' },
  lastModifiedDate: { type: Date, 'default': Date.now() },
//====
    /* What is the nature of this comment? */
    label: {type: String, enum: ['notice', 'wonder', 'feedback']},
    text: {type: String, required: true},
    useForResponse: {type: Boolean, 'default': false},
    /*
      Comments can be re-used, we keep a tree representing the re-use via
      parent/child relationships.  We also store all of the ancestors
      of an origin comment to support an easy list representation (one-level tree)
      in the UI
                1
               / \
              2   3
             / \
            4  5
      Comment 1 is the origin comment and looks like this
        origin:     null
        parent:     null
        ancestors:  2, 3, 4, 5
        children:   2, 3
      Comment 2:
        origin:     1
        parent:     1
        ancestors:  null
        children:   4, 5
      Comment 4:
        origin:     1
        parent:     2
        ancestors:  null
        children:   null
    */
    origin: {type: ObjectId, ref:'Comment'},
    ancestors: [{type:ObjectId, ref:'Comment'}],
    // the comment this comment was based off of (which may in turn have a parent)
    parent: {type: ObjectId, ref:'Comment'},
    children: [{type:ObjectId, ref:'Comment'}],
    selection: {type: ObjectId, ref:'Selection', required: true},
    submission: {type: ObjectId, ref:'Submission', required: true},
    workspace: {type: ObjectId, ref:'Workspace', required: true},
    /* Not to be confused with label, type depends on the object this comment is for */
    type: {type: String, enum: ['selection', 'submission', 'workspace']},
    originalComment: { type: ObjectId, ref: 'Comment' }, // when in a parent workspace to ref original

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

/* + The Selection exists */
CommentSchema.pre('save', function (next) {
  mongoose.models.Selection.findById(this.selection)
    .lean()
    .exec(function (err, found) {
      if (err) { next(new Error(err.message)); }
      else { next(); }
    });
});

/* + The Submission exists */
CommentSchema.pre('save', function (next) {
  mongoose.models.Submission.findById(this.submission)
    .lean()
    .exec(function (err, found) {
      if (err) { next(new Error(err.message)); }
      else { next(); }
    });
});

/* + The Workspace exists */
CommentSchema.pre('save', function (next) {
  mongoose.models.Workspace.findById(this.workspace)
    .lean()
    .exec(function (err, found) {
      if (err) { next(new Error(err.message)); }
      else { next(); }
    });
});

/* + The parent Comment exists */
CommentSchema.pre('save', function (next) {
  var comment = this;

  this.wasNew = this.isNew;
  if (!this.wasNew) {
    this.updatedFields = this.modifiedPaths();
  }

  if(this.parent) {
    mongoose.models.Comment.findById(this.parent)
      .lean()
      .exec(function (err, found) {
        if (err) { next(new Error(err.message)); }
        else {
          if(found.origin) {
            comment.origin = found.origin; //point to the parents origin
          } else {
            comment.origin = found;        //the parent better be an origin at this point
          }

          next();
        }
      });
  } else {
    next();
  }
});

/**
  * ## Post-Validation
  * After saving we must ensure (synchonously) that:
  */
CommentSchema.post('save', function (comment) {
  /* + If deleted, all references are also deleted */
  if( comment.isTrashed )
  {
    var commentIdObj = mongoose.Types.ObjectId( comment._id );
    mongoose.models.Workspace.update({'_id': comment.workspace},
      {$pull: {'comments': commentIdObj}},
      function (err, affected, result) {
        if (err) { throw new Error(err.message); }
      });

    mongoose.models.Submission.update({'_id': comment.submission},
      {$pull: {'comments': commentIdObj}},
      function (err, affected, result) {
        if (err) { throw new Error(err.message); }
      });

    mongoose.models.Selection.update({'_id': comment.selection},
      {$pull: {'comments': commentIdObj}},
      function (err, affected, result) {
        if (err) { throw new Error(err.message); }
      });
  }
  else { /* + If added, references are added where necessary */
    mongoose.models.Workspace.update({'_id': comment.workspace},
      {$addToSet: {'comments': comment}},
      function (err, affected, result) {
        if (err) { throw new Error(err.message); }
      });

    mongoose.models.Submission.update({'_id': comment.submission},
      {$addToSet: {'comments': comment}},
      function (err, affected, result) {
        if (err) { throw new Error(err.message); }
      });

    mongoose.models.Selection.update({'_id': comment.selection},
      {$addToSet: {'comments': comment}},
      function (err, affected, result) {
        if (err) { throw new Error(err.message); }
      });

    if(comment.parent) {
      mongoose.models.Comment.findByIdAndUpdate(comment.parent,
        {$addToSet: {'children': comment }},
        function(error, affected, results) {
          if(error) { throw new Error(error.message); }
        });
    }

    if(comment.origin) {
      mongoose.models.Comment.findByIdAndUpdate(comment.origin,
        {$addToSet: {'ancestors': comment }},
        function(error, affected, results) {
          if(error) { throw new Error(error.message); }
        });
    }
  }

  let { updatedFields, wasNew } = comment;

  let wereUpdatedFields =
    Array.isArray(updatedFields) && updatedFields.length > 0;

  if (wasNew) {
    resolveParentUpdates(comment.createdBy, comment, 'comment', 'create').catch(
      err => {
        console.log('Error creating parent comment: ', err);
      }
    );
  } else if (wereUpdatedFields) {
    let allowedParentUpdateFields = ['isTrashed', 'children', 'ancestors', 'parent'];

    let parentFieldsToUpdate = updatedFields.filter(field => {
      return allowedParentUpdateFields.includes(field);
    });

    if (parentFieldsToUpdate.length === 0) {
      return;
    }

    resolveParentUpdates(
      comment.lastModifiedBy,
      comment,
      'comment',
      'update',
      parentFieldsToUpdate
    ).catch(err => {
      console.log('Error updating parent comment: ', err);
    });
  }
});

module.exports.Comment = mongoose.model('Comment', CommentSchema);
