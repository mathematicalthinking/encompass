/**
 * # Permissions Module
 * @description centralized permissions checking for the front and back end
 * @authors Amir Tahvildaran <amir@mathforum.org>
 * @since 1.0.1
 *
 * Currently this only really handles permissions for workspaces
 * We'll have to adapt to other permissions checks in the future
 * Perhaps using a common permissions interface
 */
var _ = require('underscore');
var Properties = require('./properties.js');

module.exports = {
  /*
    This list of permissions is not all inclusive
    @see userCan for notes about two exceptions
  */
  _PERMISSIONS: {
    workspace: {
      SELECTIONS:   { description: 'all permissions regarding selections: create, file, delete, etc' },
      COMMENTS:     { description: 'all permissions regarding comments: create, mark for inclusion, delete, etc' },
      FOLDERS:      { description: 'all permissions regarding folders: create, reorganize, remove, etc' },
    }
  },
  // I think the mode should follow the same model as the permissions above (object with descriptions)
  PUBLIC: "public",
  PRIVATE: "private",
  modeValues: function() {
    return [this.PRIVATE, this.PUBLIC];
  },
  isPublic: function(object) {
    if(!object) { return false; }
    return ("public" === object.mode);
  },

  // returns true if user has isAdmin: true
  isAdmin: function(user) {
    return Properties.resolveProperty('accountType', user) === 'A';
    //return !!Properties.resolveProperty('isAdmin', user);
  },

  // compares username to the owner field on a workspace
  isOwner: function(user, object) {
    if(!user || !object) {
      return false;
    }
    //console.log("Resolve User Name");
    user  = Properties.resolveUsername(user);
    if(typeof user == "undefined") { return false; }
    //console.log("Resolve Owner Obj");
    var ownerObj = Properties.resolveOwner(object);
    //console.log("Resolve Owner Name");
    owner = Properties.resolveUsername( ownerObj );
    //console.log("Comparer Owner");
    return (user === owner);
  },

  // returns true if editors field on object
  // contains the username of user

  //TODO: This does not work properly. Fix or replace
  isEditor: function(user, object) {
    if(!user || !object) {
      return false;
    }
    user    = Properties.resolveUsername(user);
    editors = Properties.resolveUsername(Properties.resolveEditors(object));
    return _.contains(editors, user);
  },

  // return array of the keys for the
  // workspace's permissions
  workspacePermissionKeys: function() {
    return _.keys(this._PERMISSIONS.workspace);
  },

  // returns true if workspace has specified
  // permission
  isValidPermission: function(permission) {
    return _.contains(this.workspacePermissionKeys(), permission);
  },
  /*
  For 1.0.1 the permissions are pretty simple
    userCanLoad - checks if its public/private and acts appropriately
    userCanModify - checks if they are the owner
    userCan* - checks that they are the owner or editor
  This works because editors can do everything that owners can aside from modify
  When we get more fine grained with permissions we should probably drop
  the userCanLoadWorkspace and userCanModifyWorkspace in favor of this method
  with new _PERMISSIONS
  */

  // should this check isOwner as well as isEditor
  // and isAdmin?
  userCan: function(user, workspace, permission) {
    console.log('user in userCan', user);
    if(!this.isValidPermission(permission)) {
      throw "bogus permission request: " + permission;
    }
    //console.log("Check is owner.");
    var isOwner  = this.isOwner(user, workspace);
    //console.log("Check is Editor.");
    var isEditor = this.isEditor(user, workspace);
    //console.log("Check is Admin.");
    console.log('isEditor', isEditor);
    var isAdmin  = this.isAdmin(user, workspace);
    //console.log("Done with checks");
    console.log("IS ADMIN: ", isAdmin);
    return (isOwner || isEditor || isAdmin);
    //return ( isEditor || isAdmin);
  },
  /*
    This will probably be deprecated ASAP
    @see userCan
    @since 1.0.1
  */

  // returns True if workspace is public or if user
  // is an owner, editor, or admin
  userCanLoadWorkspace: function(user, workspace) {
    var isPublic = this.isPublic(workspace);
    var isOwner  = this.isOwner(user, workspace);
    var isEditor = this.isEditor(user, workspace);
    var isAdmin  = this.isAdmin(user, workspace);

    return (isPublic || isOwner || isEditor || isAdmin);
  },
  /*
    This will probably be deprecated ASAP
    @see userCan
    @since 1.0.1
  */

  // returns true if user is an owner or admin of workspace
  userCanModifyWorkspace: function(user, workspace) {
    var isOwner  = this.isOwner(user, workspace);
    var isAdmin  = this.isAdmin(user, workspace);

    return (isOwner || isAdmin);
  }
}
