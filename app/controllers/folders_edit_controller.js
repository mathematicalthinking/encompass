/**
  * # Folder Controller
  * TODO: - remove selection sometimes generates an error.
  *       - remove not reflected in the selection count on the workspace page.
  * @description This controls the editable view of an individual folder.
  *              It is used by the folders.edit route & template.
  * @authors Damola Mabogunje <damola@mathforum.org>, Amir Tahvildaran <amir@mathforum.org>
  * @todo This should probably be a view
  * @since 1.0.0
  */

Encompass.FoldersEditController = Ember.Controller.extend(Encompass.CurrentUserMixin, {
  workspace: Ember.inject.controller(),
  currentWorkspace: Ember.computed.alias('workspace.model'),
  browseOption: 1,
  bySelection: Ember.computed.equal('browseOption', 1),
  bySubmission: Ember.computed.equal('browseOption', 0),
  includeSubfolders: true,
  submissionsCol: true,
  selectionsCol: true,
  commentsCol: false,
  foldersCol: false,
  showSubmissionFolders: false,
  showSubmissionComments: false,
  showSubmissionSelections: true,
  showSubmissionSelectionsComments: false,
  showSubmissionSelectionsFolders: true,
  showSelectionSubmission: true,
  showSelectionComments: true,
  showSelectionFolders: true,

  showSubmissionSelectionsStuff: Ember.computed.or('showSubmissionSelectionsComments', 'showSubmissionSelectionsFolders'),
  permissions: Ember.inject.service('workspace-permissions'),

  canEdit: function() {

    const workspace = this.get('currentWorkspace');
    return this.get('permissions').canEdit(workspace, 'selections', 3);
  }.property('currentUser', 'currentWorkspace'),

  evidence: function() {
    if(this.get('includeSubfolders')){
      return this.model.get('_selections');
    }
    return this.model.get('cleanSelections');
  }.property('model.id', 'model.cleanSelections.[]', 'model._selections.[]', 'includeSubfolders'),

  selectedSubmissions: function() {
    if(this.get('includeSubfolders')){
      return this.model.get('_submissions');
    }
    return this.model.get('submissions');
  }.property('model', 'model.submissions.[]', 'model._submissions.[]', 'includeSubfolders'),

  // This is just groupBy i.e selections.groupBy(submission)
  selectionGroups: function () {
    var controller = this;
    var submissions = this.model.get('_selections').getEach('submission').uniq();
    var result = Ember.A();

    submissions.forEach(function(item) {
      var selections = controller.model.get('_selections').filterBy('submission', item);
      var rowspan = 1 + selections.length;

      result.addObject(Ember.Object.create({
        submission: item,
        content: selections,
        span: rowspan
      }));
    });

    return result;
  }.property('model._selections.@each.submission'),
/*
  path: function() {
    var path = [this.get('model')];
    var ancestor = this.get('model.parent');

    while(ancestor) {
      console.log(ancestor.get('parent'));
      path.push(ancestor.get('parent'));
      ancestor = ancestor.get('parent');
    }

    return path.reverseObjects();
  }.property('parent'),
*/
  actions: {
    changeSubmission: function(submission) {
      var selector = '.submissionLink.' + submission.get('id');
      if(window.opener) {
        window.opener.$(selector).click();
      } else {
        this.transitionToRoute('workspace.submission', this.get('currentWorkspace'), submission);
      }
    },

    changeSelection: function(selection) {
      var controller = this;
      var selector = '.selectionLink.' + selection.get('id');

      //console.log(selector);
      Ember.run(function() {
        controller.send('changeSubmission', selection.get('submission'));
        if(window.opener) {
          window.opener.$(selector).click();
        } else {
          controller.transitionToRoute('workspace.submission.selection',
            selection.get('workspace'),
            selection.get('submission'),
            selection);
        }
      });
    },

    removeSelection: function(selection, folder) { //ENC-574 Because a selection may also be in a sub-folder, also make the folder a param
      this.propertyWillChange('taggings');

//      console.log(selection, folder);
//      var selectionId = selection.get('id');
//      var folderId = folder.get('id');

      /* ENC-574
       * Find the unique tagging of both this selection and the passed folder
       * Note: This approach is performance intensive, leading to many requests
       * TODO: Optimize
       *
       */

      selection.get('taggings').then( function(taggings) {
        var tagging = taggings.findBy('folder', folder);
        if(tagging) { // This should always be true
          tagging.set('isTrashed', true);
          tagging.save().then((res) => {
            if (window.opener) {
              var selector = `#updateTaggings${folder.get('id')}`;
              window.opener.$(selector).click();
            }
          });
        }
      });

      //just don't reload per max's request it takes too much time
      //if(window.opener) { //if we are a popup
      //  // Refresh the workspace (opener) so the folder counts update...
      //  //   (We shouldn't need to do this (why? we might want to use socket.io))
      //  window.opener.location.reload(true);
      //}
    }
  }
});
