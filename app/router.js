/*
  This is the map of all the routes and their child routes for EnCoMPASS
*/

Encompass.Router.map(function() {
  // INDEX HOME-PAGE
  this.route("index", { path: "/" }); //renders templates/index.hbs
  // AUTH PARENT ROUTE
  this.route("auth", function(){
    this.route("login"); // templates/auth/login.hbs
    this.route("signup"); // templaste/auth/signup.hbs
    this.route("forgot"); //templates/auth/forgot.hbs
    this.route("reset", {path: '/reset/:token'}); //templates/auth/reset.hbs
    this.route("confirm", {path: '/confirm/:token'}); //templates/auth/confirm.hbs
  });
  // PROBLEMS PARENT ROUTE
  this.route("problems", function(){ // templates/problems/problems.hbs
    this.route("problem", {resetNamespace: true, path: '/:problemId'}, function() {
    }); // templates/problems/problem.hbs
    this.route("new"); // templates/problems/new.hbs
  });
  // SECTIONS ROUTE
  this.route("sections", function(){
    this.route("section", {resetNamespace: true, path: '/:sectionId'}, function() {
    });
    this.route("new");
  });

  // WORKSPACES PARENT ROUTE
  this.route("workspaces", function(){ // templates/workspaces/workspaces.hbs
    this.route("index", {path: "/"}); // templates/workspaces/workspaces.hbs
    // this.route("mine");
    // this.route("public");
    this.route("new"); // templates/workspaces/new.hbs
    this.route("copy"); // templates/workspaces/copy.hbs
    this.route("workspace", {resetNamespace: true, path: '/:workspace_id'}, function(){ //templates/workspace/submission.hbs
    //this.resource("workspace", {path: '/:workspace_id'}, function(){
      this.route("info", {path: "/info"}); // templates/workspace/info.hbs
      this.route("work", {path: "/work"}); // redirects to workspace/workspace? is used as main link, though
      this.route("folders", {resetNamespace: false, path: '/folders'}, function(){ // no template
        this.route("workspace.folder", {resetNamespace: true, path: '/:folder_id'}, function(){ // templates/folders/edit.hbs
        });
      });
      this.route("submissions", {resetNamespace: false, path: '/submissions'}, function(){
        this.route("first", {path: "/first"});
        // this.resource("workspace.submission", {path: '/:submission_id'}, function()
        this.route("workspace.submission", {resetNamespace: true, path: '/:submission_id'}, function(){
          this.route("response"); //doesn't do anything?
          this.route("workspace.submission.selections", {resetNamespace: true, path: '/selections'}, function(){ //no template
            this.route("workspace.submission.selection", {resetNamespace: true, path: '/:selection_id'}, function(){ //highighted portion of student work
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
    this.route("submission", {path: '/submission/:submission_id'});
    this.route("response", {resetNamespace: true, path: '/:response_id'}, function(){
      //this.route("print");
    });
  });
  // USERS PARENT ROUTE
  this.route("users", function(){ //users/index.hbs
    this.route("user", {resetNamespace: true, path: '/:username'}, function(){ //users/user.hbs
      //this.route("edit");
    });
    this.route("new");
  });
  // IMPORT ROUTE
  this.route("import", function() {
  });

  // VMT
  this.route("vmt", function() {
    this.route("import");
  });

  // ASSIGNMENTS ROUTE
  this.route("assignments", function(){
    this.route("assignment", {resetNamespace: true, path: '/:assignmentId'}, function() {
    });
    this.route("new");
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
