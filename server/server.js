//REQUIRE MODULES
const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require('http');
const multer = require('multer');
const expressPath = require('path');
const paginate = require('express-paginate');
const sockets = require('./socketInit');
const socketListeners = require('./sockets');

require('dotenv').config();


//REQUIRE API
const api = require('./datasource/api');
const auth = require('./datasource/api/auth');

//REQUIRE MIDDLEWARE
const userAuth = require('./middleware/userAuth');
const path = require('./middleware/path');
const multerMw = require('./middleware/multer');
const mtAuth = require('./middleware/mtAuth');

//REQUIRE MODELS

//REQUIRE CONFIG SUPPORT
const fixed = require('./datasource/fixed');
const nconf = config.nconf;

//CREATE EXPRESS APP
const server = express();

let port = nconf.get('port');
let dbConf = nconf.get('database');

console.log('process.env.PORT: ',process.env.PORT);
console.log('process.env.MONGO_URL: ',process.env.MONGO_URL);

switch(process.env.NODE_ENV) {
  case 'test':
    console.log("NODE_ENV == test");
    port = nconf.get('testPort');
    dbConf.name = nconf.get('testDBName');
    break;
  case 'seed':
    console.log("NODE_ENV == seed");
    port = nconf.get('testPort');
    dbConf.name = nconf.get('seedDBName');
    break;
  case 'staging':
    console.log("NODE_ENV == staging");
    port = process.env.PORT;
    dbConf.name = process.env.DB_NAME;
    break;
  case 'production':
    console.log("NODE_ENV == production");
    port = process.env.PORT;
    dbConf.name = process.env.DB_NAME;
    break;
  case 'development':
    console.log("NODE_ENV == development");
    port = nconf.get('devPort');
    dbConf.name = nconf.get('devDBName');
    break;
  default:
    port = nconf.get('devPort');
    dbConf.name = nconf.get('devDBName');
    break;
}

console.log(`database name: '${dbConf.name}'`);

mongoose.connect(`mongodb://${dbConf.host}:27017/${dbConf.name}`, {
  useMongoClient: true
});

console.info(`process.env.NODE_ENV: ${process.env.NODE_ENV}`);
console.info(`Port: ${port.toString()}`);
console.info(`db name: ${dbConf.name}`);

server.set('port', port);

const mainServer = http.createServer(server);

sockets.init(mainServer);
socketListeners();

mainServer.listen(port);

// mongo >=3.6
//  const uri = `mongodb://${dbConf.user}:${dbConf.pass}@${dbConf.host}:27017/${dbConf.name}`;
// mongoose.connect(uri);
const db = mongoose.connection;
db.on('error', function (err) {
  console.trace(err);
  throw new Error(err);
});


//MIDDLEWARE
server.use(logger('dev'));
server.use(express.json({limit: '100000kb'}));
server.use(express.urlencoded({
  extended: false
}));
server.use(cookieParser());
server.use(express.static(expressPath.join(__dirname, 'public')));
server.use(path.prep());
server.use(path.processPath());
server.use(mtAuth.prepareMtUser);
server.use(mtAuth.prepareEncUser);
server.use(userAuth.protect());
server.use(path.validateContent());

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: multerMw.fileFilter,
});

const PDFUpload = multer({
  storage: multer.diskStorage({
    destination: multerMw.buildDestination,
    filename: multerMw.filename
  }),
    fileFilter: multerMw.fileFilter
});

// // IMAGE UPLOAD
server.post('/image', upload.array('photo', 200), api.post.images);
server.post('/pdf', PDFUpload.array('photo', 50), api.post.images);

// LOCAL AUTHENTICATION CALLS
server.post('/auth/login', auth.localLogin);
server.post('/auth/signup', auth.localSignup);
server.get('/auth/logout', auth.logout);
server.post('/auth/forgot', auth.forgot);
server.get('/auth/reset/:token', auth.validateResetToken);
server.post('/auth/reset/:token', auth.resetPassword);
server.post('/auth/resetuser', auth.resetPasswordById);
server.get('/auth/confirm/:token', auth.confirmEmail);
server.get('/auth/resend/confirm', auth.resendConfirmationEmail);

server.post('/auth/newMtUser', auth.insertNewMtUser);
server.put('/auth/sso/user/:id', auth.ssoUpdateUser);

// VMT
server.get('/api/vmt/rooms/:id', path.validateId(), api.get.vmtRoom);

//API CALLS
//ALL GET REQUESTS
server.get('/api/users', api.get.users);
server.get('/api/users/:id', path.validateId(), api.get.user);
server.get('/api/workspaces', paginate.middleware(20,100), api.get.workspaces);
server.get({ path: '/api/workspaces/:id', version: '0.0.1' }, path.validateId(), fixed.workspace);
server.get('/api/workspaces/:id', path.validateId(), api.get.workspace);
server.get('/api/folders', api.get.folders);
server.get('/api/folders/:id', path.validateId(), api.get.folder);
server.get('/api/foldersets', api.get.folderSets);
server.get('/api/foldersets/:id', path.validateId(), api.get.folderSet);
server.get('/api/pdSets', api.get.pdSets); // For some reason Ember prefers pDSets to pdSets and PDSets
server.get('/api/submissions', api.get.submissions);
server.get('/api/submissions/:id', path.validateId(), api.get.submission);
server.get('/api/selections', api.get.selections);
server.get('/api/selections/:id', path.validateId(), api.get.selection);
server.get('/api/comments', paginate.middleware(100,100), api.get.comments);
server.get('/api/comments/:id', path.validateId(), api.get.comment);
server.get('/api/responses', api.get.responses);
server.get('/api/responses/:id', path.validateId(), api.get.response);
server.get('/api/taggings', api.get.taggings);
server.get('/api/taggings/:id', path.validateId(), api.get.tagging);
server.get('/api/problems', paginate.middleware(20,100), api.get.problems);
server.get('/api/problems/:id', path.validateId(), api.get.problem);
server.get('/api/answers', api.get.answers);
server.get('/api/answers/:id', path.validateId(), api.get.answer);
server.get('/api/sections', api.get.sections);
server.get('/api/sections/:id', path.validateId(), api.get.section);
server.get('/api/categories', api.get.categories);
server.get('/api/categories/:id', path.validateId(), api.get.category);
server.get('/api/organizations', api.get.organizations);
server.get('/api/organizations/:id', path.validateId(), api.get.organization);
server.get('/api/assignments', api.get.assignments);
server.get('/api/assignments/:id', path.validateId(), api.get.assignment);
server.get('/api/images', api.get.images);
server.get('/api/images/:id', path.validateId(), api.get.image);
server.get('/api/images/file/:id', path.validateId(), api.get.imageFile);
server.get('/api/stats', api.get.stats);
server.get('/api/about', api.get.about);
server.get('/api/notifications', api.get.notifications);
server.get('/api/notifications/:id', path.validateId(), api.get.notification);
server.get('/api/responseThreads/', paginate.middleware(25,100), api.get.responseThreads);
//ALL POST REQUESTS
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
server.post('/api/organizations', api.post.organization);
server.post('/api/assignments', api.post.assignment);
server.post('/api/encWorkspaceRequests', api.post.workspaceEnc);
server.post('/api/copyWorkspaceRequests', api.post.cloneWorkspace);
server.post('/api/folderSets', api.post.folderSet);
server.post('/api/updateWorkspaceRequests', api.post.updateWorkspaceRequest);
server.post('/api/notifications', api.post.notification);
server.post('/api/parentWorkspaceRequests', api.post.parentWorkspace);


//ALL PUT REQUESTS
server.put('/api/folders/:id', path.validateId(), api.put.folder);
server.put('/api/submissions/:id', path.validateId(), api.put.submission);
server.put('/api/selections/:id', path.validateId(), api.put.selection);
server.put('/api/comments/:id', path.validateId(), api.put.comment);
server.put('/api/responses/:id', path.validateId(), api.put.response);
server.put('/api/taggings/:id', path.validateId(), api.put.tagging);
server.put('/api/users/:id', path.validateId(), api.put.user);
server.put('/api/users/addSection/:id', path.validateId(), api.put.user.addSection);
server.put('/api/users/removeSection/:id', path.validateId(), api.put.user.removeSection);
server.put('/api/users/addAssignment/:id', path.validateId(), api.put.user.addAssignment);
server.put('/api/users/removeAssignment/:id', path.validateId(), api.put.user.removeAssignment);
server.put('/api/workspaces/:id', path.validateId(), api.put.workspace);
server.put('/api/problems/:id', path.validateId(), api.put.problem);
server.put('/api/problems/addCategory/:id', path.validateId(), api.put.problem.addCategory);
server.put('/api/problems/removeCategory/:id', path.validateId(), api.put.problem.removeCategory);
server.put('/api/answers/:id', path.validateId(), api.put.answer);
server.put('/api/sections/:id', path.validateId(), api.put.section);
server.put('/api/sections/addTeacher/:id', path.validateId(), api.put.section.addTeacher);
server.put('/api/sections/removeTeacher/:id', path.validateId(), api.put.section.removeTeacher);
server.put('/api/sections/addStudent/:id', path.validateId(), api.put.section.addStudent);
server.put('/api/sections/removeStudent/:id', path.validateId(), api.put.section.removeStudent);
server.put('/api/sections/addProblem/:id', path.validateId(), api.put.section.addProblem);
server.put('/api/sections/removeProblem/:id', path.validateId(), api.put.section.removeProblem);
server.put('/api/organizations/:id', path.validateId(), api.put.organization);
server.put('/api/assignments/:id', path.validateId(), api.put.assignment);
server.put('/api/notifications/:id', path.validateId(), api.put.notification);

//ALL DELETE REQUESTS
server.delete('/api/images/:id', path.validateId(), api.delete.image);


let buildDir = 'build';
if (process.env.BUILD_DIR) {
  buildDir = process.env.BUILD_DIR;
}
console.log(`buildDir: ${buildDir}`);
server.get(/.*/, express.static(buildDir));

server.post({
  name: 'newWorkspaces',
  path: '/api/newWorkspaceRequests',
}, api.post.newWorkspaceRequest);

server.post('/api/import', api.post.import);
server.post('/api/importRequests', api.post.importSubmissionsRequest);
server.post('/api/vmtImportRequests', api.post.vmtImportRequests);

// error handler
server.use(function (err, req, res, next) {
  err.status = 500;
  next(err);
});

module.exports = mainServer;

