//This file exposes the required modules as window vars
//The alternative would be to use browserify --standalone
//  browserify common/thing.js --s Thing > build/common_bundle.js
window.Permissions = require('./permissions.js');
window.Properties  = require('./properties.js');
