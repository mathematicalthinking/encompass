/*global _:false */
Encompass.ImportWorkContainerComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, Encompass.AddableProblemsMixin, {
    elementId: "import-work-container",
    selectedProblem: null,
    selectedSection: null,
    selectedFiles: null,
    sections: null,
    selectedValue: false,
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
    alert: Ember.inject.service("sweet-alert"),
    utils: Ember.inject.service('utility-methods'),
    selectedFolderSet: null,
    findRecordErrors: [],
    createAnswerErrors: [],
    postErrors: [],
    currentStep: { value: 1 },
    showSelectProblem: Ember.computed.equal("currentStep.value", 1),
    showSelectClass: Ember.computed.equal("currentStep.value", 2),
    showUploadFiles: Ember.computed.equal("currentStep.value", 3),
    showMatchStudents: Ember.computed.equal("currentStep.value", 4),
    showCreateWs: Ember.computed.equal("currentStep.value", 5),
    showReview: Ember.computed.equal("currentStep.value", 6),
    steps: [
      { value: 0 },
      { value: 1 },
      { value: 2 },
      { value: 3 },
      { value: 4 },
      { value: 5 },
      { value: 6 }
    ],
    detailsItems: function() {
      return [
        {
          label: "Selected Problem",
          displayValue: this.get("selectedProblem.title"),
          emptyValue: "No Problem",
          propName: "selectedProblem",
          associatedStep: 1
        },
        {
          label: "Selected Class",
          displayValue: this.get("selectedSection.name"),
          emptyValue: "No Class",
          propName: "selectedSection",
          associatedStep: 2
        },
        {
          label: "Uploaded Files",
          displayValue: this.get("uploadedFiles.length"),
          propName: "uploadedFileCount",
          associatedStep: 3
        },
        {
          label: "Created Workspace",
          displayValue: this.get("workspaceName"),
          emptyValue: "No Workspace",
          propName: "workspaceName",
          associatedStep: 5
        },
        {
          label: "Created Assignment",
          displayValue: this.get("assignmentName"),
          emptyValue: "No Assignment",
          propName: "assignmentName",
          associatedStep: 5
        }
      ];
    }.property(
      "selectedProblem",
      "selectedSection",
      "uploadedFiles",
      "workspaceName",
      "assignmentName"
    ),

    setIsCompDirty: function() {
      const problem = this.get("selectedProblem");
      const section = this.get("selectedSection");
      const files = this.get("uploadedFiles");

      const ret =
        !Ember.isEmpty(problem) ||
        !Ember.isEmpty(section) ||
        !Ember.isEmpty(files);

      if (ret) {
        this.set("isCompDirty", true);
        this.sendAction("doConfirmLeaving", true);
        return;
      }
      this.set("isCompDirty", false);
      this.sendAction("doConfirmLeaving", false);
    }.observes(
      "selectedProblem",
      "selectedSection",
      "uploadedFiles",
      "isUploadingAnswer"
    ),

    init: function() {
      this._super(...arguments);
      this.set("sections", this.model.sections);
    },

    resetImportDetails: function() {
      const opts = ["selectedProblem", "selectedSection", "uploadedFiles"];

      for (let opt of opts) {
        if (!Ember.isEmpty(this.get(opt))) {
          this.set(opt, null);
        }
      }
    },

    willDestroyElement: function() {
      this.resetImportDetails();
    },

    handleAdditionalFiles: function() {
      const additionalFiles = this.get("additionalFiles");
      if (Ember.isEmpty(additionalFiles) || !Array.isArray(additionalFiles)) {
        return;
      }

      let uploadedFiles = this.get("uploadedFiles");

      if (!uploadedFiles || !Array.isArray(uploadedFiles)) {
        uploadedFiles = [];
      }

      let combinedFiles = uploadedFiles.concat(additionalFiles);
      this.set("uploadedFiles", combinedFiles);
      this.set("additionalFiles", null);
      this.set("isAddingMoreFiles", false);
    }.observes("additionalFiles.[]"),

    getSectionStudents(section) {
      if (!section) {
        return Promise.resolve(this.get("store").findAll("user"));
      }
      return Promise.resolve(section.get("students"));
    },
    maxSteps: function () {
      return this.get('steps.length') - 1;
    }.property('steps'),

    actions: {
      goToStep(stepValue) {
        if (!stepValue) {
          return;
        }
        this.set("currentStep", this.get("steps")[stepValue]);
      },

      changeStep(direction) {
        let currentStep = this.get("currentStep.value");
        let maxStep = this.get("maxSteps");
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
          this.set("currentStep", this.get("steps")[currentStep - 1]);
        }
      },

      setSelectedProblem() {
        this.set("selectedProblem", this.get("selectedProblem"));
        this.set("currentStep", this.get("steps")[2]);
      },

      setSelectedSection() {
        let section = this.get("selectedSection");

        // get section info needed for matching
        this.set("isFetchingSectionStudents", true);
        Promise.resolve(this.getSectionStudents(section)).then(students => {
          this.set("isFetchingSectionStudents", false);

          let asArray = students.toArray();
          let hash = {};
          asArray.forEach(user => {
            hash[user.get("id")] = user;
          });
          this.set("studentMap", hash);
          this.set("currentStep", this.get("steps")[3]);
        });
      },

      setUploadedFiles() {
        this.set("uploadedFiles", this.get("uploadedFiles"));
        this.send("loadStudentMatching");
      },

      setMatchedStudents() {
        //calculate how many submissions
        let submissionCount = 0;
        this.get('answers').map(answer => {
          let studentsLength = answer.students.length;
          let studentNamesLength = answer.studentNames.length;
          submissionCount += studentsLength + studentNamesLength;
        });
        //for each answer count how many students or students names
        this.set('submissionCount', submissionCount);
        this.set("currentStep", this.get("steps")[5]);
      },

      prepareReview() {
        this.set("currentStep", this.get("steps")[6]);
      },

      editImportDetail: function(detailName) {
        if (!detailName || typeof detailName !== "string") {
          return;
        }
        if (detailName === "additionalFiles") {
          this.set("isAddingMoreFiles", true);
          this.set("selectedFiles", null);
          return;
        }
        if (detailName === "uploadedFiles") {
          let uploadedFiles = this.get("uploadedFiles");
          uploadedFiles.forEach(image => {
            this.get("store")
              .findRecord("image", image._id)
              .then(image => {
                image.destroyRecord();
              });
          });
          this.set("selectedFiles", null);
        }
        this.set(detailName, null);
      },

      loadStudentMatching: function() {
        let images = this.get("uploadedFiles");
        let answers = [];

        return Promise.all(
          images.map(image => {
            let ans = {};
            let imageId = image._id;
            // TODO: Determine how to handle groups
            this.store
              .findRecord("image", imageId)
              .then(image => {
                ans.explanationImage = image;
                ans.problem = this.get("selectedProblem");
                ans.section = this.get("selectedSection");
                ans.isSubmitted = true;
                answers.push(ans);
                this.set("answers", answers);
              })
              .catch(err => {
                console.log("error is", err);
              });
          })
        ).then(() => {
          this.set("currentStep", this.get("steps")[4]);
        });
      },

      reviewSubmissions: function() {
        this.set("isMatchingStudents", false);
        this.set("isReviewingSubmissions", true);
      },

      uploadAnswers: function() {
        //need to post all answers, once they are done, pass them to createSubmissions
        let that = this;
        this.set("isUploadingAnswer", true);
        let answers = this.get("answers");
        let assignment;
        if (this.get('createdAssignment')) {
          assignment = this.get('createdAssignment');
        } else {
          assignment = null;
        }
        return Ember.RSVP.all(answers.map(answer => {
          if (that.get('utils').isNonEmptyArray(answer.students)) {
            return Ember.RSVP.all(answer.students.map((student) => {
              let ans = that.store.createRecord("answer", answer);
              ans.set('answer', "See Image");
              ans.set("section", that.get("selectedSection"));
              ans.set("problem", that.get("selectedProblem"));
              ans.set('assignment', assignment);
              ans.set('createdBy', student);
              return ans.save();
            }));
          }
          if (that.get('utils').isNonEmptyArray(answer.studentNames)) {
            return Ember.RSVP.all(answer.studentNames.map((student) => {
              let ans = that.store.createRecord("answer", answer);
              ans.set('answer', "See Image");
              ans.set("section", that.get("selectedSection"));
              ans.set("problem", that.get("selectedProblem"));
              ans.set('assignment', assignment);
              ans.set('createdBy', that.get('currentUser'));
              ans.set('studentNames', student);
              return ans.save();
            }));
          }
        }))
        .then(answers => {
          answers = _.flatten(answers, true);
          this.get('alert').showToast('success', `${answers.length} Submissions Created`, 'bottom-end', 3000, false, null);
          this.set('uploadAnswers', true);
          if (this.get('workspaceName')) {
            this.set("isUploadingAnswer", false);
            this.set("isCreatingWorkspace", true);
            this.set("uploadedAnswers", true);
            this.send('createSubmissions', answers);
          } else {
            this.set('isCompDirty', false);
            this.sendAction("doConfirmLeaving", false);
          }
        }
        ).catch(err => {
          this.handleErrors(err, "createAnswerErrors");
        });
      },

      createSubmissions: function (answers) {
        let subs;
        subs = answers.map(ans => {
          const clazz = {};
          const publication = {
            publicationId: null,
            puzzle: {}
          };
          const creator = {};
          const teacher = {};
          const student = ans.get("createdBy");
          const section = ans.get("section");
          const problem = ans.get("problem");
          const studentNames = ans.get('studentNames');

          publication.puzzle.title = this.get('selectedProblem').get("title");
          publication.puzzle.problemId = problem.get("problemId");

          if (this.get('utils').isNonEmptyArray(studentNames)) {
            creator.username = studentNames;
          } else {
            creator.studentId = student.get("userId");
            creator.username = student.get("username");
          }

          if (this.get('utils').isNonEmptyObject(section.get('content'))) {
            clazz.sectionId = section.get("sectionId");
            clazz.name = section.get("name");
            const teachers = section.get("teachers");
            const primaryTeacher = teachers.get("firstObject");
            teacher.id = primaryTeacher.get("userId");
          }

          let sub = {
            // longAnswer: ans.get('explanation'),
            answer: ans.id,
            clazz: clazz,
            creator: creator,
            teacher: teacher,
            publication: publication
          };
          return sub;
        });
        this.send('createWorkspace', subs);
      },

      createWorkspace: function (subs) {
        this.set("isCreatingWorkspace", true);
        this.set("isCompDirty", false);
        this.sendAction("doConfirmLeaving", false);
        let folderSetId;
        let folderSet = this.get("folderSet");
        if (folderSet) {
          folderSetId = folderSet.get("id");
        } else {
          folderSetId = "";
        }

        let postData = {
          subs: JSON.stringify(subs),
          doCreateWorkspace: true,
          workspaceOwner: JSON.stringify(this.get('workspaceOwner.id')),
          requestedName: JSON.stringify(this.get("workspaceName")),
          workspaceMode: JSON.stringify(this.get('workspaceMode')),
          folderSet: JSON.stringify(folderSetId),
        };
        Ember.$.post({
          url: "api/import",
          data: postData
        })
        .then(res => {
          this.set("isCreatingWorkspace", false);
          if (res.workspace) {
            this.set("createdWorkspace", res.workspace);
            let hasCreatedAssignment = this.get('createdAssignment');
            if (!this.get('utils').isNonEmptyObject(hasCreatedAssignment)) {
              this.sendAction("toWorkspaces", res.workspace);
            }
            this.get("alert").showToast("success", "Workspace Created", "bottom-end", 4000, false, null);
          }
        })
        .catch(err => {
          this.handleErrors(err, "postErrors");
        });
      },

      createAssignment: function () {
        const that = this;
        if (that.get('assignmentName')) {
          this.set('savingAssignment', true);
          let section = this.get('selectedSection');
          let problem = this.get('selectedProblem');
          let name = this.get('assignmentName');
          let createdBy = this.get('currentUser');
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

          createAssignmentData.save()
          .then((assignment) => {
            this.set('savingAssignment', false);
            this.set('createdAssignment', assignment);
            this.get('alert').showToast('success', 'Assignment Created', 'bottom-end', 3000, false, null);
            this.send('uploadAnswers');
          })
          .catch((err) => {
            that.handleErrors(err, 'createRecordErrors', createAssignmentData);
          });
        }
      },

      importWork: function () {
        if (this.get('assignmentName')) {
          this.send('createAssignment');
        } else {
          this.send('uploadAnswers');
        }
      },

      toggleMenu: function() {
        $("#filter-list-side").toggleClass("collapse");
        $("#arrow-icon").toggleClass("fa-rotate-180");
        $("#filter-list-side").addClass("animated slideInLeft");
      }
    }
  }
);