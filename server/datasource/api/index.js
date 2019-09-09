/**
  * # API
  * @description This is the RESTful API for Encompass.
  *              We are using Express for this.
  *              In this directory we define various methods for handling requests.
  *              This file is a convenience that allows us to require the API elsewhere by
  *              just requiring this dir.
  *              Routing to these methods is done in [server.js](../../server.html)
  * @todo ARE WE USING THIS FILE?
  * @author Damola Mabogunje <damola@mathforum.org>
  * @since 1.0.0
  */
exports.get = {};
exports.post = {};
exports.put = {};
exports.delete = {};

["taggingApi",
 "errorApi",
 "folderApi",
 "workspaceApi",
 "userApi",
 "selectionApi",
 "submissionApi",
 "commentApi",
 "responseApi",
 "problemApi",
 "answerApi",
 "sectionApi",
 "categoryApi",
 "auth",
 "about",
 "stats",
 "cache",
 "imageApi",
 "importApi",
 "organizationApi",
 "assignmentApi",
 "notificationApi",
 "vmtApi",
 "parentWorkspaceApi",
].forEach(function (path) {
    var module = require('./' + path);

    for(var i in module.get) {
      if(module.get.hasOwnProperty(i)) {
        exports.get[i] = module.get[i];
      }
    }

    for(var j in module.post) {
      if(module.post.hasOwnProperty(j)) {
        exports.post[j] = module.post[j];
      }
    }

    for(var k in module.put) {
      if(module.put.hasOwnProperty(k)) {
        exports.put[k] = module.put[k];
      }
    }

    for (var l in module.delete) {
      if (module.delete.hasOwnProperty(l)) {
        exports.delete[l] = module.delete[l];
      }
    }
  });
