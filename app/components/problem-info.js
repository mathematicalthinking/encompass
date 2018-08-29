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


  didReceiveAttrs: function () {
    this.set('isWide', false);
    let problem = this.get('problem');
    let problemId = problem.get('id');
    // let problemUsed = this.get('problemUsed');

    this.get('store').queryRecord('answer', {
      problem: problemId
    }).then((answer) => {
      if (answer !== null) {
        console.log('answer exists and is', answer);
        this.set('isProblemUsed', true);
      } else {
        console.log('answer does not exist and is', answer);
        this.set('isProblemUsed', false);
      }
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

  // problemUsed: Ember.computed('problem.id', function () {
  //   let problem = this.get('problem');
  //   let problemId = problem.get('id');
  //   // let problemUsed = this.get('problemUsed');

  //   this.get('store').queryRecord('answer', {
  //       problem: problemId
  //   }).then((answer) => {
  //     if (answer !== null) {
  //       console.log('answer exists and is', answer);
  //       this.set('isProblemUsed', true);
  //     } else {
  //       console.log('answer does not exist and is', answer);
  //       this.set('isProblemUsed', false);
  //     }
  //   });
  // }),


  actions: {
    deleteProblem: function () {
      let problem = this.get('problem');
        problem.set('isTrashed', true);
        problem.set('imageData', null);
        problem.save()
          .then(() => {
              this.sendAction('toProblemList');
          });
        problem.set('imageData', problem.get('imageData'));
    },

    editProblem: function () {
      let problem = this.get('problem');
      this.set('isEditing', true);
      this.set('problemName', problem.get('title'));
      this.set('problemText', problem.get('text'));
      this.set('privacySetting', problem.get('privacySetting'));
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
            problem.set('imageId', res.images[0]._id);
            problem.set('imageData', res.images[0].data);
            problem.save();
          });
        } else {
          Ember.$.post({
            url: '/image',
            processData: false,
            contentType: false,
            data: formData
          }).then((res) => {
            this.set('uploadResults', res.images);
            problem.set('imageId', res.images[0]._id);
            problem.set('imageData', res.images[0].data);
            problem.save();
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
      let createdBy = this.get('currentUser');

      let newProblem = this.store.createRecord('problem', {
        title: title,
        text: text,
        additionalInfo: additionalInfo,
        imageUrl: imageUrl,
        isPublic: isPublic,
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


    addImage: function () {

    },

    changeImage: function () {
      console.log('update image clicked');
      let problem = this.get('problem');
      let imageData = this.get('imageData');
      let imageId = this.get('imageId');
    },

    deleteImage: function () {
      let problem = this.get('problem');
      problem.set('imageId', null);
      problem.set('imageData', null);
      problem.save();
    }

  }
});