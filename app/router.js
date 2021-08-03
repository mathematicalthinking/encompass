import EmberRouter from '@ember/routing/router';
import config from 'encompass/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  // INDEX HOME-PAGE
  this.route('index', { path: '/' });
  // AUTH PARENT ROUTE
  this.route('auth', function () {
    this.route('login');
    this.route('signup');
    this.route('forgot');
    this.route('reset', { path: '/reset/:token' });
    this.route('confirm', { path: '/confirm/:token' });
  });
  // PROBLEMS PARENT ROUTE
  this.route('problems', function () {
    this.route('problem', { resetNamespace: true, path: '/:problem_id' });
    this.route('new');
  });
  // SECTIONS ROUTE
  this.route('sections', function () {
    this.route('section', { path: '/:section_id' });
    this.route('new');
  });

  // WORKSPACES PARENT ROUTE
  this.route('workspaces', function () {
    this.route('index', { path: '/' });
    // this.route("mine");
    // this.route("public");
    this.route('new');
    this.route('copy');
    this.route(
      'workspace',
      { resetNamespace: true, path: '/:workspace_id' },
      function () {
        //this.resource("workspace", {path: '/:workspace_id'}, function(){
        this.route('info');
        this.route('work');
        this.route('folders', { resetNamespace: false }, function () {
          this.route(
            'folder',
            { resetNamespace: true, path: '/:folder_id' },
            function () {}
          );
        });
        this.route('submissions', { resetNamespace: false }, function () {
          this.route('first');
          // this.resource("workspace.submission", {path: '/:submission_id'}, function()
          this.route(
            'workspace-submission',
            { resetNamespace: true, path: '/:submission_id' },
            function () {
              this.route('response');
              this.route('selections', { resetNamespace: true }, function () {
                this.route(
                  'selection',
                  { resetNamespace: true, path: '/:selection_id' },
                  function () {}
                );
              });
            }
          );
        });
      }
    );
  });
  // RESPONSES PARENT ROUTE
  this.route('responses', function () {
    this.route(
      'responses.new',
      { resetNamespace: true, path: '/new' },
      function () {
        this.route('submission', { path: '/submission/:submission_id' });
        this.route('workspace', { path: '/workspace/:workspace_id' });
        this.route('folder', { path: '/folder/:folder_id' });
      }
    );
    this.route('submission', { path: '/submission/:submission_id' });
    this.route(
      'response',
      { resetNamespace: true, path: '/:response_id' },
      function () {
        //this.route("print");
      }
    );
  });
  // USERS PARENT ROUTE
  this.route('users', function () {
    this.route('user', { path: '/:user_id' });
    this.route('new');
  });
  // IMPORT ROUTE
  this.route('import', function () {});

  // VMT
  this.route('vmt', function () {
    this.route('import');
  });

  // ASSIGNMENTS ROUTE
  this.route('assignments', function () {
    this.route('assignment', { path: '/:assignment_id' });
    this.route('new');
  });

  // ANSWERS ROUTE
  this.route('answers', function () {
    this.route(
      'answer',
      { resetNamespace: true, path: '/:answerId' },
      function () {}
    );
    this.route('new');
    this.route('home');
  });
  this.route('error', { path: '/*path' });
  this.route('logout');
  this.route('unconfirmed');
  this.route('unauthorized');
});
