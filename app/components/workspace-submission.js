/**
 * Passed in by template:
 * - currentSubmission
 *
 * selections come from this.currentSubmission.selections
 */
Encompass.WorkspaceSubmissionComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, {
  elementId: 'workspace-submission-comp',

  utils: Ember.inject.service('utility-methods'),
  permissions: Ember.inject.service('workspace-permissions'),

  makingSelection: false,
  showingSelections: false,
  isTransitioning: false,
  isDirty: false,
  wsSaveErrors: [],
  wasShowingBeforeResizing: false,

  showSelectableView: Ember.computed('makingSelection', 'showingSelections', 'isTransitioning', function() {
    let making = this.get('makingSelection');
    let showing = this.get('showingSelections');
    let transitioning = this.get('isTransitioning');
    let ws = this.get('currentWorkspace');
    let canSelect = this.get('permissions').canEdit(ws, 'selections', 2);
    return (making || showing) && !transitioning && !this.switching && canSelect;
  }),

  shouldCheck: Ember.computed('makingSelection', function() {
    return this.get('makingSelection');
  }),

  didRender: function() {
    if(this.get('switching')) {
      this.set('switching', false);
    }
  },

  willDestroyElement: function() {
    let workspace = this.get('currentWorkspace');

    let doOnlyUpdateLastViewed = true;

    if (this.get('isDirty')) {
      workspace.set('lastModifiedDate', new Date());
      workspace.set('lastModifiedBy', this.get('currentUser'));
      doOnlyUpdateLastViewed = false;
    }
    workspace.set('doOnlyUpdateLastViewed', doOnlyUpdateLastViewed);
    workspace.set('lastViewed', new Date());
    workspace.save();
    this._super(...arguments);
  },

  /* Next: get selections to show up */

  workspaceSelections: function() {
    let subId = this.get('currentSubmission.id');

    return this.get('selections').filter((sel) => {
      return subId === this.get('utils').getBelongsToId(sel, 'submission');
    });

  }.property('currentSubmission.id', 'selections.[]'),

  trashedSelections: function() {
    return this.get('workspaceSelections').filterBy('isTrashed');
  }.property('workspaceSelections.@each.isTrashed'),

  canSelect: function () {
    let cws = this.get('currentWorkspace');
    return this.get('permissions').canEdit(cws, 'selections', 2);
  }.property('currentWorkspace.permissions.@each.{global,selections}', 'currentUser.id'),

  canDeleteSelection: function() {
    const workspace = this.get('currentWorkspace');
    return this.get('permissions').canEdit(workspace, 'selections', 4);
  }.property('currentWorkspace.permissions.@each.{global,selections}', 'currentUser.id'),

  submissionResponses: function() {
    return this.get('responses').filter((response) => {
      let subId = this.get('utils').getBelongsToId(response, 'submission');
      return subId === this.get('currentSubmission.id');
    });
  }.property('currentSubmission.id', 'responses.[]'),

  actions: {
    addSelection: function( selection, isUpdateOnly ){
      this.set('isDirty', true);
      this.sendAction( 'addSelection', selection, isUpdateOnly );
    },

    deleteSelection: function( selection ){
      this.set('isDirty', true);
      this.sendAction( 'deleteSelection', selection );
    },

    showSelections: function() {
      this.set('showingSelections', true);
    },

    hideSelections: function() {
      this.set('showingSelections', false);
    },
    toggleSelecting: function() {
      let selecting = this.get('makingSelection');
      this.set('makingSelection', !selecting);
    },
    handleTransition: function(isBeginning) {
      this.get('showSelectableView');
      if (Ember.isEmpty(isBeginning)) {
        return;
      }
      if (isBeginning === true) {
        this.set('isTransitioning', true);
      } else {
        this.set('isTransitioning', false);
      }
    },
    openProblem: function() {
      let answer = this.currentSubmission.get('answer');
      let problem = answer.get('problem');
      let problemId = problem.get('id');

      let getUrl = window.location;
      let baseUrl = getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];

      window.open(`${baseUrl}#/problems/${problemId}`, 'newwindow', 'width=1200, height=700');
    },
    toNewResponse: function(subId, wsId) {
      this.get('toNewResponse')(subId, wsId);
    },

    setupResizeHandler() {
      let doneResizing;

      let handleResize = () => {
        if (this.get('showingSelections')) {
          this.set('showingSelections', false);
          this.set('wasShowingBeforeResizing', true);

          clearTimeout(doneResizing);

          doneResizing = setTimeout(() => {
            if (this.get('wasShowingBeforeResizing')) {
              this.set('showingSelections', true);
              this.set('wasShowingBeforeResizing', false);
            }
          }, 500);
        }

        if (this.get('wasShowingBeforeResizing')) {
          clearTimeout(doneResizing);

          doneResizing = setTimeout(() => {
            if (this.get('wasShowingBeforeResizing')) {
              this.set('showingSelections', true);
              this.set('wasShowingBeforeResizing', false);
            }
          }, 500);
        }
      };

      $(window).on('resize', handleResize);
    }
  }
});

