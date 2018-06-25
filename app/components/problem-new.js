Encompass.ProblemNewComponent = Ember.Component.extend({
  filesToBeUploaded: null,
  createdProblem: null,
  createProblemError: null,

  actions: {
    radioSelect: function (value) {
      this.set('isPublic', value);
    },

    createProblem: function () {
      var that = this;

      var createdBy = that.get('currentUser');
      var title = that.get('title');
      var text = that.get('text');
      //var categories = [];
      var additionalInfo = that.get('additionalInfo');
      var isPublic = that.get('isPublic');
      var imageUrl = null;

      var createProblemData =   that.store.createRecord('problem', {
        createdBy: createdBy,
        createDate: new Date(),
        title: title,
        text: text,
        // categories: categories,
        additionalInfo: additionalInfo,
        isPublic: isPublic,
        imageUrl: imageUrl
      });

      if (that.filesToBeUploaded) {
        console.log('filesToBeUploaded', that.filesToBeUploaded);
        var uploadData = that.get('filesToBeUploaded');
        var formData = new FormData();
        for(let f of uploadData) {
          formData.append('photo', f);
        }
        Ember.$.post({
          url: '/image',
          processData: false,
          contentType: false,
          data: formData
        }).then(function(res){
          that.set('uploadResults', res.images);
          // currently allowing multiple images to be uploaded but only saving
          // the first image url as the image in the problem doc
          createProblemData.set('imageUrl', res.images[0].relativePath);
          createProblemData.save()
            .then((prob) => {
              that.set('createdProblem', prob);
            })
            .catch((err) => {
              that.set('createProblemError', err);
            });
        }).catch(function(err){
          that.set('uploadError', err);
        });
      } else {
        createProblemData.save()
            .then((prob) => {
              that.set('createdProblem', prob);
            })
            .catch((err) => {
              that.set('createProblemError', err);
            });
          }
        }
      }
});

