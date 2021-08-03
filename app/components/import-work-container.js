import Component from '@ember/component';
import { computed, observer } from '@ember/object';
import { equal } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import $ from 'jquery';
/*global _:false */
import { all, resolve } from 'rsvp';
import AddableProblemsMixin from '../mixins/addable_problems_mixin';
import CurrentUserMixin from '../mixins/current_user_mixin';
import ErrorHandlingMixin from '../mixins/error_handling_mixin';

export default Component.extend(
  CurrentUserMixin,
  ErrorHandlingMixin,
  AddableProblemsMixin,
  {
    elementId: 'import-work-container',
    alert: service('sweet-alert'),
    utils: service('utility-methods'),
    selectedProblem: null,
    selectedSection: null,
    selectedOwner: null,
    selectedFiles: null,
    sections: null,
    selectedValue: false,
    selectedMode: 'private',
    doCreateWs: false,
    createAssignmentValue: false,
    uploadedFiles: null,
    answers: null,
    uploadedAnswers: null,
    savingAssignment: null,
    isUploadingAnswer: null,
    isCreatingWorkspace: null,
    uploadedSubmissions: null,
    createdWorkspace: null,
    workspaceName: null,
    workspaceOwner: null,
    workspaceMode: null,
    folderSet: null,
    assignmentName: null,
    selectedFolderSet: null,
    findRecordErrors: [],
    createAnswerErrors: [],
    postErrors: [],
    showSelectProblem: equal('currentStep.value', 1),
    showSelectClass: equal('currentStep.value', 2),
    showUploadFiles: equal('currentStep.value', 3),
    showMatchStudents: equal('currentStep.value', 4),
    showCreateWs: equal('currentStep.value', 5),
    showReview: equal('currentStep.value', 6),
    currentStep: { value: 1 },
    steps: [
      { value: 0 },
      { value: 1 },
      { value: 2 },
      { value: 3 },
      { value: 4 },
      { value: 5 },
      { value: 6 },
    ],
    detailsItems: computed(
      'selectedProblem',
      'selectedSection',
      'uploadedFiles.[]',
      'workspaceName',
      'assignmentName',
      function () {
        return [
          {
            label: 'Selected Problem',
            displayValue: this.selectedProblem.title,
            emptyValue: 'No Problem',
            propName: 'selectedProblem',
            associatedStep: 1,
          },
          {
            label: 'Selected Class',
            displayValue: this.selectedSection.name,
            emptyValue: 'No Class',
            propName: 'selectedSection',
            associatedStep: 2,
          },
          {
            label: 'Uploaded Files',
            displayValue: this.uploadedFiles.length,
            propName: 'uploadedFileCount',
            associatedStep: 3,
          },
          {
            label: 'Created Workspace',
            displayValue: this.workspaceName,
            emptyValue: 'No Workspace',
            propName: 'workspaceName',
            associatedStep: 5,
          },
          {
            label: 'Created Assignment',
            displayValue: this.assignmentName,
            emptyValue: 'No Assignment',
            propName: 'assignmentName',
            associatedStep: 5,
          },
        ];
      }
    ),

    init() {
      this._super(...arguments);
      this.set('sections', this.model.sections);
    },

    setIsCompDirty: observer(
      'selectedProblem',
      'selectedSection',
      'uploadedFiles.[]',
      'isUploadingAnswer',
      function () {
        const problem = this.selectedProblem;
        const section = this.selectedSection;
        const files = this.uploadedFiles;

        const ret = !isEmpty(problem) || !isEmpty(section) || !isEmpty(files);

        if (ret) {
          this.set('isCompDirty', true);
          this.sendAction('doConfirmLeaving', true);
          return;
        }
        this.set('isCompDirty', false);
        this.sendAction('doConfirmLeaving', false);
      }
    ),

    resetImportDetails() {
      const opts = ['selectedProblem', 'selectedSection', 'uploadedFiles'];
      opts.forEach((opt) => {
        this.set(opt, null);
      });
    },

    willDestroyElement() {
      this.resetImportDetails();
    },

    getSectionStudents(section) {
      if (!section) {
        return resolve(this.store.findAll('user'));
      }
      return resolve(section.get('students'));
    },
    maxSteps: computed('steps', function () {
      return this.steps.length - 1;
    }),

    actions: {
      goToStep(stepValue) {
        if (!stepValue) {
          return;
        }
        this.set('currentStep', this.steps[stepValue]);
      },

      changeStep(direction) {
        let currentStep = this.currentStep.value;
        let maxStep = this.maxSteps;
        if (direction === 1) {
          if (currentStep === maxStep) {
            return;
          }
          return;
        }
        if (direction === -1) {
          if (currentStep === 1) {
            return;
          }
          this.set('currentStep', this.steps[currentStep - 1]);
        }
      },

      setSelectedProblem() {
        this.set('selectedProblem', this.selectedProblem);
        this.set('currentStep', this.steps[2]);
      },

      setSelectedSection() {
        let section = this.selectedSection;

        // get section info needed for matching
        this.set('isFetchingSectionStudents', true);
        resolve(this.getSectionStudents(section)).then((students) => {
          this.set('isFetchingSectionStudents', false);

          let asArray = students.toArray();
          let hash = {};
          asArray.forEach((user) => {
            hash[user.get('id')] = user;
          });
          this.set('studentMap', hash);
          this.set('currentStep', this.steps[3]);
        });
      },

      setUploadedFiles(files) {
        this.set('uploadedFiles', files);
        this.send('loadStudentMatching');
      },

      setMatchedStudents() {
        //calculate how many submissions
        let submissionCount = 0;
        this.answers.map((answer) => {
          let studentsLength = answer.students.length;
          let studentNamesLength = answer.studentNames.length;
          submissionCount += studentsLength + studentNamesLength;
        });
        //for each answer count how many students or students names
        this.set('submissionCount', submissionCount);
        this.set('currentStep', this.steps[5]);
      },

      prepareReview() {
        this.set('currentStep', this.steps[6]);
      },

      loadStudentMatching: function () {
        let images = this.uploadedFiles;
        let answers = images.map((image) => {
          let record = this.store.peekRecord('image', image._id);
          let url = `/api/images/file/${image._id}`;
          let imgStr = `<img src='${url}'>`;
          return {
            explanation: imgStr,
            explanationImage: record,
            problem: this.selectedProblem,
            section: this.selectedSection,
            isSubmitted: true,
          };
        });

        this.set('answers', answers);
        this.set('currentStep', this.steps[4]);
      },

      reviewSubmissions: function () {
        this.set('isMatchingStudents', false);
        this.set('isReviewingSubmissions', true);
      },

      uploadAnswers: function () {
        //need to post all answers, once they are done, pass them to createSubmissions
        let that = this;
        this.set('isUploadingAnswer', true);
        let answers = this.answers;
        let assignment;
        if (this.createdAssignment) {
          assignment = this.createdAssignment;
        } else {
          assignment = null;
        }
        return all(
          answers.map((answer) => {
            if (that.get('utils').isNonEmptyArray(answer.students)) {
              return all(
                answer.students.map((student) => {
                  let ans = that.store.createRecord('answer', answer);
                  ans.set('answer', 'See Image');
                  ans.set('section', that.get('selectedSection'));
                  ans.set('problem', that.get('selectedProblem'));
                  ans.set('assignment', assignment);
                  ans.set('createdBy', student);
                  return ans.save();
                })
              );
            }
            if (that.get('utils').isNonEmptyArray(answer.studentNames)) {
              return all(
                answer.studentNames.map((student) => {
                  let ans = that.store.createRecord('answer', answer);
                  ans.set('answer', 'See Image');
                  ans.set('section', that.get('selectedSection'));
                  ans.set('problem', that.get('selectedProblem'));
                  ans.set('assignment', assignment);
                  ans.set('createdBy', that.get('currentUser'));
                  ans.set('studentNames', student);
                  return ans.save();
                })
              );
            }
          })
        )
          .then((answers) => {
            answers = _.flatten(answers, true);
            this.alert.showToast(
              'success',
              `${answers.length} Submissions Created`,
              'bottom-end',
              3000,
              false,
              null
            );
            this.set('uploadAnswers', true);
            if (this.workspaceName) {
              this.set('isUploadingAnswer', false);
              this.set('isCreatingWorkspace', true);
              this.set('uploadedAnswers', true);
              this.send('createSubmissions', answers);
            } else {
              this.set('isCompDirty', false);
              this.sendAction('doConfirmLeaving', false);
            }
          })
          .catch((err) => {
            this.handleErrors(err, 'createAnswerErrors');
          });
      },

      createSubmissions: function (answers) {
        let subs;
        subs = answers.map((ans) => {
          const clazz = {};
          const publication = {
            publicationId: null,
            puzzle: {},
          };
          const creator = {};
          const teacher = {};
          const student = ans.get('createdBy');
          const section = ans.get('section');
          const problem = ans.get('problem');
          const studentNames = ans.get('studentNames');

          publication.puzzle.title = this.selectedProblem.get('title');
          publication.puzzle.problemId = problem.get('problemId');

          if (this.utils.isNonEmptyArray(studentNames)) {
            creator.username = studentNames;
          } else {
            creator.studentId = student.get('userId');
            creator.username = student.get('username');
          }

          if (this.utils.isNonEmptyObject(section.get('content'))) {
            clazz.sectionId = section.get('sectionId');
            clazz.name = section.get('name');
            const teachers = section.get('teachers');
            const primaryTeacher = teachers.get('firstObject');
            teacher.id = primaryTeacher.get('userId');
          }

          let sub = {
            // longAnswer: ans.get('explanation'),
            answer: ans.id,
            clazz: clazz,
            creator: creator,
            teacher: teacher,
            publication: publication,
          };
          return sub;
        });
        this.send('createWorkspace', subs);
      },

      createWorkspace: function (subs) {
        this.set('isCreatingWorkspace', true);
        this.set('isCompDirty', false);
        this.sendAction('doConfirmLeaving', false);
        let folderSetId;
        let folderSet = this.folderSet;
        if (folderSet) {
          folderSetId = folderSet.get('id');
        } else {
          folderSetId = '';
        }

        let postData = {
          subs: JSON.stringify(subs),
          doCreateWorkspace: true,
          workspaceOwner: JSON.stringify(this.workspaceOwner.id),
          requestedName: JSON.stringify(this.workspaceName),
          workspaceMode: JSON.stringify(this.workspaceMode),
          folderSet: JSON.stringify(folderSetId),
        };
        $.post({
          url: 'api/import',
          data: postData,
        })
          .then((res) => {
            this.set('isCreatingWorkspace', false);
            if (res.workspace) {
              this.set('createdWorkspace', res.workspace);
              let hasCreatedAssignment = this.createdAssignment;
              if (!this.utils.isNonEmptyObject(hasCreatedAssignment)) {
                this.sendAction('toWorkspaces', res.workspace);
              }
              this.alert.showToast(
                'success',
                'Workspace Created',
                'bottom-end',
                4000,
                false,
                null
              );
            }
          })
          .catch((err) => {
            this.handleErrors(err, 'postErrors');
          });
      },

      createAssignment: function () {
        const that = this;
        if (that.get('assignmentName')) {
          this.set('savingAssignment', true);
          let section = this.selectedSection;
          let problem = this.selectedProblem;
          let name = this.assignmentName;
          let createdBy = this.currentUser;
          let assignedDate = new Date();
          let dueDate = new Date();

          const students = section.get('students');

          const createAssignmentData = that.store.createRecord('assignment', {
            createdBy: createdBy,
            createDate: new Date(),
            section: section,
            problem: problem,
            assignedDate: assignedDate,
            dueDate: dueDate,
            name: name,
          });

          students.forEach((student) => {
            createAssignmentData.get('students').pushObject(student);
          });

          createAssignmentData
            .save()
            .then((assignment) => {
              this.set('savingAssignment', false);
              this.set('createdAssignment', assignment);
              this.alert.showToast(
                'success',
                'Assignment Created',
                'bottom-end',
                3000,
                false,
                null
              );
              this.send('uploadAnswers');
            })
            .catch((err) => {
              that.handleErrors(
                err,
                'createRecordErrors',
                createAssignmentData
              );
            });
        }
      },

      importWork: function () {
        if (this.assignmentName) {
          this.send('createAssignment');
        } else {
          this.send('uploadAnswers');
        }
      },

      toggleMenu: function () {
        $('#filter-list-side').toggleClass('collapse');
        $('#arrow-icon').toggleClass('fa-rotate-180');
        $('#filter-list-side').addClass('animated slideInLeft');
      },
    },
  }
);
