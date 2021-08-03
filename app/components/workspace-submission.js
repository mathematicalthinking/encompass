import Component from '@ember/component';
import { computed, observer } from '@ember/object';
import { inject as service } from '@ember/service';
/**
 * Passed in by template:
 * - currentSubmission
 *
 * selections come from this.currentSubmission.selections
 */
import { isEmpty } from '@ember/utils';
import $ from 'jquery';
import CurrentUserMixin from '../mixins/current_user_mixin';
import ErrorHandlingMixin from '../mixins/error_handling_mixin';
import VmtHostMixin from '../mixins/vmt-host';

export default Component.extend(
  CurrentUserMixin,
  ErrorHandlingMixin,
  VmtHostMixin,
  {
    tagName: '',
    elementId: 'workspace-submission-comp',
    classNameBindings: [
      'areNoSelections:no-selections',
      'isSelectionsBoxExpanded:expanded-selections',
      'areSelectionsHidden:selections-hidden',
      'isMakingVmtSelection:vmt-selecting',
      'makingSelection:is-selecting',
    ],
    utils: service('utility-methods'),
    permissions: service('workspace-permissions'),

    makingSelection: false,
    showingSelections: false,
    isTransitioning: false,
    isDirty: false,
    wsSaveErrors: [],
    wasShowingBeforeResizing: false,
    isSelectionsBoxExpanded: false,
    isMessageListenerAttached: false,

    showSelectableView: computed(
      'isTransitioning',
      'makingSelection',
      'showingSelections',
      'switching',
      function () {
        let making = this.makingSelection;
        let showing = this.showingSelections;
        let transitioning = this.isTransitioning;
        return (making || showing) && !transitioning && !this.switching;
      }
    ),

    shouldCheck: computed.reads('makingSelection'),

    areNoSelections: computed(
      'workspaceSelections.[]',
      'canSeeSelections',
      function () {
        return this.canSeeSelections && !this.workspaceSelections.length > 0;
      }
    ),

    didRender: function () {
      this._super(...arguments);
      if (this.switching) {
        this.set('switching', false);
      }
    },

    didReceiveAttrs() {
      this._super(...arguments);
      let listener = this.onVmtMessage.bind(this);

      if (this.isVmt) {
        this.set('vmtListener', listener);
        window.addEventListener('message', listener);
      }
    },

    didInsertElement() {
      // height should be 100% - the height of the revisions nav
      this.setOwnHeight();
      this._super(...arguments);
    },

    willDestroyElement: function () {
      if (this.vmtListener) {
        window.removeEventListener('message', this.vmtListener);
      }

      let workspace = this.currentWorkspace;

      let doOnlyUpdateLastViewed = true;

      if (this.isDirty) {
        workspace.set('lastModifiedDate', new Date());
        workspace.set('lastModifiedBy', this.currentUser);
        doOnlyUpdateLastViewed = false;
      }
      workspace.set('doOnlyUpdateLastViewed', doOnlyUpdateLastViewed);
      workspace.set('lastViewed', new Date());
      workspace.save();
      this._super(...arguments);
    },

    /* Next: get selections to show up */

    workspaceSelections: computed(
      'currentSubmission.id',
      'selections.[]',
      function () {
        let subId = this.currentSubmission.id;

        return this.selections.filter((sel) => {
          return subId === this.utils.getBelongsToId(sel, 'submission');
        });
      }
    ),

    trashedSelections: computed.filterBy('workspaceSelections', 'isTrashed'),

    canSelect: computed(
      'currentWorkspace.permissions.@each.{global,selections}',
      'currentUser.id',
      function () {
        let cws = this.currentWorkspace;
        return this.permissions.canEdit(cws, 'selections', 2);
      }
    ),

    canDeleteSelection: computed(
      'currentWorkspace.permissions.@each.{global,selections}',
      'currentUser.id',
      function () {
        const workspace = this.currentWorkspace;
        return this.permissions.canEdit(workspace, 'selections', 4);
      }
    ),

    submissionResponses: computed(
      'currentSubmission.id',
      'responses.[]',
      function () {
        return this.responses.filter((response) => {
          let subId = this.utils.getBelongsToId(response, 'submission');
          return subId === this.currentSubmission.id;
        });
      }
    ),

    showSelectionsInfo: computed('showingSelections', function () {
      if (this.showingSelections) {
        return {
          text: 'Hide Selections',
          icon: 'far fa-eye-slash',
          title: 'Hide Selections',
        };
      }

      return {
        text: 'Show Selections',
        icon: 'far fa-eye',
        title: 'Show Selections',
      };
    }),

    selectionBoxClass: computed(
      'areNoSelections',
      'isSelectionBoxExpanded',
      function () {
        if (this.areNoSelections) {
          return 'no-selections';
        }
        if (this.isSelectionBoxExpanded) {
          return 'expanded';
        }

        return '';
      }
    ),

    toggleSelectionInfo: computed('isSelectionsBoxExpanded', function () {
      if (this.isSelectionsBoxExpanded) {
        return {
          imgName: 'chevrons-down.svg',
          className: 'shrink-selection-box',
          title: 'collapse',
          alt: 'Collapse',
        };
      }
      return {
        imgName: 'chevrons-up.svg',
        className: 'expand-selection-box',
        title: 'expand',
        alt: 'Expand',
      };
    }),

    hideShowSelectionInfo: computed('areSelectionsHidden', function () {
      if (this.areSelectionsHidden) {
        return {
          className: 'far fa-eye',
          title: 'show selections',
        };
      }
      return {
        className: 'far fa-eye-slash',
        title: 'hide selections',
      };
    }),

    showExpandSelections: computed(
      'areNoSelections',
      'areSelectionsHidden',
      function () {
        return !this.areNoSelections && !this.areSelectionsHidden;
      }
    ),

    setOwnHeight() {
      let revisionsNavHeight = $('#submission-nav').height();
      this.$().css('height', '100%').css('height', `-=${revisionsNavHeight}px`);
    },

    handleNavChanges: observer('isNavMultiLine', 'parentHeight', function () {
      this.setOwnHeight();
    }),
    isVmt: computed('currentSubmission.vmtRoomInfo.roomId', function () {
      return this.utils.isValidMongoId(
        this.currentSubmission.vmtRoomInfo.roomId
      );
    }),

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

    isMakingVmtSelection: function () {
      return this.isVmt && this.makingSelection;
    },

    currentReplayerTime: computed('vmtReplayerInfo.timeElapsed', function () {
      let ms = this.vmtReplayerInfo.timeElapsed;

      return this.utils.getTimeStringFromMs(ms);
    }),

    maxReplayerTime: computed('vmtReplayerInfo.totalDuration', function () {
      let ms = this.vmtReplayerInfo.totalDuration;
      return ms > 0 ? ms : 0;
    }),

    setVmtReplayerTime(vmtStartTime, doAutoPlay, stopTime) {
      let messageData = {
        messageType: 'VMT_GO_TO_TIME',
        timeElapsed: vmtStartTime,
        doAutoPlay,
        stopTime,
      };

      window.postMessage(messageData);
    },

    onVmtMessage(event) {
      let allowedOrigin = window.location.origin;

      let { origin, data } = event;

      if (allowedOrigin !== origin) {
        return;
      }

      let canSet = !this.isDestroying && !this.isDestroyed;

      let { messageType, vmtReplayerInfo } = data;

      if (messageType === 'VMT_ON_REPLAYER_LOAD') {
        // set replayer to current selection start time if applicable
        let vmtStartTime = this.currentSelection.vmtInfo.startTime;
        if (vmtStartTime >= 0 && canSet) {
          this.set('vmtReplayerInfo', vmtReplayerInfo);
          // set replayer to start point but do not auto play
          this.setVmtReplayerTime(vmtStartTime, false, null);
        }
      }

      if (messageType === 'VMT_UPDATE_REPLAYER' && canSet) {
        this.set('vmtReplayerInfo', vmtReplayerInfo);
      }
    },

    isOnVmtSelection: computed(
      'currentSelection.vmtInfo.{startTime,endTime}',
      function () {
        return (
          this.currentSelection.vmtInfo.startTime >= 0 &&
          this.currentSelection.vmtInfo.endTime >= 0
        );
      }
    ),

    currentClipStartTime: computed.reads('currentSelection.vmtInfo.startTime'),
    currentClipEndTime: computed.reads('currentSelection.vmtInfo.endTime'),

    actions: {
      addSelection: function (selection, isUpdateOnly) {
        this.set('isDirty', true);

        let currentReplayerTime = this.currentReplayerTime;
        let maxReplayerTime = this.maxReplayerTime;

        let placeholder = 'hh:mm:ss';

        if (this.isVmt) {
          return window
            .swal({
              title: 'Provide a start and end time for this selection.',
              html: `
          <input id="swal-input-vmt-start" value=${currentReplayerTime} placeholder=${placeholder} name="vmt-selection-start" class="swal2-input vmt-selection">
          To
          <input id="swal-input-vmt-end" value=${currentReplayerTime} class="swal2-input vmt-selection" placeholder=${placeholder} name="vmt-selection-end">`,
              focusConfirm: false,
              showCancelButton: true,
              cancelButtonText: 'Cancel',
              preConfirm: () => {
                let [start, end] = [
                  document.getElementById('swal-input-vmt-start').value,
                  document.getElementById('swal-input-vmt-end').value,
                ];

                let startNum = this.utils.extractMsFromTimeString(start);
                let endNum = this.utils.extractMsFromTimeString(end);

                let areValidNums = startNum >= 0 && endNum >= 0;
                if (!areValidNums) {
                  return window.swal.showValidationMessage(
                    'Please enter timestamps in format of hh:mm:ss'
                  );
                }

                let isInvalidRange = startNum > endNum;

                if (isInvalidRange) {
                  return window.swal.showValidationMessage(
                    'Start time cannot be after end time.'
                  );
                }

                if (endNum > maxReplayerTime) {
                  endNum = maxReplayerTime;
                }

                return [startNum, endNum];
              },
            })
            .then((result) => {
              if (result.value) {
                // startTime, endTime in ms
                let [startTime, endTime] = result.value;
                selection.vmtInfo = {
                  startTime: startTime,
                  endTime: endTime,
                };

                return this.sendAction('addSelection', selection, isUpdateOnly);
              }
            });
        }
        this.sendAction('addSelection', selection, isUpdateOnly);
      },

      deleteSelection: function (selection) {
        this.set('isDirty', true);
        this.sendAction('deleteSelection', selection);
      },

      showSelections: function () {
        this.set('showingSelections', true);
      },

      hideSelections: function () {
        this.set('showingSelections', false);
      },
      toggleShow: function () {
        this.toggleProperty('showingSelections');
      },
      toggleSelecting: function () {
        if (this.isVmt && !this.makingSelection) {
          // take screen shot of current replayer first
          let imgSrc = this.takeVmtScreenshot();

          this.set('vmtScreenshot', imgSrc);

          this.toggleProperty('makingSelection');
        } else {
          this.toggleProperty('makingSelection');
        }
      },
      handleTransition: function (isBeginning) {
        this.showSelectableView;
        if (isEmpty(isBeginning)) {
          return;
        }
        if (isBeginning === true) {
          this.set('isTransitioning', true);
        } else {
          this.set('isTransitioning', false);
        }
      },
      openProblem: function () {
        let answer = this.currentSubmission.get('answer');
        let problem = answer.get('problem');
        let problemId = problem.get('id');

        let getUrl = window.location;
        let baseUrl =
          getUrl.protocol +
          '//' +
          getUrl.host +
          '/' +
          getUrl.pathname.split('/')[1];

        window.open(
          `${baseUrl}#/problems/${problemId}`,
          'newwindow',
          'width=1200, height=700'
        );
      },
      toNewResponse: function (subId, wsId) {
        this.toNewResponse(subId, wsId);
      },

      setupResizeHandler() {
        let doneResizing;

        let handleResize = () => {
          if (this.showingSelections) {
            this.set('showingSelections', false);
            this.set('wasShowingBeforeResizing', true);

            clearTimeout(doneResizing);

            doneResizing = setTimeout(() => {
              if (this.wasShowingBeforeResizing) {
                this.set('showingSelections', true);
                this.set('wasShowingBeforeResizing', false);
              }
            }, 500);
          }

          if (this.wasShowingBeforeResizing) {
            clearTimeout(doneResizing);

            doneResizing = setTimeout(() => {
              if (this.wasShowingBeforeResizing) {
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
        if (this.isVmt) {
          let vmtStartTime = this.currentSelection.vmtInfo.startTime;
          if (vmtStartTime >= 0) {
            let endTime = this.currentSelection.vmtInfo.endTime;
            this.setVmtReplayerTime(vmtStartTime, true, endTime);
            this.set('makingSelections', false);
          }
        }
      },
      viewResponses() {
        let getUrl = window.location;
        let baseUrl =
          getUrl.protocol +
          '//' +
          getUrl.host +
          '/' +
          getUrl.pathname.split('/')[1];

        window.open(
          `${baseUrl}#/responses/submission/${this.currentSubmission.id}`,
          'newwindow',
          'width=1200, height=700'
        );
      },
    },
  }
);
