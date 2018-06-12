/**
  * # API
  * @description This is the RESTful API for Encompass.
  *              We are using Node's [Restify](http://mcavage.me/node-restify/) for this.
  *              In this directory we define various methods for handling requests.
  *              This file is a convenience that allows us to require the API elsewhere by
  *              just requiring this dir.
  *              Routing to these methods is done in [server.js](../../server.html)
  * @todo Refactor
  * @author Damola Mabogunje <damola@mathforum.org>
  * @since 1.0.0
  */
exports.get = {};
exports.post = {};
exports.put = {};

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
 "about",
 "stats",
 "cache",
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
  });
