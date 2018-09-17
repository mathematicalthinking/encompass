Encompass.ProblemInfoComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'problem-info',
  isEditing: false,
  problemName: null,
  problemText: null,
  problemPublic: true,
  privacySetting: null,
  savedProblem: null,
  isWide: false,
  checked: true,
  filesToBeUploaded: null,
  isProblemUsed: false,
  showAssignment: false,
  problemList: [],
  sectionList: null,

  init: function () {
    this._super(...arguments);
    this.get('store').findAll('section').then(sections => {
      this.set('sectionList', sections);
    });
  },

  didReceiveAttrs: function () {
    this.set('isWide', false);
    this.set('showAssignment', false);
    this.set('isEditing', false);
    let problem = this.get('problem');
    let problemId = problem.get('id');

    this.get('store').queryRecord('answer', {
      problem: problemId
    }).then((answer) => {
      if (answer !== null) {
        this.set('isProblemUsed', true);
      } else {
        this.set('isProblemUsed', false);
      }
    });

    this.get('store').findAll('section').then(sections => {
      this.set('sectionList', sections);
    });
  },

  // We can access the currentUser using CurrentUserMixin, this is accessible because we extend it
  // Check if the current problem is yours, so that you can edit it
  canEdit: Ember.computed('problem.id', function() {
    let problem = this.get('problem');
    let creator = problem.get('createdBy.content.id');
    let currentUser = this.get('currentUser');

    let canEdit = creator === currentUser.id ? true : false;
    return canEdit;
  }),


  actions: {
    deleteProblem: function () {
      let problem = this.get('problem');
        problem.set('isTrashed', true);
        problem.save()
          .then(() => {
              this.sendAction('toProblemList');
          });
    },

    editProblem: function () {
      let problem = this.get('problem');
      this.set('isEditing', true);
      this.set('problemName', problem.get('title'));
      this.set('problemText', problem.get('text'));
      this.set('privacySetting', problem.get('privacySetting'));
    },

    cancelEdit: function () {
      this.set('isEditing', false);
    },

    radioSelect: function (value) {
      this.set('privacySetting', value);
    },

    updateProblem: function () {
      let title = this.get('problemName');
      let text = this.get('problemText');
      let privacy = this.get('privacySetting');
      let problem = this.get('problem');
      let currentUser = this.get('currentUser');

      if(this.filesToBeUploaded) {
        var uploadData = this.get('filesToBeUploaded');
        var formData = new FormData();
        for (let f of uploadData) {
          formData.append('photo', f);
        }
        let firstItem = uploadData[0];
        let isPDF = firstItem.type === 'application/pdf';

        if (isPDF) {
          Ember.$.post({
            url: '/pdf',
            processData: false,
            contentType: false,
            data: formData
          }).then((res) => {
            this.set('uploadResults', res.images);
            this.store.findRecord('image', res.images[0]._id).then((image) => {
              problem.set('image', image);
              problem.save();
            });
          });
        } else {
          Ember.$.post({
            url: '/image',
            processData: false,
            contentType: false,
            data: formData
          }).then((res) => {
            this.set('uploadResults', res.images);
            this.store.findRecord('image', res.images[0]._id).then((image) => {
              problem.set('image', image);
              problem.save();
            });
          });
        }
      }

      problem.set('title', title);
      problem.set('text', text);
      if (privacy !== null) {
        problem.set('privacySetting', privacy);
      }
      problem.set('modifiedBy', currentUser);
      problem.save();
      this.set('isEditing', false);
    },

    addToMyProblems: function() {
      let problem = this.get('problem');
      let originalTitle = problem.get('title');
      let title = 'Copy of ' + originalTitle;
      let text = problem.get('text');
      let additionalInfo = problem.get('additionalInfo');
      let isPublic = problem.get('isPublic');
      let image = problem.get('image');
      let imageUrl = problem.get('imageUrl');
      let createdBy = this.get('currentUser');

      let newProblem = this.store.createRecord('problem', {
        title: title,
        text: text,
        additionalInfo: additionalInfo,
        imageUrl: imageUrl,
        isPublic: isPublic,
        origin: problem,
        createdBy: createdBy,
        image: image,
        privacySetting: "M",
        createDate: new Date()
      });

      newProblem.save()
        .then((problem) => {
          this.set('savedProblem', problem);
        });
    },

    duplicateProblem: function () {
      let problem = this.get('problem');
      let originalTitle = problem.get('title');
      let title = 'Copy of ' + originalTitle;
      let text = problem.get('text');
      let additionalInfo = problem.get('additionalInfo');
      let isPublic = problem.get('isPublic');
      let imageUrl = problem.get('imageUrl');
      let image = problem.get('image');
      let createdBy = this.get('currentUser');

      let newProblem = this.store.createRecord('problem', {
        title: title,
        text: text,
        additionalInfo: additionalInfo,
        imageUrl: imageUrl,
        isPublic: isPublic,
        image: image,
        origin: problem,
        privacySetting: "M",
        createdBy: createdBy,
        createDate: new Date()
      });

      newProblem.save()
        .then((problem) => {
          this.set('savedProblem', problem);
      });
    },

    toggleImageSize: function () {
      this.toggleProperty('isWide');
    },


    deleteImage: function () {
      let problem = this.get('problem');
      problem.set('image', null);
      problem.save();
    },

    toAssignmentInfo: function (assignment) {
      this.sendAction('toAssignmentInfo', assignment);
    },

    showAssignment: function () {
      this.set('showAssignment', true);
      this.get('problemList').pushObject(this.problem);
      Ember.run.later(() => {
        $('html, body').animate({scrollTop: $(document).height()});
      }, 100);
    }

  }
});