/* exported mongoose */
var mongoose = require('mongoose'),
  config = require('./config'),
  restify = require('restify'),
  cas = require('./mfcas'),
  fake = require('./fake_login'),
  uuid = require('uuid'),
  cookie = require('cookie'),
  api = require('./datasource/api'),
  auth = require('./datasource/api/auth'),
  path = require('./datasource/api/path'),
  fixed = require('./datasource/fixed');

var models = require('./datasource/schemas');
var utils = require('./datasource/api/requestHandler');
var dbMigration = require('../app/db_migration/base');

var nconf = config.nconf;
var dbConf = nconf.get('database');

mongoose.connect(dbConf.host, dbConf.name, {
  user: dbConf.user,
  pass: dbConf.pass
});

// mongo >=3.6
//  var uri = `mongodb://${dbConf.user}:${dbConf.pass}@${dbConf.host}:27017/${dbConf.name}`;
// mongoose.connect(uri);
var db = mongoose.connection;
db.on('error', function (err) {
  console.trace(err);
  process.exit(1);
});

var server = restify.createServer();
server.use(restify.plugins.bodyParser({ mapParams: false }));
server.use(restify.plugins.queryParser({ mapParams: false }));
server.use(path.prep());
server.use(path.processPath());
server.use(auth.processToken());
server.use(auth.fetchUser());
server.use(auth.protect());
server.use(auth.loadAccessibleWorkspaces());
server.use(path.validateId());
server.use(path.validateContent());

server.get('/devonly/fakelogin/:username', fake.fakeLogin);
server.get('/login', cas.sendToCas);
server.get('/logout', cas.logout);
server.get('/back', cas.returnFromCas);
server.get('/api/users', api.get.users);
server.get('/api/users/:id', api.get.user);
server.get('/api/workspaces', api.get.workspaces);
server.get({ path: '/api/workspaces/:id', version: '0.0.1' }, fixed.workspace);
server.get('/api/workspaces/:id', api.get.workspace);
server.get('/api/folders', api.get.folders);
server.get('/api/folders/:id', api.get.folder);
server.get('/api/folderSets', api.get.folderSets);
server.get('/api/pdSets', api.get.pdSets); // For some reason Ember prefers pDSets to pdSets and PDSets
server.get('/api/submissions', api.get.submissions);
server.get('/api/submissions/:id', api.get.submission);
server.get('/api/selections', api.get.selections);
server.get('/api/selections/:id', api.get.selection);
server.get('/api/comments', api.get.comments);
server.get('/api/comments/:id', api.get.comment);
server.get('/api/responses', api.get.responses);
server.get('/api/responses/:id', api.get.response);
server.get('/api/taggings', api.get.taggings);
server.get('/api/taggings/:id', api.get.tagging);
server.get('/api/problems', api.get.problems);
server.get('/api/problems/:id', api.get.problem);
server.get('/api/answers', api.get.answers);
server.get('/api/answers/:id', api.get.answer);
server.get('/api/sections', api.get.sections);
server.get('/api/sections/:id', api.get.section);
server.get('/api/sections', api.get.categories);
server.get('/api/sections/:id', api.get.category);

server.post('/api/users', api.post.user);
server.post('/api/workspaces', api.post.workspace);
server.post('/api/errors', api.post.error);
server.post('/api/folders', api.post.folder);
server.post('/api/submissions', api.post.submission);
server.post('/api/selections', api.post.selection);
server.post('/api/comments', api.post.comment);
server.post('/api/responses', api.post.response);
server.post('/api/taggings', api.post.tagging);
server.post('/api/problems', api.post.problem);
server.post('/api/answers', api.post.answer);
server.post('/api/sections', api.post.section);

server.put('/api/folders/:id', api.put.folder);
server.put('/api/submissions/:id', api.put.submission);
server.put('/api/selections/:id', api.put.selection);
server.put('/api/comments/:id', api.put.comment);
server.put('/api/responses/:id', api.put.response);
server.put('/api/taggings/:id', api.put.tagging);
server.put('/api/users/:id', api.put.user);
server.put('/api/workspaces/:id', api.put.workspace);
server.put('/api/problems/:id', api.put.problem);
server.put('/api/problems/addCategory/:id', api.put.problem.addCategory);
server.put('/api/problems/removeCategory/:id', api.put.problem.removeCategory);
server.put('/api/answers/:id', api.put.problem);
server.put('/api/sections/:id', api.put.problem);
server.put('/api/sections/:id', api.put.category);
server.put('/api/sections/addTeacher/:id', api.put.section.addTeacher);
server.put('/api/sections/removeTeacher/:id', api.put.section.removeTeacher);
server.put('/api/sections/addStudent/:id', api.put.section.addStudent);
server.put('/api/sections/removeStudent/:id', api.put.section.removeStudent);
server.put('/api/sections/addProblem/:id', api.put.section.addProblem);
server.put('/api/sections/removeProblem/:id', api.put.section.removeProblem);


server.get('/api/stats', api.get.stats);
server.get('/api/about', api.get.about);

server.post({
  name: 'newWorkspaces',
  path: '/api/newWorkspaceRequests',
}, api.post.newWorkspaceRequest);

server.post('/api/importRequests', api.post.importSubmissionsRequest);

//Catch-all and serve from the build directory
server.get(/.*/, restify.plugins.serveStatic({
  directory: 'build/',
  'default': 'index.html'
}));

server.listen(nconf.get('port'), function () {
  console.info('%s listening at %s', server.name, server.url);
});
