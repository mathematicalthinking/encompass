// server/index.js
'use strict';

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // REST API
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
      logLevel: 'warn',
    })
  );

  // socket.io (if used)
  app.use(
    '/socket.io',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      ws: true,
      changeOrigin: true,
      logLevel: 'warn',
    })
  );

  // auth endpoints (match your server.js)
  app.use(
    ['/auth', '/image', '/pdf'],
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
      logLevel: 'warn',
    })
  );
};