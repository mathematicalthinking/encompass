/**
  * # Schemas
  * @description We are using [Mongoose](http://mongoosejs.com/) as our ODM
  *              to manage data consistently between Node and MongoDB. In
  *              this directory we define the various DAOs with Mongoose
  *              Schemas, and this file is a convenience that allows us to
  *              require the schemas elsewhere by just requiring this dir
  * @author Damola Mabogunje <damola@mathforum.org>
  * @since 1.0.0
  */

["tagging",
  "error",
  "folder",
  "workspace",
  "selection",
  "submission",
  "comment",
  "response",
  "user",
  "problem",
  "answer",
  "section",
  "category",
  "image",
  "organization",
  "assignment",
  "encWorkspaceRequest",
  "folderSet",
  "copyWorkspaceRequest",
  "updateWorkspaceRequest",
  "notification",
  "vmtImportRequest",
].forEach(function (path) {
  var module = require('./' + path);

  for (var i in module) {
    if (module.hasOwnProperty(i)) {
      exports[i] = module[i];
    }
  }
});
