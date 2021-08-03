import Component from '@ember/component';
import { aliasMethod, computed } from '@ember/object';
/**
 * A draggable, droppoable folder element. Can hold selections, or other folders.
 *
 * Passed in from parent:
 * - model: The folder model for this component.
 * - currentWorkspace: The current workspace model.
 * - folderList: The parent component for this folder (may be able to get rid of that, or pass in an action)
 * - editFolderMode
 * - dropped: The action to trigger when something is dropped on this folder.
 *
 * TODO:
 * x showFolder
 * - onDrag styles should use classNameBindings
 * x Bubble up the fileSelectionInFolder event to the route (pass the action in the template, then in folder list, send it up again).
 * - Replace folderList reference with a passed in action.
 * - drag folder out, then put back in - it won't go back in until you refresh.  Ember seems to be sending the correct data to the server api.
 */
import { gt } from '@ember/object/computed';
import { next } from '@ember/runloop';
import { inject as service } from '@ember/service';
import CurrentUserMixin from '../mixins/current_user_mixin';
import ErrorHandlingMixin from '../mixins/error_handling_mixin';

export default Component.extend(ErrorHandlingMixin, CurrentUserMixin, {
  alert: service('sweet-alert'),
  utils: service('utility-methods'),

  tagName: 'li',
  classNames: ['folderItem'],
  classNameBindings: [
    'model.sortedChildren.length:has-children',
    'containsCurrentSelection:contains-current-selection',
    'containsCurrentSubmission:contains-current-submission',
  ],
  link: null,
  updateRecordErrors: [],
  queryErrors: [],

  creatorId: computed('model.id', function () {
    return this.utils.getBelongsToId(this.model, 'createdBy');
  }),

  isOwnFolder: computed('creatorId', function () {
    return this.currentUser.id === this.creatorId;
  }),

  canDeleteFolder: computed('isOwnFolder', 'canDeleteFolders', function () {
    return this.isOwnFolder || this.canDeleteFolders;
  }),

  canEditFolder: computed('isOwnFolder', 'canEditFolders', function () {
    return this.isOwnFolder || this.canEditFolders;
  }),

  containsCurrentSubmission: computed(
    'model.submissions',
    'currentSubmission.id',
    'model.isExpanded',
    'model._submissions.[]',
    function () {
      let allSubmissions = this.model._submissions;
      let ownSubmissions = this.model.submissions;
      let isExpanded = this.model.isExpanded;

      const currentSubmissionId = this.currentSubmission.id;

      let submissions = isExpanded ? ownSubmissions : allSubmissions;
      let foundSubmission = submissions.find((sub) => {
        return sub.get('id') === currentSubmissionId;
      });
      return !this.utils.isNullOrUndefined(foundSubmission);
    }
  ),

  containsCurrentSelection: computed(
    'currentSelection.id',
    'model.taggedSelections',
    'model._selections.[]',
    'model.isExpanded',
    function () {
      let allSelections = this.model._selections;
      let ownSelections = this.model.taggedSelections;
      let isExpanded = this.model.isExpanded;

      const currentSelectionId = this.currentSelection.id;

      let selections = isExpanded ? ownSelections : allSelections;

      let foundSelection = selections.find((sel) => {
        return sel.get('id') === currentSelectionId;
      });
      return !this.utils.isNullOrUndefined(foundSelection);
    }
  ),

  /* Drag and drop stuff */
  supportedTypes: {
    selection: /^http:\/\/.*\/#\/workspaces\/[0-9a-f]*\/submissions\/[0-9a-f]*\/selections/,
    folder: /^ember/, // We assume all other droppable ember objects are folders
  },
  dragEnter: aliasMethod('onDrag'),
  dragOver: aliasMethod('onDrag'),
  dragLeave: aliasMethod('onDrop'),
  dragEnd: aliasMethod('onDrop'),

  onDrag: function (event) {
    document.getElementById(this.elementId).style.backgroundColor =
      'rgb(255, 255, 255)';
    event = event || window.event;
    event.preventDefault();

    return false;
  },

  dragStart: function (event) {
    var dataTransfer = event.originalEvent.dataTransfer;
    var folderId = this.model.id;

    this._super(event);
    // Get the id of the dragged folder
    dataTransfer.setData('application/json', JSON.stringify({ id: folderId }));
    // Notify the drop target that a folder is being dropped
    dataTransfer.setData('text/plain', 'folder');
    event.stopPropagation();
  },

  onDrop: function (event) {
    document.getElementById(this.elementId).style.backgroundColor =
      'transparent';
    event = event || window.event;
    event.preventDefault();

    return false;
  },

  drop: function (event) {
    var packet = event.originalEvent;
    var dropType = packet.dataTransfer.getData('text/plain');
    var dropObject = event.dataTransfer.getData('application/json');

    if (this.supportedTypes.hasOwnProperty(dropType)) {
      next(this, function () {
        this.putInFolder(this.model, dropType, dropObject);
      });

      document.getElementById(this.elementId).style.backgroundColor =
        'transparent';
    }

    document.getElementById(this.elementId).parentNode.style.backgroundColor =
      'transparent';
    return this._super(event);
  },

  putInFolder: function (folder, type, data) {
    var obj = JSON.parse(data);

    if (this.model.hasSelection(obj.id)) {
      this.alert.showToast(
        'info',
        'Selection has already been filed in this folder',
        'bottom-end',
        3000,
        false,
        null
      );
      return;
    }

    if (type === 'selection') {
      this.sendAction('dropped', obj.id, this.model);
    } else if (type === 'folder') {
      this.putFolderInFolder(obj, this.model);
      this.notifyPropertyChange('model');
    } else {
      this.alert.showToast(
        'error',
        'Invalid or unsupported object cannot be filed in folder',
        'bottom-end',
        3000,
        false,
        null
      );
    }
  },

  putFolderInFolder: function (child, parent) {
    let parentName = this.model.name;
    var droppedFolder = false;
    var parentOfDropped = false;
    var iterator = parent;

    if (child.id === this.model.id) {
      this.alert.showToast(
        'error',
        'A folder cannot be placed into itself',
        'bottom-end',
        3000,
        false,
        null
      );
      return;
    }

    var folders = this.folderList.get('folders');
    droppedFolder = folders.filterBy('id', child.id).get('firstObject');

    let childName = droppedFolder.get('name');

    if (!droppedFolder) {
      this.alert.showToast(
        'error',
        'Sorry, there was a problem placing the folder',
        'bottom-end',
        3000,
        false,
        null
      );

      return;
    }

    // look from the bottom up to see if parent is a descendent of child
    while (iterator.get('parent')) {
      iterator = iterator.get('parent');

      if (iterator.get('id') === droppedFolder.get('id')) {
        this.alert.showToast(
          'error',
          'A folder cannot be dropped into one if its sub-folders',
          'bottom-end',
          3000,
          false,
          null
        );

        return;
      }
    }

    // get parent of the folder being dropped
    if (droppedFolder.get('parent')) {
      parentOfDropped = folders
        .filterBy('id', droppedFolder.get('parent').get('id'))
        .get('firstObject');
    }

    if (parentOfDropped) {
      parentOfDropped.get('children').then(function (children) {
        children.removeObject(droppedFolder);
      });
    }

    droppedFolder.set('parent', parent);

    parent.get('children').then(function (children) {
      children.pushObject(droppedFolder);
    });

    droppedFolder
      .save()
      .then((res) => {
        this.alert.showToast(
          'success',
          `${childName} is now inside ${parentName}`,
          'bottom-end',
          3000,
          false,
          null
        );
      })
      .catch((err) => {
        this.handleErrors(err, 'updateRecordErrors', droppedFolder);
      });
  },

  hasManyTaggings: gt('model.childSelections.length', 99),

  selectionsTitle: computed(
    'model.childSelections.length',
    'model.submissions.length',
    function () {
      let selectionsCount = this.model.childSelections.length;

      if (selectionsCount === 0) {
        return '0 Selections';
      }
      let submissionsCount = this.model.submissions.length;

      let selectionNoun = selectionsCount > 1 ? 'selections' : 'selection';
      let submissionsNoun = submissionsCount > 1 ? 'submissions' : 'submission';

      return `${selectionsCount} ${selectionNoun} from ${submissionsCount} ${submissionsNoun}`;
    }
  ),

  actions: {
    toggle: function () {
      this.set('model.isExpanded', !this.model.isExpanded);
    },

    editFolderName: function () {
      var folder = this.model;
      this.set('alerts', this.alert);
      if (folder.get('hasDirtyAttributes')) {
        folder.get('workspace').then(() => {
          folder
            .save()
            .then((res) => {
              this.alerts.showToast(
                'success',
                'Folder updated',
                'bottom-end',
                3000,
                false,
                null
              );
            })
            .catch((err) => {
              this.handleErrors(err, 'updateRecordErrors', folder);
            }); //we need the workspace to be populated
        });
      }
      return true; //bubbling the event so that if the user clicks into another input it takes
      //we'll handle the event further up to dismiss it so it doesn't cause an
      //error
    },

    openLink: function () {
      let model = this.model;
      let currentWorkspace = this.currentWorkspace;
      var getUrl = window.location;
      var baseUrl =
        getUrl.protocol +
        '//' +
        getUrl.host +
        '/' +
        getUrl.pathname.split('/')[1];

      window.open(
        `${baseUrl}#/workspaces/${currentWorkspace.id}/folders/${model.id}`,
        'newwindow',
        'width=1000, height=700'
      );
    },

    confirmDelete: function () {
      this.sendAction('confirm', this.model);
    },

    showFolder: function () {},

    updateTaggings: function () {
      this.currentWorkspace.reload();
    },
  },
});
