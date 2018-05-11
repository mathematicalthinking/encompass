/**
 * Passed in by parent:
 * - hide
 * - folderName
 * - confirm (action)
 */
Encompass.ModalFolderDeleteComponent = Ember.Component.extend({
  classNameBindings: ['hide'],

  actions: {
    cancel: function(){
      console.log("Cancelled delete folder");
      this.set( 'hide', true );
    },

    deleteFolder: function( ){
      console.log("Delete folder");
      this.sendAction( "confirm" );
      this.set( 'hide', true );
    }
  }
});

