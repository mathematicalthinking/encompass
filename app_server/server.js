// REQUIRE MODULES
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
const cors = require('cors');
const fs = require('fs');

require('dotenv').config();

// REQUIRE API
const api = require('./datasource/api');
const auth = require('./datasource/api/auth');

// REQUIRE MIDDLEWARE
const userAuth = require('./middleware/userAuth');
const pathMw = require('./middleware/path');
const multerMw = require('./middleware/multer');
const mtAuth = require('./middleware/mtAuth');

// CONFIG
const nconf = config.nconf;

// CREATE EXPRESS APP
const server = express();

// --- ENV/CONFIG SETUP (clone to avoid mutating shared config) ---
let port = nconf.get('port');
let dbConf = JSON.parse(JSON.stringify(nconf.get('database')));

switch (process.env.NODE_ENV) {
  case 'test':
    console.log('NODE_ENV == test');
    port = nconf.get('testPort');
    dbConf.name = nconf.get('testDBName');
    // ensure no TLS in test unless explicitly set
    delete dbConf.options.sslKey;
    delete dbConf.options.sslCert;
    delete dbConf.options.user;
    delete dbConf.options.pass;
    delete dbConf.options.ssl;
    break;
  case 'seed':
    console.log('NODE_ENV == seed');
    port = nconf.get('testPort');
    dbConf.name = nconf.get('seedDBName');
    delete dbConf.options.sslKey;
    delete dbConf.options.sslCert;
    delete dbConf.options.user;
    delete dbConf.options.pass;
    delete dbConf.options.ssl;
    break;
  case 'production':
    console.log('NODE_ENV == production');
    port = process.env.PORT;
    dbConf.host = process.env.MONGO_URI_PROD || dbConf.host;
    dbConf.name = process.env.DB_NAME_PROD || dbConf.name;
    dbConf.options.ssl = true;
    dbConf.options.user = process.env.MONGO_USER;
    dbConf.options.pass = process.env.MONGO_PASS;
    if (process.env.MONGO_SSL_KEY) {
      dbConf.options.sslKey = fs.readFileSync(process.env.MONGO_SSL_KEY);
    }
    if (process.env.MONGO_SSL_CERT) {
      dbConf.options.sslCert = fs.readFileSync(process.env.MONGO_SSL_CERT);
    }
    break;
  case 'staging':
    console.log('NODE_ENV == staging');
    port = process.env.PORT;
    dbConf.host = process.env.MONGO_URI_STAGING || dbConf.host;
    dbConf.name = process.env.DB_NAME_STAGING || dbConf.name;
    dbConf.options.ssl = true;
    dbConf.options.user = process.env.MONGO_USER;
    dbConf.options.pass = process.env.MONGO_PASS;
    if (process.env.MONGO_SSL_KEY) {
      dbConf.options.sslKey = fs.readFileSync(process.env.MONGO_SSL_KEY);
    }
    if (process.env.MONGO_SSL_CERT) {
      dbConf.options.sslCert = fs.readFileSync(process.env.MONGO_SSL_CERT);
    }
    break;
  case 'development':
  default:
    console.log('NODE_ENV == development');
    port = nconf.get('devPort') || port || 8080;
    dbConf.name = nconf.get('devDBName') || dbConf.name;
    delete dbConf.options.sslKey;
    delete dbConf.options.sslCert;
    delete dbConf.options.user;
    delete dbConf.options.pass;
    delete dbConf.options.ssl;
    break;
}

console.log('connecting to database at:', dbConf.host);
console.log(`database name: '${dbConf.name}'`);

const buildMongoUri = (host, name) => {
  // If host is a full mongodb URI that already includes db name, use as-is.
  if (typeof host === 'string' && host.startsWith('mongodb')) {
    // If it already has a trailing /dbname, return host; otherwise append /name.
    const hasDb = /mongodb(\+srv)?:\/\/[^/]+\/[^/?]+/.test(host);
    return hasDb ? host : `${host.replace(/\/+$/, '')}/${name}`;
  }
  return `mongodb://${host}/${name}`;
};

const mongoUri = buildMongoUri(dbConf.host, dbConf.name);

console.info(`process.env.NODE_ENV: ${process.env.NODE_ENV}`);
console.info(`Port: ${String(port)}`);
console.info(`db name: ${dbConf.name}`);

// --- CORE MIDDLEWARE ---
server.use(logger('dev'));
server.use(express.json({ limit: '25mb' })); // safer than 100MB
server.use(express.urlencoded({ extended: false }));
server.use(cookieParser());

// CORS: allow Ember dev server without --proxy in development
// - With credentials: reflect explicit origin
// - In prod: allow configured origin; if not set, no credentials + *
const isDev = process.env.NODE_ENV === 'development';
const devOrigin = 'http://localhost:4200';
const corsOrigin = isDev
  ? devOrigin
  : process.env.CORS_ORIGIN || '*';

server.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, corsOrigin === '*' ? '*' : false);
      if (corsOrigin === '*' || origin === corsOrigin) return cb(null, origin);
      return cb(null, false);
    },
    credentials: isDev || (!!process.env.CORS_ORIGIN && process.env.CORS_ORIGIN !== '*'),
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization'
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })
);

// Legacy/manual CORS headers for safety (kept minimal & consistent)
server.use((req, res, next) => {
  if (isDev) {
    res.header('Access-Control-Allow-Origin', devOrigin);
    res.header('Access-Control-Allow-Credentials', 'true');
  } else if (process.env.CORS_ORIGIN && process.env.CORS_ORIGIN !== '*') {
    res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN);
    res.header('Access-Control-Allow-Credentials', 'true');
  } else {
    res.header('Access-Control-Allow-Origin', '*');
  }
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Public assets under /public
server.use(express.static(expressPath.join(__dirname, 'public')));

// Path prep/validation + MT auth
server.use(pathMw.prep());
server.use(pathMw.processPath());
server.use(mtAuth.prepareMtUser);
server.use(mtAuth.prepareEncUser);

// --- PUBLIC (UNPROTECTED) ROUTES ---
// Image/PDF upload endpoints (keep before protect if they’re public; otherwise move below)
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: multerMw.fileFilter,
});
const PDFUpload = multer({
  storage: multer.diskStorage({
    destination: multerMw.buildDestination,
    filename: multerMw.filename,
  }),
  fileFilter: multerMw.fileFilter,
});
server.post('/image', upload.array('photo', 200), api.post.images);
server.post('/pdf', PDFUpload.array('photo', 50), api.post.images);

// Local auth endpoints
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
server.put('/auth/sso/usernames', auth.ssoUpdateUsernames);

// Apply content validator before API
server.use(pathMw.validateContent());

// --- PROTECTED API ---
server.use('/api', userAuth.protect());

// VMT
server.get('/api/vmt/rooms/:id', pathMw.validateId(), api.get.vmtRoom);

// API GET
server.get('/api/users', api.get.users);
server.get('/api/users/:id', pathMw.validateId(), api.get.user);
server.get('/api/workspaces', paginate.middleware(20, 100), api.get.workspaces);
server.get('/api/workspaces/:id', pathMw.validateId(), api.get.workspace);
server.get('/api/folders', api.get.folders);
server.get('/api/folders/:id', pathMw.validateId(), api.get.folder);
server.get('/api/foldersets', api.get.folderSets);
server.get('/api/foldersets/:id', pathMw.validateId(), api.get.folderSet);
server.get('/api/pdSets', api.get.pdSets);
server.get('/api/submissions', api.get.submissions);
server.get('/api/submissions/:id', pathMw.validateId(), api.get.submission);
server.get('/api/selections', api.get.selections);
server.get('/api/selections/:id', pathMw.validateId(), api.get.selection);
server.get('/api/comments', paginate.middleware(100, 100), api.get.comments);
server.get('/api/comments/:id', pathMw.validateId(), api.get.comment);
server.get('/api/responses', api.get.responses);
server.get('/api/responses/:id', pathMw.validateId(), api.get.response);
server.get('/api/taggings', api.get.taggings);
server.get('/api/taggings/:id', pathMw.validateId(), api.get.tagging);
server.get('/api/problems', paginate.middleware(20, 100), api.get.problems);
server.get('/api/problems/:id', pathMw.validateId(), api.get.problem);
server.get('/api/answers', api.get.answers);
server.get('/api/answers/:id', pathMw.validateId(), api.get.answer);
server.get('/api/sections', api.get.sections);
server.get('/api/sections/:id', pathMw.validateId(), api.get.section);
server.get('/api/categories', api.get.categories);
server.get('/api/categories/:id', pathMw.validateId(), api.get.category);
server.get('/api/organizations', api.get.organizations);
server.get('/api/organizations/:id', pathMw.validateId(), api.get.organization);
server.get('/api/assignments', api.get.assignments);
server.get('/api/assignments/:id', pathMw.validateId(), api.get.assignment);
server.get('/api/images', api.get.images);
server.get('/api/images/:id', pathMw.validateId(), api.get.image);
server.get('/api/images/file/:id', pathMw.validateId(), api.get.imageFile);
server.get('/api/stats', api.get.stats);
server.get('/api/about', api.get.about);
server.get('/api/notifications', api.get.notifications);
server.get('/api/notifications/:id', pathMw.validateId(), api.get.notification);
server.get('/api/responseThreads/', paginate.middleware(25, 100), api.get.responseThreads);
server.get('/api/groups', api.get.groups);
server.get('/api/groups/:id', api.get.group);

// API POST
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
server.post('/api/groups', api.post.groups);
server.post('/api/newWorkspaceRequests', api.post.newWorkspaceRequest);
server.post('/api/import', api.post.import);
server.post('/api/importRequests', api.post.importSubmissionsRequest);
server.post('/api/vmtImportRequests', api.post.vmtImportRequests);

// API PUT
server.put('/api/folders/:id', pathMw.validateId(), api.put.folder);
server.put('/api/submissions/:id', pathMw.validateId(), api.put.submission);
server.put('/api/selections/:id', pathMw.validateId(), api.put.selection);
server.put('/api/comments/:id', pathMw.validateId(), api.put.comment);
server.put('/api/responses/:id', pathMw.validateId(), api.put.response);
server.put('/api/taggings/:id', pathMw.validateId(), api.put.tagging);
server.put('/api/users/:id', pathMw.validateId(), api.put.user);
server.put('/api/users/addSection/:id', pathMw.validateId(), api.put.user.addSection);
server.put('/api/users/removeSection/:id', pathMw.validateId(), api.put.user.removeSection);
server.put('/api/users/addAssignment/:id', pathMw.validateId(), api.put.user.addAssignment);
server.put('/api/users/removeAssignment/:id', pathMw.validateId(), api.put.user.removeAssignment);
server.put('/api/workspaces/:id', pathMw.validateId(), api.put.workspace);
server.put('/api/problems/:id', pathMw.validateId(), api.put.problem);
server.put('/api/problems/addCategory/:id', pathMw.validateId(), api.put.problem.addCategory);
server.put('/api/problems/removeCategory/:id', pathMw.validateId(), api.put.problem.removeCategory);
server.put('/api/answers/:id', pathMw.validateId(), api.put.answer);
server.put('/api/sections/:id', pathMw.validateId(), api.put.section);
server.put('/api/sections/addTeacher/:id', pathMw.validateId(), api.put.section.addTeacher);
server.put('/api/sections/removeTeacher/:id', pathMw.validateId(), api.put.section.removeTeacher);
server.put('/api/sections/addStudent/:id', pathMw.validateId(), api.put.section.addStudent);
server.put('/api/sections/removeStudent/:id', pathMw.validateId(), api.put.section.removeStudent);
server.put('/api/sections/addProblem/:id', pathMw.validateId(), api.put.section.addProblem);
server.put('/api/sections/removeProblem/:id', pathMw.validateId(), api.put.section.removeProblem);
server.put('/api/organizations/:id', pathMw.validateId(), api.put.organization);
server.put('/api/assignments/:id', pathMw.validateId(), api.put.assignment);
server.put('/api/notifications/:id', pathMw.validateId(), api.put.notification);
server.put('/api/groups/:id', api.put.groups);

// API DELETE
server.delete('/api/images/:id', pathMw.validateId(), api.delete.image);

// --- STATIC BUILD (Ember) ---
// BUILD_DIR should be 'dist' (dev build output you copy) or 'build' (prod), relative to repo root or absolute.
const buildDirName = process.env.BUILD_DIR || 'build';
const absBuild = expressPath.isAbsolute(buildDirName)
  ? buildDirName
  : expressPath.resolve(__dirname, '..', buildDirName);

console.log(`Serving Ember app from: ${absBuild}`);
if (fs.existsSync(absBuild)) {
  server.use(express.static(absBuild, { fallthrough: true }));

  // SPA fallback for non-API GETs
  const SPA_EXCLUDES = [
    /^\/api\//,
    /^\/auth\//,
    /^\/socket\.io/,
    /^\/image$/,
    /^\/pdf$/,
    /^\/images\/file\//,
    /^\/metrics/,
    /^\/favicon\.ico$/,
    /^\/robots\.txt$/,
    /^\/sitemap\.xml$/
  ];

  server.get('*', (req, res, next) => {
    if (SPA_EXCLUDES.some((re) => re.test(req.path))) return next();
    res.sendFile(expressPath.join(absBuild, 'index.html'));
  });
} else {
  console.warn(`Static build directory not found: ${absBuild}`);
}

// --- ERROR HANDLER ---
server.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Server error';
  console.error('Error handler:', status, message);
  res.status(status).json({ error: message });
});

// --- START FUNCTION (no side effects on import) ---
const start = async () => {
  const mainServer = http.createServer(server);

  // Initialize sockets after HTTP server created
  sockets.init(mainServer);
  socketListeners();

  try {
    await mongoose.connect(mongoUri, dbConf.options || {});
    console.log('Mongo connected');
  } catch (err) {
    console.error('Mongo connection failed:', err);
    process.exit(1);
  }

  const listenPort = Number(port) || 8080;
  server.set('port', listenPort);
  mainServer.listen(listenPort, () => {
    console.log(`Server listening on port ${listenPort}`);
  });

  const db = mongoose.connection;
  db.on('error', (err) => {
    console.error('Mongo runtime error:', err);
  });

  return mainServer;
};

// Only start if run directly (prevents build-time side effects)
if (require.main === module) {
  start();
}

// Export for tests or external starters
module.exports = { server, start };