import Component from '@ember/component';
import { equal, not, oneWay, or } from '@ember/object/computed';
import { run } from '@ember/runloop';
import { w } from '@ember/string';
import { isNone } from '@ember/utils';

export default Component.extend({
  canEdit: not('currentUser.isAdmin'),
  teacher: oneWay('currentUser.username'),

  selectedPdSetId: null,
  selectedFolderSetId: null,

  hasId: or('pubId', 'puzzId', 'subs'),
  hasDate: or('startDate', 'endDate'),

  importMode: 0,
  isPdImport: equal('importMode', 0),
  isPowImport: equal('importMode', 1),

  actions: {
    radioSelect: function (value) {
      this.set('importMode', value);
    },

    createWorkspace: function () {
      var controller = this;
      var doPoWImport = this.isPowImport;

      run(function () {
        if (doPoWImport) {
          controller.send('importWorkspace');
        } else {
          controller.send('newWorkspace');
        }
      });
    },

    newWorkspace: function () {
      var controller = this;
      var pdSetName = this.selectedPdSetId;
      var folderSetName = this.selectedFolderSetId;

      if (!pdSetName) {
        pdSetName = 'default';
      }

      if (!folderSetName) {
        folderSetName = 'none';
      }

      var request = this.store.createRecord('newWorkspaceRequest', {
        pdSetName: pdSetName,
        folderSetName: folderSetName,
      });

      request.save().then(function (obj) {
        controller.transitionToRoute('workspaces.index');
      });
    },

    importWorkspace: function () {
      var importData = {
        /*jshint camelcase: false */ teacher: this.teacher,
        submitter: this.submitter,
        publication: this.pubId,
        puzzle: this.puzzId,
        class_id: this.course,
        collection: this.newPdSet,
        folders: this.selectedFolderSet.id,
        since_date: Date.parse(this.startDate),
        max_date: Date.parse(this.endDate),
      };

      if (this.pd) {
        //PD set name cannot be blank
        if (isNone(importData.collection)) {
          window.alert('PD set name required');
          return;
        }

        //PD set name must be unique
        if (this.pdSets.isAny('id', importData.collection)) {
          window.alert('There is already a PD set by that name');
          return;
        }
      }

      if (this.subs) {
        importData.submissions = w(this.subs);
      }

      var request = this.store.createRecord('importRequest', importData);

      request.save().then(function (obj) {
        var result = obj.get('results');
        //var output = "Imported %@1 submissions!".fmt(result.imported);
        var output = `Imported ${result.imported} submissions!`;

        if (result.updatedExisting) {
          output += '\nYou have workspace(s) for these!';
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
    },
  },
});
