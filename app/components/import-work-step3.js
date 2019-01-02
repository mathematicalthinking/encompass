Encompass.ImportWorkStep3Component = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'import-work-step3',

  actions: {
    loadStudentMatching: function () {
      let images = this.get('uploadedFiles');
      let answers = [];

      return Promise.all(images.map((image) => {
        let ans = {};
        let imageId = image._id;
        // TODO: Determine how to handle groups
        this.store.findRecord('image', imageId)
        .then((image) => {
          ans.explanationImage = image;
          ans.problem = this.get('selectedProblem');
          ans.section = this.get('selectedSection');
          ans.isSubmitted = true;
          answers.push(ans);
          this.set('answers', answers);
          console.log('answers are', answers);
        }).catch((err) => {
          console.log('error is', err);
        });
      })).then(() => {
        console.log('then ran');
      });

    //  images.forEach((image) => {
    //     let ans = {};
    //     let imageId = image._id;
    //     this.store.findRecord('image', imageId).then((image) => {
    //       ans.explanationImage = image;
    //       ans.problem = this.get('selectedProblem');
    //       ans.section = this.get('selectedSection');
    //       ans.isSubmitted = true;
    //       console.log('ans is', ans);
    //       answers.push(ans);
    //       this.set('answers', answers);
    //     }).catch((err) => {
    //       console.log('error is', err);
    //     });
    //   });
    },

    next() {
      const uploadedFiles = this.get('uploadedFiles');
      if (uploadedFiles.length >= 1) {
        this.get('onProceed')();
      } else {
        this.set('missingFiles', true);
      }
    },

    back() {
      this.get('onBack')(-1);
    }
  }
});

