/**
 * Passed in by template:
 * - currentSubmission
 *
 * selections come from this.currentSubmission.selections
 */
Encompass.WorkspaceSubmissionComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, Encompass.VmtHostMixin, {
  elementId: 'workspace-submission-comp',
  classNameBindings: ['areNoSelections:no-selections', 'isSelectionsBoxExpanded:expanded-selections', 'areSelectionsHidden:selections-hidden', 'isMakingVmtSelection:vmt-selecting','makingSelection:is-selecting'],
  utils: Ember.inject.service('utility-methods'),
  permissions: Ember.inject.service('workspace-permissions'),

  makingSelection: false,
  showingSelections: false,
  isTransitioning: false,
  isDirty: false,
  wsSaveErrors: [],
  wasShowingBeforeResizing: false,
  isSelectionsBoxExpanded: false,
  isMessageListenerAttached: false,

  showSelectableView: Ember.computed('makingSelection', 'showingSelections', 'isTransitioning', function() {
    let making = this.get('makingSelection');
    let showing = this.get('showingSelections');
    let transitioning = this.get('isTransitioning');
    return (making || showing) && !transitioning && !this.switching;
  }),

  shouldCheck: Ember.computed('makingSelection', function() {
    return this.get('makingSelection');
  }),

  areNoSelections: function() {
    return this.get('canSeeSelections') && !this.get('workspaceSelections.length') > 0;
  }.property('workspaceSelections.[]', 'canSeeSelections'),

  didRender: function() {
    if(this.get('switching')) {
      this.set('switching', false);
    }
  },

  didReceiveAttrs() {
    if (this.get('isVmt') && !this.get('isMessageListenerAttached')) {
      window.addEventListener('message', this.onVmtMessage.bind(this), false);
      this.set('isMessageListenerAttached', true);
    }

    if (!this.get('isVmt') && this.get('isMessageListenerAttached')) {
      window.removeEventListener('message');
      this.set('isMessageListenerAttached', false);
    }
    this._super(...arguments);
  },

  didInsertElement() {
    // height should be 100% - the height of the revisions nav
    this.setOwnHeight();
    this._super(...arguments);
  },

  willDestroyElement: function() {
    window.removeEventListener('message');

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

  showSelectionsInfo: function() {
    if (this.get('showingSelections')) {
      return {
        text: 'Hide Selections',
        icon: 'far fa-eye-slash',
        title: 'Hide Selections'
      };
    }

    return {
      text: 'Show Selections',
      icon: 'far fa-eye' ,
      title: 'Show Selections'
    };

  }.property('showingSelections'),

  selectionBoxClass: function() {
    if (this.get('areNoSelections')) {
      return 'no-selections';
    }
    if (this.get('isSelectionBoxExpanded')) {
      return 'expanded';
    }

    return '';
  }.property('areNoSelections', 'isSelectionBoxExpanded'),

  toggleSelectionInfo: function() {
    if (this.get('isSelectionsBoxExpanded')) {
      return {
        imgName: 'chevrons-down.svg',
        className: 'shrink-selection-box',
        title: 'collapse',
        alt: 'Collapse'
      };
    }
    return {
      imgName: 'chevrons-up.svg',
      className: 'expand-selection-box',
      title: 'expand',
      alt: 'Expand'
    };
  }.property('isSelectionsBoxExpanded'),

  hideShowSelectionInfo: function() {
    if (this.get('areSelectionsHidden')) {
      return {
        className: 'far fa-eye',
        title: 'show selections',
      };
    }
    return {
      className: 'far fa-eye-slash',
      title: 'hide selections',
    };
  }.property('areSelectionsHidden'),

  showExpandSelections: function() {
    return !this.get('areNoSelections') && !this.get('areSelectionsHidden');
  }.property('areNoSelections', 'areSelectionsHidden'),

  setOwnHeight() {
    let revisionsNavHeight = $('#submission-nav').height();
    this.$().css('height', '100%').css('height', `-=${revisionsNavHeight}px`);
  },

  handleNavChanges: function() {
    this.setOwnHeight();
  }.observes('isNavMultiLine', 'parentHeight'),
  isVmt: function() {
    return this.get('utils').isValidMongoId(this.get('currentSubmission.vmtRoomInfo.roomId'));
  }.property('currentSubmission.vmtRoomInfo.roomId'),

  takeVmtScreenshot() {
    // Need to pause replayer if playing
    let messageData = {
      messageType: 'VMT_PAUSE_REPLAYER',
    };

    window.postMessage(messageData);

    let canvases = this.$('canvas');
    let canvas;

    if (canvases.length > 1) {
      // geogebra
      canvas = canvases.filter('.cursor_hit')[0];
    } else {
      // desmos
      canvas = canvases[0];
    }
    let imgSrc = canvas.toDataURL();
    return imgSrc;
  },

  isMakingVmtSelection: function() {
    return this.get('isVmt') && this.get('makingSelection');
  },

  currentReplayerTime: function() {
    let ms = this.get('vmtReplayerInfo.timeElapsed');

    return this.get('utils').getTimeStringFromMs(ms);
  }.property('vmtReplayerInfo.timeElapsed'),

  maxReplayerTime: function() {
    let ms = this.get('vmtReplayerInfo.totalDuration');
    return ms > 0 ? ms : 0;
  }.property('vmtReplayerInfo.totalDuration'),

  setVmtReplayerTime(vmtStartTime) {
    let messageData = {
      messageType: 'VMT_GO_TO_TIME',
      timeElapsed: vmtStartTime
    };

    window.postMessage(messageData);
  },

  onVmtMessage(event) {
    let allowedOrigin = window.location.origin;

    let { origin, data } = event;

    if (allowedOrigin !== origin) {
      return;
    }

    let { messageType } = data;

    if (messageType === "VMT_ON_REPLAYER_LOAD") {
      // set replayer to current selection start time if applicable
      let vmtStartTime = this.get('currentSelection.vmtInfo.startTime');
      if (vmtStartTime >= 0) {
        this.setVmtReplayerTime(vmtStartTime);

      }
    }
  },

  actions: {
    addSelection: function( selection, isUpdateOnly ){
      this.set('isDirty', true);

      let currentReplayerTime = this.get('currentReplayerTime');
      let maxReplayerTime = this.get('maxReplayerTime');

      let placeholder = 'hh:mm:ss';

      if (this.get('isVmt')) {
        return window.swal({
          title: 'Provide a start and end time for this selection.',
          html:
          `
          <input id="swal-input-vmt-start" value=${currentReplayerTime} placeholder=${placeholder} name="vmt-selection-start" class="swal2-input vmt-selection">
          To
          <input id="swal-input-vmt-end" value=${currentReplayerTime} class="swal2-input vmt-selection" placeholder=${placeholder} name="vmt-selection-end">`,
          focusConfirm : false,
          showCancelButton: true,
          cancelButtonText: 'Cancel',
          preConfirm: () => {
            let [start, end ] = [
              document.getElementById('swal-input-vmt-start').value,
              document.getElementById('swal-input-vmt-end').value
            ];

            let startNum = this.get('utils').extractMsFromTimeString(start);
            let endNum = this.get('utils').extractMsFromTimeString(end);

            let areValidNums = (startNum >= 0 && endNum >= 0);
            if (!areValidNums) {
               return window.swal.showValidationMessage('Please enter timestamps in format of hh:mm:ss');
            }

            let isInvalidRange = startNum > endNum;

            if (isInvalidRange) {
              return window.swal.showValidationMessage('Start time cannot be after end time.');
            }

            if (endNum > maxReplayerTime) {
              endNum = maxReplayerTime;
            }

            return [startNum, endNum];
          }
        })
        .then((result) => {
          if (result.value) {
            // startTime, endTime in ms
            let [ startTime, endTime ] = result.value;
            selection.vmtInfo =  {
              startTime : startTime,
              endTime: endTime,
            };

            return this.sendAction( 'addSelection', selection, isUpdateOnly );

          }
        });
      }
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
    toggleShow: function() {
      this.toggleProperty('showingSelections');
    },
    toggleSelecting: function() {
      if (this.get('isVmt') && !this.get('makingSelection')) {
        // take screen shot of current replayer first
        let imgSrc = this.takeVmtScreenshot();

        this.set('vmtScreenshot', imgSrc);
        this.set('vmtReplayerInfo', window.vmtReplayerInfo);

        this.toggleProperty('makingSelection');

      } else {
        this.toggleProperty('makingSelection');
      }
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

      $(window).on('resize.selectableArea', handleResize);
    },
    toggleSelectionBox() {
      this.toggleProperty('isSelectionsBoxExpanded');
    },

    hideShowSelections() {
      this.toggleProperty('areSelectionsHidden');
    },

    onSelectionSelect() {
      if (this.get('isVmt')) {
        let vmtStartTime = this.get('currentSelection.vmtInfo.startTime');
        if (vmtStartTime >= 0) {
          this.setVmtReplayerTime(vmtStartTime);
      }
    }
  }
}
});

