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
Encompass.FolderElemComponent = Ember.Component.extend(Encompass.DragNDrop.Droppable, Encompass.DragNDrop.Draggable, {
  tagName: 'li',
  classNames: ['folderItem'],
  link: null,
  //editFolderMode: true, // (from folder controller)

  containsCurrentSubmission: function(){
    const submissions = this.model.get('submissions');
    const currentSubmission = this.get('currentSubmission');

    if (Ember.isEmpty(submissions) || Ember.isEmpty(currentSubmission)) {
      return false;
    }

    const filtered = submissions.filterBy('id', currentSubmission.id);

    return !Ember.isEmpty(filtered);
  }.property('model.submissions.[]', 'currentSubmission.id'),

  containsCurrentSelection: function() {
    const selections = this.model.get('taggings').mapBy('selection');
    const currentSelection = this.get('currentSelection');

    if (Ember.isEmpty(selections) || Ember.isEmpty(currentSelection)) {
      return false;
    }

    const filtered = selections.filterBy('id', currentSelection.id);

    return !Ember.isEmpty(filtered);
  }.property('currentSelection.id', 'model.selections.@each.isTrashed'),

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
    const view = this;
    document.getElementById(this.elementId).style.backgroundColor = 'rgb(255, 255, 255)';
    event = event || window.event;
    event.preventDefault();

    return false;
  },

  dragStart: function(event) {
    var dataTransfer = event.originalEvent.dataTransfer;
    var folderId = this.model.get('id');

    this._super(event);
    // Get the id of the dragged folder
    dataTransfer.setData('application/json', JSON.stringify( {'id': folderId} ));
    // Notify the drop target that a folder is being dropped
    dataTransfer.setData('text/plain', 'folder');
    event.stopPropagation();
  },

  onDrop: function(event) {
    const view = this;
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
    console.log("Put in folder");
    var obj = JSON.parse(data);

    if( this.model.hasSelection(obj.id) ) {
      console.info('folder already has selection');
      return;
    }

    if( type === "selection" ){
      console.log("Put SELECTION in folder");
      this.sendAction('dropped', obj.id, this.model);
    } else if( type === "folder" ){
      this.propertyWillChange('model');
      this.putFolderInFolder(obj, this.model);
      this.propertyDidChange('model');
    } else {
      console.info("we don't support dropping " + type + " objects in folders");
    }
  },

  putSelectionInFolder: function(id, folder) {
    console.log("Put selection (folder-elem) in folder");
  },

  putFolderInFolder: function(child, parent) {
    console.log("Put folder " + child.id + " into " + this.model.get('name') );
    var droppedFolder = false;
    var parentOfDropped = false;
    var iterator    = parent;

    if (child.id === this.model.get('id')) {
      console.info('You cannot drop a folder into itself.');
      return;
    }

    var folders = this.folderList.get('folders');
    droppedFolder = folders.filterBy('id', child.id).get('firstObject');

    if (!droppedFolder) {
      console.info('Could not retrieve the folder\'s model...');
      return;
    }

    // look from the bottom up to see if parent is a descendent of child
    while ( iterator.get('parent') ) {
      iterator = iterator.get('parent');

      if (iterator.get('id') === droppedFolder.get('id')) {
        console.info('You cannot drop a folder into one of its subfolders.');
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

    droppedFolder.save();
  },

  actions: {
    toggle: function() {
      console.log("expand folder " + this.model.get('name') );
      this.set('model.isExpanded', !this.get('model.isExpanded'));
      console.log("expand folder status " + this.model.get('isExpanded') );
    },

    editFolderName: function() {
      var folder = this.get('model');
      if(folder.get('hasDirtyAttributes')) {
        folder.get('workspace').then(function(){
          folder.save(); //we need the workspace to be populated
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
      console.log("Show folder!");
    }
  }
});

