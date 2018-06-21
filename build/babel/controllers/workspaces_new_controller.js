'use strict';

/**
  * # Workspaces New Controller
  * @description This controller for creating a new workspace
  * @author Damola Mabogunje <damola@mathforum.org>
  * @since 1.0.1
*/

Encompass.WorkspacesNewController = Ember.Controller.extend(Encompass.CurrentUserMixin, {
  canEdit: Ember.computed.not('currentUser.isAdmin'),
  teacher: Ember.computed.oneWay('currentUser.username'),

  selectedPdSetId: null,
  selectedFolderSetId: null,

  hasId: Ember.computed.or('pubId', 'puzzId', 'subs'),
  hasDate: Ember.computed.or('startDate', 'endDate'),

  importMode: 0,
  isPdImport: Ember.computed.equal('importMode', 0),
  isPowImport: Ember.computed.equal('importMode', 1),

  actions: {
    radioSelect: function radioSelect(value) {
      console.log("Radio select: " + value);
      this.set('importMode', value);
    },

    createWorkspace: function createWorkspace() {
      var controller = this;
      var doPoWImport = this.get('isPowImport');

      Ember.run(function () {
        if (doPoWImport) {
          controller.send('importWorkspace');
        } else {
          controller.send('newWorkspace');
        }
      });
    },

    newWorkspace: function newWorkspace() {
      var controller = this;
      var pdSetName = this.get('selectedPdSetId');
      var folderSetName = this.get('selectedFolderSetId');

      if (!pdSetName) {
        pdSetName = 'default';
      }

      if (!folderSetName) {
        folderSetName = 'none';
      }

      var request = this.store.createRecord('newWorkspaceRequest', {
        pdSetName: pdSetName,
        folderSetName: folderSetName
      });

      request.save().then(function (obj) {
        controller.transitionToRoute('workspaces.index');
      });
    },

    importWorkspace: function importWorkspace() {
      var controller = this;
      var importData = { /*jshint camelcase: false */
        teacher: this.get('teacher'),
        submitter: this.get('submitter'),
        publication: this.get('pubId'),
        puzzle: this.get('puzzId'),
        class_id: this.get('course'),
        collection: this.get('newPdSet'),
        folders: this.get('selectedFolderSet.id'),
        since_date: Date.parse(this.get('startDate')),
        max_date: Date.parse(this.get('endDate'))
      };

      if (this.get('pd')) {
        //PD set name cannot be blank
        if (Ember.isNone(importData.collection)) {
          window.alert('PD set name required');
          return;
        }

        //PD set name must be unique
        if (this.get('pdSets').isAny('id', importData.collection)) {
          window.alert('There is already a PD set by that name');
          return;
        }
      }

      if (!!this.get('subs')) {
        importData.submissions = Ember.String.w(this.get('subs'));
      }

      var request = this.store.createRecord('importRequest', importData);
      var output;

      request.save().then(function (obj) {
        var result = obj.get('results');
        //var output = "Imported %@1 submissions!".fmt(result.imported);
        var output = 'Imported ' + result.imported + ' submissions!';

        if (result.updatedExisting) {
          output += "\nYou have workspace(s) for these!";
        }

        /*
        if(result.addedNew) {
          output += "\n\nAdded %@1 new submissions to your workspace".fmt(result.addedNew);
        }
        */

        if (window.confirm(output)) {
          if (result.imported > 0) {
            window.location.reload();
          }
        }
      });
    }
  }
});
//# sourceMappingURL=workspaces_new_controller.js.map
