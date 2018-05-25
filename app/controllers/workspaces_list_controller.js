/**
  * # Wokspace List Controller
  * @description The controller for listing workspaces
  * @author Amir Tahvildaran <amir@mathforum.org>
  * @since 1.0.0
*/
Encompass.WorkspacesListController = Ember.Controller.extend({
  sortProperties: ['name'],
  currentAsOf: function() {
    return moment(this.get('since')).format('H:mm');
  }.property()
});


