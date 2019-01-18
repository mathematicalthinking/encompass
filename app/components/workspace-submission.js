/**
 * Passed in by template:
 * - currentSubmission
 *
 * selections come from this.currentSubmission.selections
 */
Encompass.WorkspaceSubmissionComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, {
  makingSelection: true,
  showingSelections: false,
  isTransitioning: false,
  isDirty: false,
  wsSaveErrors: [],
  permissions: Ember.inject.service('workspace-permissions'),

  showSelectableView: Ember.computed('makingSelection', 'showingSelections', 'isTransitioning', function() {
    var making = this.get('makingSelection');
    var showing = this.get('showingSelections');
    var transitioning = this.get('isTransitioning');
    var ws = this.get('currentWorkspace');
    let canSelect = this.get('permissions').canEdit(ws, 'selections', 2);
    return (making || showing) && !transitioning && !this.switching && canSelect;
  }),

  shouldCheck: Ember.computed('makingSelection', function() {
    return this.get('makingSelection');
  }),



  init: function() {
    this._super(...arguments);
  },

  didRender: function() {
    if(this.get('switching')) {
      this.set('switching', false);
    }
  },

  didReceiveAttrs() {
    if (this.get('currentSubmission.id')) {
      this.fetchSubmissionResponses();
    }
    this._super(...arguments);
  },

  fetchSubmissionResponses() {
    if (!this.get('currentSubmission')) {
      return;
    }
    this.get('store').query('response', {
      filterBy: {
        submission: this.get('currentSubmission.id')
      }
    })
    .then((responses) => {
      if (!this.get('isDestroying') && !this.get('isDestroyed')) {
        this.set('submissionResponses', responses.toArray());
      }
    })
    .catch((err) => {
      this.handleErrors(err, 'dataFetchErr');
    });
  },

  willDestroyElement: function() {
    let workspace = this.get('currentWorkspace');

    if (this.get('isDirty')) {
      workspace.set('lastModifiedDate', new Date());
      workspace.set('lastModifiedBy', this.get('currentUser'));
    }
    workspace.save();
    this._super(...arguments);
  },

  /* Next: get selections to show up */

  workspaceSelections: function() {
    var selections = this.currentSubmission.get('selections');
    var comp = this;
    var selectionsInWorkspace = null;

    if( !Ember.isNone(selections) ) {
      selectionsInWorkspace = selections.filter( function( selection ){
        var selectionWs = selection.get('workspace.id');
        var thisWs = comp.get('currentWorkspace.id');

        return (selectionWs === thisWs);
      });
    }

    return selectionsInWorkspace;
  }.property('currentSubmission.selections.[]'),

  trashedSelections: function() {
    return this.get('workspaceSelections').filterBy('isTrashed');
  }.property('workspaceSelections.@each.isTrashed'),

  canSelect: function () {
    var cws = this.get('currentWorkspace');
    let canEdit = this.get('permissions').canEdit(cws, 'selections', 2);
    return canEdit;
  }.property('currentUser.username', 'currentWorkspace.owner.username', 'currentWorkspace.editors.[].username'),

  canDeleteSelection: function() {
    const workspace = this.get('currentWorkspace');
    return this.get('permissions').canEdit(workspace, 'selections', 4);
  }.property('currentSubmission.id', 'currentWorkspace.id', 'currentUser.id'),

  actions: {
    addSelection: function( selection ){
      this.set('isDirty', true);
      this.sendAction( 'addSelection', selection );
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
      var selecting = this.get('makingSelection');
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

      var getUrl = window.location;
      var baseUrl = getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];

      window.open(`${baseUrl}#/problems/${problemId}`, 'newwindow', 'width=1200, height=700');
    },
    toNewResponse: function(subId, wsId) {
      this.get('toNewResponse')(subId, wsId);
    }

  }
});

