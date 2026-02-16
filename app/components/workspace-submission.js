import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import $ from 'jquery';

export default class WorkspaceSubmissionComponent extends Component {
  @service currentUser;
  @service('utility-methods') utils;
  @service('workspace-permissions') permissions;
  @service navigation;
  @service('current-selection') currentSelectionService;

  @tracked makingSelection = true;
  @tracked showingSelections = false;
  @tracked isTransitioning = false;
  @tracked isDirty = false;
  @tracked wasShowingBeforeResizing = false;
  @tracked isSelectionsBoxExpanded = false;
  @tracked isMessageListenerAttached = false;
  @tracked areSelectionsHidden = false;
  @tracked wsSaveErrors = [];
  @tracked vmtReplayerInfo = null;
  @tracked vmtScreenshot = null;
  @tracked vmtListener = null;

  get currentSelection() {
    return this.currentSelectionService.selection;
  }

  get shouldCheck() {
    return this.makingSelection;
  }

  get areNoSelections() {
    return this.canSeeSelections && this.workspaceSelections.length === 0;
  }

  get canSeeSelections() {
    let cws = this.args.currentWorkspace;
    return this.permissions.canEdit(cws, 'selections', 1);
  }

  get workspaceSelections() {
    let subId = this.args.currentSubmission.id;
    return this.args.selections.filter((sel) => {
      return subId === this.utils.getBelongsToId(sel, 'submission');
    });
  }

  get trashedSelections() {
    return this.workspaceSelections.filter((selection) => selection.isTrashed);
  }

  get canSelect() {
    let cws = this.args.currentWorkspace;
    return this.permissions.canEdit(cws, 'selections', 2);
  }

  get cannotSeeSelections() {
    return !this.canSeeSelections;
  }

  get canDeleteSelection() {
    const workspace = this.args.currentWorkspace;
    return this.permissions.canEdit(workspace, 'selections', 4);
  }

  get submissionResponses() {
    return this.args.responses.filter((response) => {
      let subId = this.utils.getBelongsToId(response, 'submission');
      return subId === this.args.currentSubmission.id;
    });
  }

  get showSelectionsInfo() {
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
  }

  get selectionBoxClass() {
    if (this.areNoSelections) {
      return 'no-selections';
    }
    if (this.isSelectionsBoxExpanded) {
      return 'expanded';
    }
    return '';
  }

  get toggleSelectionInfo() {
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
  }

  get hideShowSelectionInfo() {
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
  }

  get showExpandSelections() {
    return !this.areNoSelections && !this.areSelectionsHidden;
  }

  @action
  setupResizeHandler() {
    let doneResizing;

    let handleResize = () => {
      if (this.showingSelections) {
        this.showingSelections = false;
        this.wasShowingBeforeResizing = true;

        clearTimeout(doneResizing);

        doneResizing = setTimeout(() => {
          if (this.wasShowingBeforeResizing) {
            this.showingSelections = true;
            this.wasShowingBeforeResizing = false;
          }
        }, 500);
      }

      if (this.wasShowingBeforeResizing) {
        clearTimeout(doneResizing);

        doneResizing = setTimeout(() => {
          if (this.wasShowingBeforeResizing) {
            this.showingSelections = true;
            this.wasShowingBeforeResizing = false;
          }
        }, 500);
      }
    };

    $(window).on('resize.selectableArea', handleResize);
  }

  @action
  toggleSelectionBox() {
    this.isSelectionsBoxExpanded = !this.isSelectionsBoxExpanded;
  }

  @action
  hideShowSelections() {
    this.areSelectionsHidden = !this.areSelectionsHidden;
  }

  @action
  onSelectionSelect() {
    if (this.isVmt) {
      let vmtStartTime = this.currentSelection.vmtInfo?.startTime;
      if (vmtStartTime >= 0) {
        let endTime = this.currentSelection.vmtInfo.endTime;
        this.setVmtReplayerTime(vmtStartTime, true, endTime);
        this.makingSelection = false;
      }
    }
  }

  @action
  viewResponses() {
    let getUrl = window.location;
    let baseUrl =
      getUrl.protocol +
      '//' +
      getUrl.host +
      '/' +
      getUrl.pathname.split('/')[1];

    window.open(
      `${baseUrl}#/responses/submission/${this.args.currentSubmission?.id}`,
      'newwindow',
      'width=1200, height=700'
    );
  }

  @action
  addSelection(selection, isUpdateOnly) {
    this.isDirty = true;

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

            this.args.addSelection(selection, isUpdateOnly);
          }
        });
    }
    this.args.addSelection(selection, isUpdateOnly);
  }

  @action
  toNewResponse() {
    this.navigation.toNewResponse(
      this.args.currentSubmission.id,
      this.args.currentWorkspace.id
    );
  }

  @action
  deleteSelection(selection) {
    this.isDirty = true;
    this.args.deleteSelection(selection);
  }

  @action
  showSelections() {
    this.showingSelections = true;
  }

  @action
  hideSelections() {
    this.showingSelections = false;
  }

  @action
  toggleShow() {
    this.showingSelections = !this.showingSelections;
  }

  @action
  toggleSelecting() {
    if (this.isVmt && !this.makingSelection) {
      // take screen shot of current replayer first
      let imgSrc = this.takeVmtScreenshot();

      this.vmtScreenshot = imgSrc;
      this.makingSelection = !this.makingSelection;
    } else {
      this.makingSelection = !this.makingSelection;
    }
  }

  @action
  handleTransition(isBeginning) {
    if (isEmpty(isBeginning)) {
      return;
    }
    if (isBeginning === true) {
      this.isTransitioning = true;
    } else {
      this.isTransitioning = false;
    }
  }

  @action
  async openProblem() {
    const problemId = await this.args.currentSubmission?.answer?.problem?.id;
    if (!problemId) {
      return;
    }

    let getUrl = window.location;
    let baseUrl = getUrl.protocol + '//' + getUrl.host;

    window.open(
      `${baseUrl}/#/problems/${problemId}`,
      'newwindow',
      'width=1200, height=700'
    );
  }

  // Lifecycle hooks

  constructor() {
    super(...arguments);
    if (this.args.currentWorkspace?.workspaceType === 'parent') {
      this.makingSelection = false;
    }
  }

  didInsertElement() {
    super.didInsertElement(...arguments);
    this.setOwnHeight();
    this.setupResizeHandler();
    this.setupVmtListener();
  }

  didReceiveAttrs() {
    super.didReceiveAttrs(...arguments);
    this.setupVmtListener();
  }

  didRender() {
    super.didRender(...arguments);
    if (this.args.switching === true) {
      // Clear the switching flag after render is complete
      setTimeout(() => {
        // Notifies parent that switch is complete
      }, 0);
    }
  }

  setupVmtListener() {
    if (!this.isVmt) return;

    // Remove old listener if exists
    if (this.vmtListener) {
      window.removeEventListener('message', this.vmtListener);
    }

    let listener = this.onVmtMessage.bind(this);
    this.vmtListener = listener;
    window.addEventListener('message', listener);
  }

  setOwnHeight() {
    try {
      let submissionNav = document.getElementById('submission-nav');
      let revisionsNavHeight = submissionNav?.offsetHeight || 0;

      let element = this.element;
      if (element) {
        element.style.height = '100%';
        element.style.height = `calc(100% - ${revisionsNavHeight}px)`;
      }
    } catch (e) {
      // Silently fail if DOM elements don't exist
    }
  }

  willDestroy() {
    super.willDestroy(...arguments);

    // Clean up VMT listener
    if (this.vmtListener) {
      window.removeEventListener('message', this.vmtListener);
    }

    let workspace = this.args.currentWorkspace;
    if (!workspace) return;

    let doOnlyUpdateLastViewed = true;

    if (this.isDirty) {
      workspace.lastModifiedDate = new Date();
      workspace.lastModifiedBy = this.currentUser.user;
      doOnlyUpdateLastViewed = false;
    }
    workspace.doOnlyUpdateLastViewed = doOnlyUpdateLastViewed;
    workspace.lastViewed = new Date();
    workspace.save();
  }

  // Computed properties

  get isVmt() {
    return this.utils.isValidMongoId(
      this.args.currentSubmission?.vmtRoomInfo?.roomId
    );
  }

  get currentReplayerTime() {
    let ms = this.vmtReplayerInfo?.timeElapsed ?? 0;
    return this.utils.getTimeStringFromMs(ms);
  }

  get maxReplayerTime() {
    let ms = this.vmtReplayerInfo?.totalDuration ?? 0;
    return ms > 0 ? ms : 0;
  }

  // Methods

  takeVmtScreenshot() {
    // Need to pause replayer if playing
    let messageData = {
      messageType: 'VMT_PAUSE_REPLAYER',
    };
    window.postMessage(messageData);

    let canvases = this.element?.querySelectorAll('canvas') || [];
    let canvas = canvases[0];

    if (!canvas) {
      return;
    }
    return canvas.toDataURL();
  }

  setVmtReplayerTime(vmtStartTime, doAutoPlay, stopTime) {
    let messageData = {
      messageType: 'VMT_GO_TO_TIME',
      timeElapsed: vmtStartTime,
      doAutoPlay,
      stopTime,
    };

    window.postMessage(messageData);
  }

  onVmtMessage(event) {
    let allowedOrigin = window.location.origin;

    let { origin, data } = event;

    if (allowedOrigin !== origin) {
      return;
    }

    let { messageType, vmtReplayerInfo } = data;

    if (messageType === 'VMT_ON_REPLAYER_LOAD') {
      // set replayer to current selection start time if applicable
      let vmtStartTime = this.currentSelection?.vmtInfo?.startTime;
      if (vmtStartTime >= 0) {
        this.vmtReplayerInfo = vmtReplayerInfo;
        // set replayer to start point but do not auto play
        this.setVmtReplayerTime(vmtStartTime, false, null);
      }
    }

    if (messageType === 'VMT_UPDATE_REPLAYER') {
      this.vmtReplayerInfo = vmtReplayerInfo;
    }
  }

  get isOnVmtSelection() {
    if (!this.isVmt || !this.currentSelection?.vmtInfo) {
      return false;
    }
    return (
      this.currentSelection.vmtInfo.startTime >= 0 &&
      this.currentSelection.vmtInfo.endTime >= 0
    );
  }

  get isMakingVmtSelection() {
    return this.isVmt && this.makingSelection;
  }

  get currentClipStartTime() {
    return this.currentSelection?.vmtInfo?.startTime;
  }

  get currentClipEndTime() {
    return this.currentSelection?.vmtInfo?.endTime;
  }
}
