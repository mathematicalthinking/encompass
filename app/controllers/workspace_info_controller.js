/**
  * # Workspace Info Controller
  * @description This controller for the workspace assists in linking between submissions
  * @todo Linking between submissions should really be moved to workspace_submissions_index_controller
  * @author Amir Tahvildaran <amir@mathforum.org>, Damola Mabogunje <damola@mathforum.org>
  * @since 1.0.0
*/
Encompass.WorkspaceInfoController = Ember.Controller.extend(Encompass.CurrentUserMixin, {

  comments: Ember.inject.controller(),

  isEditing: false,
  searchText: "",

  searchResults: function() {
    var searchText = this.get('searchText');
    searchText = searchText.replace(/\W+/g, "");
    if(searchText.length < 2) { return; }

    var people = this.store.find('user', { name: searchText });
    return people;
  }.property('searchText'),
  canEdit: function() {
    var canEdit = Permissions.userCanModifyWorkspace(this.get('currentUser'), this.get('model'));
    return canEdit;
  }.property('owner'),
  modes: function(){
    return Permissions.modeValues();
  }.property(),
  actions: {
    removeEditor: function(editor){
      var workspace = this.get('model');
      workspace.get('editors').removeObject(editor);
    },
    addEditor: function(editor){
      var workspace = this.get('model');
      if(!workspace.get('editors').contains(editor)) {
        workspace.get('editors').pushObject(editor);
      }
    },
    editWorkspace: function(){
      this.set('isEditing', true);
    },
    saveWorkspace: function(){
      var workspace = this.get('model');
      var controller = this;
      workspace.save().then(function(){
        controller.set('isEditing', false);
      });
    }
  }
});
