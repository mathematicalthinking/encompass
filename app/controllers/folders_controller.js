/**
  * # Folders Controller
  * @description The overarching controller for working with folders. 
  *              Currently used in workspace route for folders template
  * @todo Clean up folder move logic 
  * @authors Damola Mabogunje <damola@mathforum.org>, Amir Tahvildaran <amir@mathforum.org>, Jon Hopkins <jrh327@drexel.edu>
  * @since 1.0.0
  */
Encompass.FoldersController = Ember.Controller.extend(Encompass.CurrentUserMixin, {
  workspace: Ember.inject.controller(),
  currentWorkspace: Ember.computed.alias('workspace.model'),
  sortProperties: ['weight', 'data.name'],
  weighting: 1,

  canManageFolders: function() {
    return Permissions.userCan(
      this.get('currentUser'),
      this.get('currentWorkspace'),
      "FOLDERS"
    );
  }.property('currentUser', 'currentWorkspace.owner', 'currentWorkspace.editors.[].username'),

  filteredContent: function() {
    var filteredContent = this.get('content')
      .filterProperty('isTrashed', false)
      .filterProperty('parent', null);

    var sortedContent = Ember.ArrayProxy.createWithMixins(Ember.SortableMixin,
      { content: filteredContent, sortProperties: this.sortProperties });
    return sortedContent;
  }.property('content', 'content.[].isTrashed'),

  //why is this on the folders (plural controller?) and not the folder model/controller
  siblings: function(folder, above) {
    var controller = this,
        workspace = controller.get('currentWorkspace'),
        parentID = (folder.get('parent')) ? folder.get('parent').get('id') : null,
        weight = folder.get('weight'),
        workspaceFolders = workspace.get('folders')
          .filterBy('parent.id', parentID)
          .sortBy('weight', 'name');
    
    var pos = workspaceFolders.indexOf(folder);
    var siblingsAbove = workspaceFolders.slice(0, pos);
    var siblingsBelow = workspaceFolders.slice(pos+1, workspaceFolders.length);

    return (above) ? siblingsAbove : siblingsBelow;  
  }, 
/*
  reweigh: function() {
    this.get('filteredContent').
*/
  actions: {
    activateEditFolderMode: function() {
      this.set('editFolderMode', true);
    },

    cancelEditFolderMode: function() {
      this.set('editFolderMode', false);
    },

    putInFolder: function(folder, type, obj) {
      var controller = this;
      var workspaceController = controller.get('controllers.workspace');
      var error = "We don't support dropping %@ objects in folders.";

      Ember.run(function() {
        switch(type) {
        case 'selection':
          workspaceController.send('putSelectionInFolder', folder, obj);
          break;
        case 'folder':
          controller.propertyWillChange('content');
          workspaceController.send('putFolderInFolder', folder, obj);
          controller.propertyDidChange('content');
          break;
        default:
          console.info(error.fmt(type));
        }
      });
    },

    putInWorkspace: function(obj) {
      var controller = this;
      var workspaceController = controller.get('controllers.workspace');

      Ember.run(function() {
        controller.propertyWillChange('content');
        workspaceController.send('putFolderInWorkspace', obj);
        controller.propertyDidChange('content');
      });
    },

    moveUp: function(folder) {
      var controller = this,
          weight = folder.get('weight'),
          siblings = controller.siblings(folder, true),
          anchor = controller.get('weighting'),
          min = siblings.get('lastObject.weight');

      controller.propertyWillChange('content');
      //console.debug(siblings.length);

      if(siblings.length > 0) { //re-order only if there are siblings above
        if (weight !== min) { // swap the two folders' weights if they are different
          folder.set('weight', min);
          siblings.get('lastObject').set('weight', weight);
          folder.save();
          
          siblings.get('lastObject').save();
        } else {
          folder.set('weight', (weight - anchor));
          folder.save();
          
          // need to also increment the siblings below the one
          // this folder is switching with, so they stay below it
          siblings.forEach( function(sibling, index){
            if( index !== 0 ){
              var w = sibling.get('weight');
              sibling.set('weight', (w + anchor));
              sibling.save();
            }
          });
        }
      }
      
      controller.propertyDidChange('content');
    },

    moveDown: function(folder) {
      var controller = this,
          weight = folder.get('weight'),
          siblings = controller.siblings(folder, false),
          anchor = controller.get('weighting'),
          max = siblings.get('firstObject.weight');


      controller.propertyWillChange('content');
      //console.debug(siblings.length);

      if(siblings.length > 0) { //re-order only if there are siblings below
        if (weight !== max) { // swap the two folders' weights if they are different
          folder.set('weight', max);
          folder.save();

          siblings.get('firstObject').set('weight', weight);
          siblings.get('firstObject').save();
        } else {
          folder.set('weight', (weight + anchor));
          folder.save();

          // need to also increment the siblings below the one
          // this folder is switching with, so they stay below it
          siblings.forEach( function(sibling, index){
            if( index !== 0 ){
              var w = sibling.get('weight');
              sibling.set('weight', (w + anchor));
              sibling.save();
            }
          });
        }
      }

      controller.propertyDidChange('content');
    },

    moveOut: function(folder) {
      var controller = this,
          parent = folder.get('parent'),
          newParent = parent.get('parent'),
          weight = parent.get('weight'),
          anchor = controller.get('weighting'),
          copy;

      controller.propertyWillChange('content');

      if(parent) { // move out only if this is a nested folder
        parent.get('children').removeObject(folder);
        
        if(Ember.isNone(newParent)) {
          folder.set('isTopLevel', true);
        }
        else {
          folder.set('isTopLevel', false);
          newParent.get('children').addObject(folder);
        }

        folder.save();
      }
      
      controller.propertyDidChange('content');
    },
    editFolderName: function() {
      console.log('folder name edited');
      //handling the event that was bubbled in the itemController to avoid an error
      // not sure why we need to do this since it works for simpler cases
      //see folder_controller
    }
  }
});
