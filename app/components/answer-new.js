import Component from '@ember/component';
import { computed, observer } from '@ember/object';
/*global _:false */
import { later } from '@ember/runloop';
import { inject as service } from '@ember/service';
import $ from 'jquery';
import { all, reject, resolve } from 'rsvp';
import ErrorHandlingMixin from '../mixins/error_handling_mixin';

export default Component.extend(ErrorHandlingMixin, {
  elementId: 'answer-new',
  alert: service('sweet-alert'),
  utils: service('utility-methods'),
  currentUser: service('current-user'),
  filesToBeUploaded: null,
  createAnswerError: null,
  isMissingRequiredFields: null,
  students: [],
  editor: null,
  findRecordErrors: [],
  uploadErrors: [],
  createRecordErrors: [],
  contributors: [],
  isCreatingAnswer: false,
  showLoadingMessage: false,

  quillEditorId: 'answer-new-editor',
  quillText: '',
  singleFileSizeLimit: 10485760, // 10MB
  explanationLengthLimit: 14680064, // `14MB

  constraints: {
    briefSummary: {
      presence: { allowEmpty: false },
      length: {
        maximum: 10000,
      },
    },
    explanation: {
      presence: true,
    },
  },

  returnSizeDisplay(bytes) {
    if (bytes < 1024) {
      return bytes + ' bytes';
    } else if (bytes >= 1024 && bytes < 1048576) {
      return (bytes / 1024).toFixed(1) + 'KB';
    } else if (bytes >= 1048576) {
      return (bytes / 1048576).toFixed(1) + 'MB';
    }
  },

  totalSizeLimitDisplay: computed('explanationLengthLimit', function () {
    return this.returnSizeDisplay(this.explanationLengthLimit);
  }),

  getOverSizedFileMsg(fileSize, fileName) {
    let limit = this.singleFileSizeLimit;

    let actualDisplay = this.returnSizeDisplay(fileSize);
    let limitDisplay = this.returnSizeDisplay(limit);

    return `The file ${fileName} (${actualDisplay}) was not accepted due to exceeding the size limit of ${limitDisplay}`;
  },

  tooLargeExplanationMsg: computed('totalSizeLimitDisplay', function () {
    return `The total size of your submission (text and/or images) exceeds the size limit of ${this.totalSizeLimitDisplay}. Please remove or resize any large images and try again.`;
  }),

  createButtonDisplayText: computed('createButtonText', function () {
    if (this.createButtonText) {
      return this.createButtonText;
    }
    return 'Create Answer';
  }),

  mainHeaderDisplayText: computed('mainHeaderText', function () {
    if (this.mainHeaderText) {
      return this.mainHeaderText;
    }
    return 'Create New Answer';
  }),

  didInsertElement: function () {
    this._super(...arguments);
    if (this.priorAnswer) {
      //prefill form if revising
      const ans = this.priorAnswer;
      this.set('answer', ans.get('answer'));
      let explanation = ans.get('explanation');

      this.set('explanationText', explanation);
      let students = ans.get('students');
      this.set(
        'contributors',
        students.map((s) => s)
      );
    } else {
      this.contributors.addObject(this.currentUser.user);
    }
  },

  willDestroyElement() {
    let propsToClear = ['isCreatingAnswer', 'showLoadingMessage'];
    propsToClear.forEach((prop) => {
      if (this.get(prop)) {
        this.set(prop, false);
      }
    });
    this._super(...arguments);
  },

  handleImages() {
    if (this.existingImageId) {
      return resolve(this.existingImageId);
    }

    let filesToUpload = this.filesToBeUploaded;

    if (!filesToUpload) {
      return resolve(null);
    }

    const formData = new FormData();

    for (let f of filesToUpload) {
      if (f.size > this.singleFileSizeLimit) {
        this.set(
          'overSizedFileError',
          this.getOverSizedFileMsg(f.size, f.name)
        );
        return reject('oversizedFile');
      } else {
        formData.append('photo', f);
      }
    }

    let firstItem = filesToUpload[0];
    let isPDF = firstItem.type === 'application/pdf';
    let postUrl = isPDF ? '/pdf' : '/image';
    let resultingImages;

    resultingImages = $.post({
      url: postUrl,
      processData: false,
      contentType: false,
      data: formData,
    });

    return resolve(resultingImages)
      .then((results) => {
        let images = results.images;
        this.store.pushPayload({ images });
        return resolve(images);
      })
      .catch((err) => {
        return reject(err);
      });
  },

  handleLoadingMessage: observer('isCreatingAnswer', function () {
    const that = this;
    if (this.isDestroyed || this.isDestroying) {
      return;
    }

    if (!this.isCreatingAnswer) {
      this.set('showLoadingMessage', false);
      return;
    }
    later(function () {
      if (that.isDestroyed || that.isDestroying) {
        return;
      }
      that.set('showLoadingMessage', that.get('isCreatingAnswer'));
    }, 500);
  }),

  createAnswer: function () {
    this.set('isCreatingAnswer', true);

    const answer = this.answer; // brief summary
    const quillContent = this.$('.ql-editor').html();
    let explanation = quillContent.replace(/["]/g, "'");
    const priorAnswer = this.priorAnswer ? this.priorAnswer : null;
    const students = this.contributors;
    console.log('students', students);
    if (priorAnswer) {
      // if revising, check to see that there were changes made from original
      // to avoid lots of duplicate answers
      if (
        !this.isRevisionDifferent(priorAnswer, answer, explanation, students)
      ) {
        console.log('answer is not different');
        this.set('isCreatingAnswer', false);
        return this.alert.showToast(
          'info',
          'Revison cannot be exact duplicate of original',
          'bottom-end',
          3000,
          false,
          null
        );
      }
    }

    return this.handleImages()
      .then((images) => {
        // json objects, not ember records
        if (images) {
          images.forEach((image) => {
            let imageData = image.imageData;
            if (imageData) {
              let url = `/api/images/file/${image._id}`;
              let tagString = `<img src='${url}'>`;
              explanation += tagString;
            }
          });
        }

        if (explanation.length > this.explanationLengthLimit) {
          this.set('isExplanationTooLarge', true);
          this.set('isCreatingAnswer', false);
          return;
        }
        const records = students.map((student) => {
          return this.store.createRecord('answer', {
            createdBy: student,
            createDate: new Date(),
            answer: answer,
            explanation: explanation,
            assignment: this.assignment,
            isSubmitted: true,
            problem: this.problem,
            priorAnswer: priorAnswer,
            section: this.section,
            students: students,
            workspacesToUpdate: this.workspacesToUpdateIds,
          });
        });
        // additional uploaded image base 64 data was concatenated to explanation
        return all(
          records.map((rec) => {
            return rec.save();
          })
        )
          .then((answers) => {
            const userId = this.currentUser.user.id;
            let yourAnswer = answers.find((answer) => {
              return answer.get('createdBy.id') === userId;
            });
            this.alert.showToast(
              'success',
              'Answer Created',
              'bottom-end',
              3000,
              false,
              null
            );

            this.handleCreatedAnswer(yourAnswer);
          })
          .catch((err) => {
            // do we need to roll back all recs this were created?
            if (!this.isDestroying && !this.isDestroyed) {
              this.set('isCreatingAnswer', false);
            }
            this.handleErrors(err, 'createRecordErrors');
          });
      })
      .catch((err) => {
        if (!this.isDestroying && !this.isDestroyed) {
          this.set('isCreatingAnswer', false);
        }
        if (err === 'oversizedFile') {
          return;
        }
      });
  },

  isRevisionDifferent(original, newSummary, newExplanation, newContributors) {
    let filesToBeUploaded = this.filesToBeUploaded;

    if (filesToBeUploaded) {
      // when revising is initiated, there will be no files to upload
      // if user adds a pdf, we should count it as a different revision
      // even if brief summary or explanation did not change
      return true;
    }

    let originalSummary = original.get('answer');

    if (originalSummary !== newSummary) {
      return true;
    }

    if (original.get('explanation') !== newExplanation) {
      return true;
    }
    if (original.get('students.length') !== newContributors.get('length')) {
      return true;
    }

    let originalContribIds = original.get('students').mapBy('id');

    let newContribIds = newContributors.mapBy('id');

    let didContribsChange = !_.isEqual(originalContribIds, newContribIds);

    return didContribsChange;
  },

  actions: {
    validate: function () {
      // remove existing errors
      const formErrors = ['briefSummaryErrors', 'explanationErrors'];
      for (let error of formErrors) {
        if (this.get(error)) {
          this.set(error, null);
        }
      }

      let isQuillValid = !this.isQuillEmpty;
      let briefSummary = this.answer;
      let explanation = isQuillValid ? true : null;

      let values = {
        briefSummary,
        explanation,
      };
      let constraints = this.constraints;

      let errors = window.validate(values, constraints);
      if (errors) {
        for (let key of Object.keys(errors)) {
          let errorProp = `${key}Errors`;
          this.set(errorProp, errors[key]);
        }
        return;
      }
      // no errors
      this.createAnswer();
    },

    cancelResponse: function () {
      this.cancelResponse();
    },
    deleteImage: function () {
      this.set('existingImageId', null);
      this.set('imageData', null);
    },
    toggleAddStudentMessages() {
      if (this.addStudentError) {
        this.set('addStudentError', false);
      }
      if (this.addedStudent) {
        this.set('addedStudent', false);
      }
    },
    addStudent: function (student) {
      if (!student) {
        return;
      }

      let students = this.contributors;

      if (students.includes(student)) {
        this.set('userAlreadyInSection', true);
        return;
      }

      students.pushObject(student);
      this.alert.showToast(
        'success',
        'Student Added',
        'bottom-end',
        3000,
        false,
        null
      );
    },
    removeStudent: function (student) {
      if (!student) {
        return;
      }
      let students = this.contributors;
      students.removeObject(student);
      this.alert.showToast(
        'success',
        'Student Removed',
        'bottom-end',
        3000,
        false,
        null
      );
    },
    updateQuillText(content, isEmpty, isOverLengthLimit) {
      this.set('quillText', content);
      this.set('isQuillEmpty', isEmpty);
      this.set('isQuillTooLong', isOverLengthLimit);
    },
  },
});
