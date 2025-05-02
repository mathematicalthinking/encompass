import ErrorHandlingComponent from './error-handling';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import isEqual from 'lodash-es/isEqual';
import { inject as service } from '@ember/service';
import $ from 'jquery';
import { all, reject, resolve } from 'rsvp';

export default class AnswerNew extends ErrorHandlingComponent {
  @service('sweet-alert') alert;
  @service('utility-methods') utils;
  @service currentUser;
  @service store;
  @tracked filesToBeUploaded = null;
  @tracked createAnswerError = null;
  @tracked isMissingRequiredFields = null;
  @tracked students = [];
  @tracked editor = null;
  @tracked findRecordErrors = [];
  @tracked uploadErrors = [];
  @tracked createRecordErrors = [];
  @tracked contributors = [];
  @tracked isCreatingAnswer = false;
  @tracked showLoadingMessage = false;
  @tracked explanationText = '';
  @tracked explanationErrors = [];
  @tracked briefSummaryErrors = [];

  quillEditorId = 'answer-new-editor';
  @tracked quillText = '';
  singleFileSizeLimit = 10485760; // 10MB
  explanationLengthLimit = 14680064; // `14MB

  constraints = {
    briefSummary: {
      presence: { allowEmpty: false },
      length: {
        maximum: 10000,
      },
    },
    explanation: {
      presence: true,
    },
  };

  returnSizeDisplay(bytes) {
    if (bytes < 1024) {
      return bytes + ' bytes';
    } else if (bytes >= 1024 && bytes < 1048576) {
      return (bytes / 1024).toFixed(1) + 'KB';
    } else if (bytes >= 1048576) {
      return (bytes / 1048576).toFixed(1) + 'MB';
    }
  }

  get totalSizeLimitDisplay() {
    return this.returnSizeDisplay(this.explanationLengthLimit);
  }

  getOverSizedFileMsg(fileSize, fileName) {
    let limit = this.singleFileSizeLimit;

    let actualDisplay = this.returnSizeDisplay(fileSize);
    let limitDisplay = this.returnSizeDisplay(limit);

    return `The file ${fileName} (${actualDisplay}) was not accepted due to exceeding the size limit of ${limitDisplay}`;
  }

  get tooLargeExplanationMsg() {
    return `The total size of your submission (text and/or images) exceeds the size limit of ${this.totalSizeLimitDisplay}. Please remove or resize any large images and try again.`;
  }

  constructor() {
    super(...arguments);
    if (this.args.priorAnswer) {
      //prefill form if revising
      const ans = this.args.priorAnswer;
      this.answer = ans.answer;
      let explanation = ans.explanation;

      this.explanationText = explanation;
      let students = ans.students;
      this.contributors = students.map((s) => s);
    } else {
      this.contributors.addObject(this.currentUser.user);
    }
  }

  willDestroy() {
    let propsToClear = ['isCreatingAnswer', 'showLoadingMessage'];
    propsToClear.forEach((prop) => {
      if (this[prop]) {
        this[prop] = false;
      }
    });
    super.willDestroy(...arguments);
  }

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
        this.overSizedFileError = this.getOverSizedFileMsg(f.size, f.name);
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
  }

  createAnswer() {
    this.isCreatingAnswer = true;

    const answer = this.answer; // brief summary
    const quillContent = $('.ql-editor').html();
    let explanation = quillContent.replace(/["]/g, "'");
    const priorAnswer = this.args.priorAnswer ? this.args.priorAnswer : null;
    const students = this.contributors;
    if (priorAnswer) {
      // if revising, check to see that there were changes made from original
      // to avoid lots of duplicate answers
      if (
        !this.isRevisionDifferent(priorAnswer, answer, explanation, students)
      ) {
        this.isCreatingAnswer = false;
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
          this.isExplanationTooLarge = true;
          this.isCreatingAnswer = false;
          return;
        }
        const records = students.map((student) => {
          return this.store.createRecord('answer', {
            createdBy: student,
            createDate: new Date(),
            answer: answer,
            explanation: explanation,
            assignment: this.args.assignment,
            isSubmitted: true,
            problem: this.args.problem,
            priorAnswer: priorAnswer,
            section: this.args.section,
            students: students,
            workspacesToUpdate: this.args.workspacesToUpdateIds,
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

            this.args.handleCreatedAnswer(yourAnswer);
          })
          .catch((err) => {
            // do we need to roll back all recs this were created?
            if (!this.isDestroying && !this.isDestroyed) {
              this.isCreatingAnswer = false;
            }
            this.handleErrors(err, 'createRecordErrors');
          });
      })
      .catch((err) => {
        if (!this.isDestroying && !this.isDestroyed) {
          this.isCreatingAnswer = false;
        }
        if (err === 'oversizedFile') {
          return;
        }
      });
  }

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

    if (original.explanation !== newExplanation) {
      return true;
    }
    if (original.students.length !== newContributors.get('length')) {
      return true;
    }

    let originalContribIds = original.students.mapBy('id');

    let newContribIds = newContributors.mapBy('id');

    let didContribsChange = !isEqual(originalContribIds, newContribIds);

    return didContribsChange;
  }

  @action validate() {
    // remove existing errors
    const formErrors = ['briefSummaryErrors', 'explanationErrors'];
    for (let error of formErrors) {
      if (this[error]) {
        this[error] = null;
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
        this[errorProp] = errors[key];
      }
      return;
    }
    // no errors
    this.createAnswer();
  }

  @action cancelResponse() {
    this.args.cancelResponse();
  }
  @action deleteImage() {
    this.existingImageId = null;
    this.imageData = null;
  }
  @action toggleAddStudentMessages() {
    if (this.addStudentError) {
      this.addStudentError = false;
    }
    if (this.addedStudent) {
      this.addedStudent = false;
    }
  }
  @action addStudent(student) {
    if (!student) {
      return;
    }

    let students = this.contributors;

    if (students.includes(student)) {
      this.userAlreadyInSection = true;
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
  }
  @action removeStudent(student) {
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
  }
  @action updateQuillText(content, isEmpty, isOverLengthLimit) {
    this.quillText = content;
    this.isQuillEmpty = isEmpty;
    this.isQuillTooLong = isOverLengthLimit;
  }
}
