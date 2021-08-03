const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const _ = require('underscore');
const ObjectId = Schema.ObjectId;
const { resolveParentUpdates} = require('../api/parentWorkspaceApi');

/**
  * @public
  * @class Folder
  * @description Folders are used in Workspaces to categorize Selections.
  *              They may contain any number of Selections and/or sub-Folders.
  * @see [Workspace](/workspace.html)
  */
var FolderSchema = new Schema({
//== Shared properties (Because Mongoose doesn't support schema inheritance)
  createdBy: { type: ObjectId, ref: 'User' },
  createDate: { type: Date, 'default': Date.now() },
  isTrashed: { type: Boolean, 'default': false },
  lastModifiedBy: { type: ObjectId, ref: 'User' },
  lastModifiedDate: { type: Date, 'default': Date.now() },
//====
  name: { type: String, required: true },
  owner: { type:ObjectId, ref:'User' },
  editors: [{type:ObjectId, ref:'User'}],
  parent: { type:ObjectId, ref:'Folder' },
  children: [{type:ObjectId, ref:'Folder'}],
  /* Weight is used in the frontend for sort and dragNdrop functionality */
  weight: Number,
  taggings: [{type: ObjectId, ref:'Tagging'}],
  workspace: { type:ObjectId, ref:'Workspace' },
  originalFolder: { type: ObjectId, ref: 'Folder' }, // when in a parent workspace to ref original
  srcChildWs: { type: ObjectId, ref: 'Workspace' }, // for "workspace" folders create to contain a child workspaces folders in a parent workspace

  /*
    For post save hook use only
  */
  wasNew: { type: Boolean, default: false, select: false },
  updatedFields: [ {type: String, select: false }],
}, {versionKey: false});

/**
  * ## Pre-Validation
  * Before saving we must verify (synchonously) that:
  */
FolderSchema.pre('save', function (next) {
  var toObjectId = function(elem, ind, arr) {
    if( !(elem instanceof mongoose.Types.ObjectId) && !_.isUndefined(elem)) {
      arr[ind] = mongoose.Types.ObjectId(elem);
    }
  };

  /** + Every ID reference in our object is properly typed.
    *   This needs to be done BEFORE any other operation so
    *   that native lookups and updates don't fail.
    */
  try {
    this.children.forEach(toObjectId);
    this.taggings.forEach(toObjectId);
    //this.workspaces.forEach(toObjectId);
    next();
  }
  catch(err) {
    next(new Error(err.message));
  }
});

/*  + Folder parent/child relationships are updated */
FolderSchema.pre('save', function (next) {
  var hasWorkspace = this.workspace;
  this.wasNew = this.isNew;
  if (!this.isNew) {
    this.updatedFields = this.modifiedPaths();
  }

  var folder = this;

  mongoose.models.Folder.findById(folder.id, function(err, dbFolder) {
    if (err) {
      throw new Error(err);
    }
    if(dbFolder && (dbFolder.parent !== folder.parent)) {
      console.log('parent of ' + folder.id + ' (' + folder.name +
        ') changing from ' + dbFolder.parent + ' to ' + folder.parent);
      if(dbFolder.parent) {
        mongoose.models.Folder.findByIdAndUpdate(dbFolder.parent,
          {$pull: { children: folder._id } },
          function (err) {
            console.log('dropped folder ' + folder.name + ' from children of ' + dbFolder.parent);
            if(err) { throw new Error(err); }
          });
      }
    }

    /* @todo Verify Workspaces */
    if (hasWorkspace) {
      next();
    } else {
      next( new Error("workspace is required") );
    }
  });
});

/**
  * ## Post-Validation
  * After saving we must ensure (synchonously) that:
  */

FolderSchema.post('save', function (folder) {
  /* If deleted, all references are also deleted */

  let folderIdObj = mongoose.Types.ObjectId( folder._id );

  if( folder.isTrashed ) {
    mongoose.models.Workspace.update({_id: folder.workspace},
      {$pull: { folders: folderIdObj}},
      function (err, affected, result) {
        if (err) { throw new Error(err.message); }
      });

    /*    + Note: Downstream reference updates must be `save`d
            to trigger their respective validators
    */
    folder.populate('taggings').populate('children', function(err, doc) {
      if (err) {
        throw new Error(err.message);
      }
      doc.children.forEach(function (child) {
        child.isTrashed = true;
        child.save();
      });

      doc.taggings.forEach(function (tag) {
        tag.isTrashed = true;
        tag.save();
      });
    });
  }
  else { /* If added, references are added everywhere necessary */
    mongoose.models.Workspace.update({_id: folder.workspace},
      {$addToSet: { folders: folderIdObj }},
      function (err, affected, results) {
        if (err) { throw new Error(err.message); }
      });

    if (folder.parent) {
      mongoose.models.Folder.findByIdAndUpdate(folder.parent,
        {$addToSet: { children : folderIdObj}},
        function (err, affected, results) {
          if (err) { throw new Error(err.message); }
        });
    }
  }

  let { updatedFields, wasNew } = folder;

  let wereUpdatedFields =
    Array.isArray(updatedFields) && updatedFields.length > 0;

  if (wasNew) {
    resolveParentUpdates(folder.createdBy, folder, 'folder', 'create').catch(
      err => {
         console.log('Error creating parent folder: ', err);
      }
    );
  } else if (wereUpdatedFields) {
    let allowedParentUpdateFields = [
      'isTrashed',
      'name',
      'children',
      'parent',
      'weight'
    ];

    let parentFieldsToUpdate = updatedFields.filter(field => {
      return allowedParentUpdateFields.includes(field);
    });

    if (parentFieldsToUpdate.length === 0) {
      return;
    }

    resolveParentUpdates(
      folder.lastModifiedBy,
      folder,
      'folder',
      'update',
      parentFieldsToUpdate
    ).catch(err => {
      console.log('Error updating parent folder: ', err);
    });
  }
});

module.exports.Folder = mongoose.model('Folder', FolderSchema);
