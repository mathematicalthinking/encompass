Encompass.WorkspaceNewEncComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  ElementId: 'workspace-new-enc',

  canEdit: Ember.computed.not('currentUser.isAdmin'),
  teacher: Ember.computed.oneWay('currentUser.username'),

  selectedPdSetId: null,
  selectedFolderSetId: null,

  hasId: Ember.computed.or('pubId', 'puzzId', 'subs'),
  hasDate: Ember.computed.or('startDate', 'endDate'),

  importMode: 0,
  isPdImport: Ember.computed.equal('importMode', 0),
  isPowImport: Ember.computed.equal('importMode', 1),

  didReceiveAttrs: function() {

  },

  teacherPool: function() {
    const currentUser = this.get('currentUser');
    const accountType = currentUser.get('accountType');

    if (accountType === 'T') {
      return [currentUser];
    }

    const teachers = this.get('users').filterBy('accountType', 'T');

    if (accountType === 'P') {
      return teachers.filterBy('organization', currentUser.organization);
    }
    if (accountType === 'P') {
      return teachers;
    }
  }.property('users', 'currentUser.accountType'),

  isDateRangeValid: function() {
    const htmlFormat = 'YYYY-MM-DD';
    let start = this.get('startDate');
    let end = this.get('endDate');

    if (Ember.isEmpty(start) || Ember.isEmpty(end)) {
      return false;
    }
    start = moment(start, htmlFormat);
    end = moment(end, htmlFormat);

    return end > start;
  }.property('startDate', 'endDate'),

  getMongoDate: function(htmlDateString) {
    const htmlFormat = 'YYYY-MM-DD';
    if (typeof htmlDateString !== 'string') {
      return;
    }
    let dateMoment = moment(htmlDateString, htmlFormat);
    return new Date(dateMoment);
  },

  isAnswerCriteriaValid: function() {
    const params = ['teacher', 'assignment', 'problem', 'section'];
    for (let param of params) {
      if (!Ember.isEmpty(this.get(param))) {
        return true;
      }
    }
  }.property('teacher', 'assignment', 'problem', 'section'),

  isFormValid: Ember.computed.or('isDateRangeValid', 'isAnswerCriteriaValid'),


  actions: {
    radioSelect: function( value ){
      console.log("Radio select: " + value );
      this.set('importMode', value );
    },

    buildCriteria: function() {
      if (!this.get('isFormValid')) {
        this.set('missingRequiredFields', true);
        return;
      }
      if (!this.get('selectedTeacher')) {
        this.set('teacher', this.get('currentUser'));
      }
      const startDate = this.get('startDate');
      const endDate = this.get('endDate');
      console.log(startDate, endDate);
      const criteria = {
        teacher: this.get('teacher'),
        assignment: this.get('selectedAssignment'),
        problem: this.get('selectedProblem'),
        section: this.get('selectedSection'),
        startDate: this.getMongoDate(this.get('startDate')),
        endDate: this.getMongoDate(this.get('endDate')),
      };

      const encWorkspaceRequest = this.store.createRecord('encWorkspaceRequest', criteria);
      encWorkspaceRequest.save();
      // Ember.$.post({
      //   url: 'workspaces/enc',
      //   data: criteria
      // })
      //   .then((res) => {
      //     console.log('res', res);
      //   })
      //  .catch((err) => {
      //    this.set('createWorkspaceErr', err);
      //  });


    },

    createWorkspace: function() {
      var controller = this;
      var doPoWImport = this.get('isPowImport');

      Ember.run(function() {
        if(doPoWImport) { controller.send('importWorkspace'); }
        else { controller.send('newWorkspace'); }
      });
    },

    newWorkspace: function() {
      var controller    = this;
      var pdSetName     = this.get('selectedPdSetId');
      var folderSetName = this.get('selectedFolderSetId');

      if(!pdSetName) {
        pdSetName = 'default';
      }

      if(!folderSetName) {
        folderSetName = 'none';
      }

      var request = this.store.createRecord('newWorkspaceRequest', {
        pdSetName: pdSetName,
        folderSetName: folderSetName
      });

      request.save().then(function(obj){
        controller.transitionToRoute('workspaces.index');
      });
    },

    importWorkspace: function() {
      var controller = this;
      var importData = { /*jshint camelcase: false */
        teacher: this.get('teacher'),
        submitter: this.get('submitter'),
        publication: this.get('pubId'),
        puzzle: this.get('puzzId'),
        class_id: this.get('course'),
        collection: this.get('newPdSet'),
        folders: this.get('selectedFolderSet.id'),
        since_date: Date.parse(this.get('startDate') ),
        max_date: Date.parse( this.get('endDate') ),
      };

      if(this.get('pd')) {
        //PD set name cannot be blank
        if(Ember.isNone(importData.collection)) {
          window.alert('PD set name required');
          return;
        }

        //PD set name must be unique
        if(this.get('pdSets').isAny('id', importData.collection)) {
          window.alert('There is already a PD set by that name');
          return;
        }
      }

      if(!!this.get('subs')) {
        importData.submissions = Ember.String.w( this.get('subs') );
      }

      var request = this.store.createRecord('importRequest', importData);
      var output;

      request.save().then(function(obj) {
        var result = obj.get('results');
        //var output = "Imported %@1 submissions!".fmt(result.imported);
        var output = `Imported ${result.imported} submissions!`;

        if(result.updatedExisting) {
          output += "\nYou have workspace(s) for these!";
        }

        /*
        if(result.addedNew) {
          output += "\n\nAdded %@1 new submissions to your workspace".fmt(result.addedNew);
        }
        */

        if( window.confirm(output) ) {
          if(result.imported > 0) {
            window.location.reload();
          }
        }
      });
    }
  }

});