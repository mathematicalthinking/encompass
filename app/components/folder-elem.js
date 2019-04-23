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
Encompass.FolderElemComponent = Ember.Component.extend(Encompass.DragNDrop.Droppable, Encompass.DragNDrop.Draggable, Encompass.ErrorHandlingMixin, Encompass.CurrentUserMixin, {
  alert: Ember.inject.service('sweet-alert'),
  utils: Ember.inject.service('utility-methods'),

  tagName: 'li',
  classNames: ['folderItem'],
  classNameBindings: ['model.sortedChildren.length:has-children', 'containsCurrentSelection:contains-current-selection', 'containsCurrentSubmission:contains-current-submission'],
  link: null,
  updateRecordErrors: [],
  queryErrors: [],

  creatorId: function() {
    return this.get('utils').getBelongsToId(this.get('model'), 'createdBy');
  }.property('model.id'),

  isOwnFolder: function() {
    return this.get('currentUser.id') === this.get('creatorId');
  }.property('creatorId'),

  canDeleteFolder: function() {
    return this.get('isOwnFolder') || this.get('canDeleteFolders');
  }.property('isOwnFolder', 'canDeleteFolders'),

  canEditFolder: function() {
    return this.get('isOwnFolder') ||  this.get('canEditFolders');
  }.property('isOwnFolder', 'canEditFolders'),

  containsCurrentSubmission: function(){
    const submissions = this.get('model.submissions');
    const currentSubmissionId = this.get('currentSubmission.id');

    let foundSubmission = submissions.find((sub) => {
      return sub.get('id') === currentSubmissionId;
    });
    return !this.get('utils').isNullOrUndefined(foundSubmission);
  }.property('model.submissions.[]', 'currentSubmission.id'),

  containsCurrentSelection: function() {
    const selections = this.get('model.taggedSelections');
    const currentSelectionId = this.get('currentSelection.id');

    let foundSelection = selections.find((sel) => {
      return sel.get('id') === currentSelectionId;
    });
    return !this.get('utils').isNullOrUndefined(foundSelection);
  }.property('currentSelection.id', 'model.taggedSelections.[]'),

  /* Drag and drop stuff */
  supportedTypes: {
    selection: /^http:\/\/.*\/#\/workspaces\/[0-9a-f]*\/submissions\/[0-9a-f]*\/selections/,
    folder: /^ember/ // We assume all other droppable ember objects are folders
  },
  dragEnter: Ember.aliasMethod('onDrag'),
  dragOver: Ember.aliasMethod('onDrag'),
  dragLeave: Ember.aliasMethod('onDrop'),
  dragEnd: Ember.aliasMethod('onDrop'),

  onDrag: function(event) {
    document.getElementById(this.elementId).style.backgroundColor = 'rgb(255, 255, 255)';
    event = event || window.event;
    event.preventDefault();

    return false;
  },

  dragStart: function(event) {
    var dataTransfer = event.originalEvent.dataTransfer;
    var folderId = this.get('model.id');

    this._super(event);
    // Get the id of the dragged folder
    dataTransfer.setData('application/json', JSON.stringify( {'id': folderId} ));
    // Notify the drop target that a folder is being dropped
    dataTransfer.setData('text/plain', 'folder');
    event.stopPropagation();
  },

  onDrop: function(event) {
    document.getElementById(this.elementId).style.backgroundColor = 'transparent';
    event = event || window.event;
    event.preventDefault();

    return false;
  },

  drop: function(event) {
    var packet = event.originalEvent;
    var dropType = packet.dataTransfer.getData('text/plain');
    var dropObject = event.dataTransfer.getData('application/json');

    if ( this.supportedTypes.hasOwnProperty(dropType) ) {
      Ember.run.next(this, function() {
        this.putInFolder(this.model, dropType, dropObject);
      });
    }

    document.getElementById(this.elementId).parentNode.style.backgroundColor = 'transparent';
    return this._super(event);
  },

  putInFolder: function(folder, type, data) {
    var obj = JSON.parse(data);

    if( this.get('model').hasSelection(obj.id) ) {
      this.get('alert').showToast('info', 'Selection has already been filed in this folder', 'bottom-end', 3000, false, null);
      return;
    }

    if( type === "selection" ){
      this.sendAction('dropped', obj.id, this.model);
    } else if( type === "folder" ){
      this.propertyWillChange('model');
      this.putFolderInFolder(obj, this.model);
      this.propertyDidChange('model');
    } else {
      this.get('alert').showToast('error', 'Invalid or unsupported object cannot be filed in folder', 'bottom-end', 3000, false, null);
    }
  },

  putFolderInFolder: function(child, parent) {
    let parentName = this.get('model.name');
    var droppedFolder = false;
    var parentOfDropped = false;
    var iterator    = parent;

    if (child.id === this.get('model.id')) {
      this.get('alert').showToast('error', 'A folder cannot be placed into itself', 'bottom-end', 3000, false, null);
      return;
    }

    var folders = this.folderList.get('folders');
    droppedFolder = folders.filterBy('id', child.id).get('firstObject');

    let childName = droppedFolder.get('name');

    if (!droppedFolder) {
      this.get('alert').showToast('error', 'Sorry, there was a problem placing the folder', 'bottom-end', 3000, false, null);

      return;
    }

    // look from the bottom up to see if parent is a descendent of child
    while (iterator.get('parent')) {
      iterator = iterator.get('parent');

      if (iterator.get('id') === droppedFolder.get('id')) {
        this.get('alert').showToast('error', 'A folder cannot be dropped into one if its sub-folders', 'bottom-end', 3000, false, null);

        return;
      }
    }

    // get parent of the folder being dropped
    if (droppedFolder.get('parent')) {
      parentOfDropped = folders.filterBy('id', droppedFolder.get('parent').get('id')).get('firstObject');
    }


    if (parentOfDropped) {
      parentOfDropped.get('children').then(function(children) {
        children.removeObject(droppedFolder);
      });
    }

    droppedFolder.set('parent', parent);

    parent.get('children').then(function(children) {
      children.pushObject(droppedFolder);
    });

    droppedFolder.save().then((res) => {
      this.get('alert').showToast('success', `${childName} is now inside ${parentName}`, 'bottom-end', 3000, false, null);
    }).catch((err) => {
      this.handleErrors(err, 'updateRecordErrors', droppedFolder);
    });
  },

  actions: {
    toggle: function() {
      this.set('model.isExpanded', !this.get('model.isExpanded'));
    },

    editFolderName: function() {
      var folder = this.get('model');
      this.set('alerts', this.get('alert'));
      if (folder.get('hasDirtyAttributes')) {
        folder.get('workspace').then(() => {
          folder.save().then((res) => {
            this.get('alerts').showToast('success', 'Folder updated', 'bottom-end', 3000, false, null);
          }).catch((err) => {
            this.handleErrors(err, 'updateRecordErrors', folder);
          }); //we need the workspace to be populated
        });
      }
      return true; //bubbling the event so that if the user clicks into another input it takes
      //we'll handle the event further up to dismiss it so it doesn't cause an
      //error
    },

    openLink: function() {
      let model = this.get('model');
      let currentWorkspace = this.get('currentWorkspace');
      var getUrl = window.location;
      var baseUrl = getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];

      window.open(`${baseUrl}#/workspaces/${currentWorkspace.id}/folders/${model.id}`, 'newwindow', 'width=1000, height=700');
    },


    confirmDelete: function(){
      this.sendAction( 'confirm', this.model );
    },

    showFolder: function() {
    },

    updateTaggings: function() {
      this.get('currentWorkspace').reload();
    }
  }
});

