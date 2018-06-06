/*
  The route matching behavior of this
  application.

  The string argument will be upcased,
  and have 'Route' appended. A matching
  constant will be looked up on your
  application's namespace. For child
  routes of a resource, the resource
  name is upcased and prepended. See
  http://emberjs.com/guides/routing/defining-your-routes/
  for more details.

  So, for the routes below to work we
  have to define
    Encompass.EncompassRoute
    Encompass.EncompassAllWorkspacesRoute
    Encompass.EncompassActiveWorkspacesRoute

  Loading the application with any of these
  urls will result in the correct data
  being fetched from the store and displayed.

  Entering into these states later will
  cause the correct data to be fetched and displayed.

  Child routes are entered by passing through
  their parents. This means parent routes can be used
  to fetch data and build parent view hierarchies
  and you can be sure this structure will occur whether
  you are starting the application directly at a particular
  route or entering that route at a later point.
*/
Encompass.Router.map(function() {
  this.route("login");
  this.route("unauthorized");

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

  this.route("users", function(){
    this.route("user", {resetNamespace: true, path: ':username'}, function(){
      //this.route("edit");
    });
    this.route("new");
  });
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
  // this.route("problem");
  this.route("problems", function(){
    this.route("problem", {resetNamespace: true, path: ':problem_id'}, function() {
    });
    this.route("new");
    });
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
  this.route("logout");
});
