/*
  This is the map of all the routes and their child routes for EnCoMPASS
*/

Encompass.Router.map(function() {
  // AUTH PARENT ROUTE
  this.route("auth", function(){
    this.route("login");
    this.route("signup");
    this.route("forgot");
    this.route("reset", {path: '/reset/:token'});
    this.route("confirm", {path: '/confirm/:token'});
  });
  // PROBLEMS PARENT ROUTE
  this.route("problems", function(){
    this.route("problem", {resetNamespace: true, path: '/:problemId'}, function() {
    });
    this.route("new");
  });
  // SECTIONS ROUTE
  this.route("sections", function(){
    this.route("section", {resetNamespace: true, path: '/:sectionId'}, function() {
    });
    this.route("new");
    this.route('home');
  });

  // WORKSPACES PARENT ROUTE
  this.route("workspaces", function(){
    this.route("index", {path: "/"});
    this.route("mine");
    this.route("public");
    this.route("new");
    this.route("workspace", {resetNamespace: true, path: '/:workspace_id'}, function(){
    //this.resource("workspace", {path: '/:workspace_id'}, function(){
      this.route("info", {path: "/info"});
      this.route("work", {path: "/work"});
      this.route("folders", {resetNamespace: false, path: '/folders'}, function(){
        this.route("workspace.folder", {resetNamespace: true, path: '/:folder_id'}, function(){
        });
      });
      this.route("submissions", {resetNamespace: false, path: '/submissions'}, function(){
        this.route("first", {path: "/first"});
        // this.resource("workspace.submission", {path: '/:submission_id'}, function()
        this.route("workspace.submission", {resetNamespace: true, path: '/:submission_id'}, function(){
          this.route("response");
          this.route("workspace.submission.selections", {resetNamespace: true, path: '/selections'}, function(){
            this.route("workspace.submission.selection", {resetNamespace: true, path: '/:selection_id'}, function(){
            });
          });
        });
      });
    });
  });
  // RESPONSES PARENT ROUTE
  this.route("responses", function(){
    this.route("responses.new", {resetNamespace: true, path: '/new'}, function() {
      this.route("submission", {path: '/submission/:submission_id'});
      this.route("workspace",  {path: '/workspace/:workspace_id'});
      this.route("folder",     {path: '/folder/:folder_id'});
    });
    this.route("response", {resetNamespace: true, path: '/:response_id'}, function(){
      //this.route("print");
    });
  });
  // USERS PARENT ROUTE
  this.route("users", function(){
    this.route("user", {resetNamespace: true, path: '/:username'}, function(){
      //this.route("edit");
    });
    this.route("new");
    this.route('home');
  });
  // IMPORT ROUTE
  this.route("import", function() {

  });

  // ASSIGNMENTS ROUTE
  this.route("assignments", function(){
    this.route("assignment", {resetNamespace: true, path: '/:assignmentId'}, function() {
    });
    this.route("new");
    this.route('home');
  });

  // ANSWERS ROUTE
  this.route("answers", function(){
    this.route("answer", {resetNamespace: true, path: '/:answerId'}, function() {
    });
    this.route("new");
    this.route('home');
  });
  this.route('error', { path: '/*path'});
  this.route("logout");
  this.route("unconfirmed");
  this.route("unauthorized");
});


/*
  this.resource("comments", function(){
    this.route("index", {path: "/"}); //this might show the list of comments, but is here for testing for now
  });
  this.resource("folders", function(){
    this.route("index", {path: "/"}); //this might show the list of top level folders only, but is here for testing for now
    this.route("edit", {path: '/:folder_id/edit'}, function() {
    });
  });
  this.resource("selections", function(){
    this.route("index", {path: "/"}); //this might show the list of selections, but is here for testing for now
  });
  */