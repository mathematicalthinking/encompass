import Component, { tracked } from '@glimmer/component';
import { action } from '@ember/object';

export default class ImportWorkComponent extends Component {
  @tracked elementId = 'import-work-container';
  @tracked alert = 'sweet-alert';
  @tracked errorHandling = 'error-handling';
  @tracked utils = 'utility-methods';
  @tracked currentUser = 'current-user';
  @tracked selectedProblem = null;
  @tracked selectedSection = null;
  @tracked selectedOwner = null;
  @tracked selectedFiles = null;
  @tracked sections = null;
  @tracked selectedValue = false;
  @tracked selectedMode = 'private';
  @tracked doCreateWs = false;
  @tracked createAssignmentValue = false;
  @tracked uploadedFiles = [];
  @tracked answers = null;
  @tracked uploadedAnswers = null;
  @tracked savingAssignment = null;
  @tracked isUploadingAnswer = null;
  @tracked isCreatingWorkspace = null;
  @tracked uploadedSubmissions = null;
  @tracked createdWorkspace = null;
  @tracked workspaceName = null;
  @tracked workspaceOwner = null;
  @tracked workspaceMode = null;
  @tracked folderSet = null;
  @tracked assignmentName = null;
  @tracked selectedFolderSet = null;
  @tracked findRecordErrors = [];
  @tracked createAnswerErrors = [];
  @tracked postErrors = [];
  @tracked currentStep = { value: 1 };
  @tracked steps = [
    { value: 0 },
    { value: 1 },
    { value: 2 },
    { value: 3 },
    { value: 4 },
    { value: 5 },
    { value: 6 },
  ];

  get showSelectProblem() {
    return this.currentStep.value === 1;
  }

  get showSelectClass() {
    return this.currentStep.value === 2;
  }

  get showUploadFiles() {
    return this.currentStep.value === 3;
  }

  get showMatchStudents() {
    return this.currentStep.value === 4;
  }

  get showCreateWs() {
    return this.currentStep.value === 5;
  }

  get showReview() {
    return this.currentStep.value === 6;
  }

  get detailsItems() {
    return [
      {
        label: 'Selected Problem',
        displayValue: this.selectedProblem
          ? this.selectedProblem.title
          : 'No Problem',
        propName: 'selectedProblem',
        associatedStep: 1,
      },
      {
        label: 'Selected Class',
        displayValue: this.selectedSection
          ? this.selectedSection.name
          : 'No Class',
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
        displayValue: this.workspaceName ? this.workspaceName : 'No Workspace',
        propName: 'workspaceName',
        associatedStep: 5,
      },
      {
        label: 'Created Assignment',
        displayValue: this.assignmentName
          ? this.assignmentName
          : 'No Assignment',
        propName: 'assignmentName',
        associatedStep: 5,
      },
    ];
  }

  constructor(owner, args) {
    super(owner, args);
    this.sections = this.args.model.sections;
  }

  @action
  setIsCompDirty() {
    const { selectedProblem, selectedSection, uploadedFiles } = this;

    const ret = selectedProblem || selectedSection || uploadedFiles.length > 0;

    if (ret) {
      this.isCompDirty = true;
      this.doConfirmLeaving(true);
      return;
    }
    this.isCompDirty = false;
    this.doConfirmLeaving(false);
  }

  @action
  resetImportDetails() {
    const opts = ['selectedProblem', 'selectedSection', 'uploadedFiles'];
    opts.forEach((opt) => {
      this[opt] = null;
    });
  }

  @action
  willDestroy() {
    super.willDestroy();
    this.resetImportDetails();
  }

  @action
  async getSectionStudents(section) {
    if (!section) {
      return this.store.findAll('user');
    }
    return section.students;
  }

  get maxSteps() {
    return this.steps.length - 1;
  }

  @action
  goToStep(stepValue) {
    if (!stepValue) {
      return;
    }
    this.currentStep = this.steps[stepValue];
  }

  @action
  changeStep(direction) {
    const currentStep = this.currentStep.value;
    const maxStep = this.maxSteps;
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
      this.currentStep = this.steps[currentStep - 1];
    }
  }

  setSelectedProblem() {
    this.currentStep = this.steps[2];
  }

  @action
  async setSelectedSection() {
    const section = this.selectedSection;

    // get section info needed for matching
    this.isFetchingSectionStudents = true;
    const students = await this.getSectionStudents(section);
    this.isFetchingSectionStudents = false;

    const asArray = students.toArray();
    const hash = {};
    asArray.forEach((user) => {
      hash[user.id] = user;
    });
    this.studentMap = hash;
    this.currentStep = this.steps[3];
  }

  @action
  setUploadedFiles(files) {
    this.uploadedFiles = files;
    this.send('loadStudentMatching');
  }

  @action
  setMatchedStudents() {
    let submissionCount = 0;
    this.answers.forEach((answer) => {
      submissionCount += answer.students.length + answer.studentNames.length;
    });
    this.submissionCount = submissionCount;
    this.currentStep = this.steps[5];
  }
  @action
  prepareReview() {
    this.currentStep = this.steps[6];
  }

  @action
  async loadStudentMatching() {
    const images = this.uploadedFiles;
    const answers = images.map((image) => {
      const record = this.store.peekRecord('image', image._id);
      const url = `/api/images/file/${image._id}`;
      const imgStr = `<img src='${url}'>`;
      return {
        explanation: imgStr,
        explanationImage: record,
        problem: this.selectedProblem,
        section: this.selectedSection,
        isSubmitted: true,
      };
    });

    this.answers = answers;
    this.currentStep = this.steps[4];
  }

  @action
  reviewSubmissions() {
    this.isMatchingStudents = false;
    this.isReviewingSubmissions = true;
  }

  @action
  async uploadAnswers() {
    let that = this;
    this.isUploadingAnswer = true;
    let answers = this.answers;
    let assignment = this.createdAssignment ? this.createdAssignment : null;
    try {
      const allAnswers = await Promise.all(
        answers.map(async (answer) => {
          if (this.utils.isNonEmptyArray(answer.students)) {
            return Promise.all(
              answer.students.map(async (student) => {
                let ans = that.store.createRecord('answer', answer);
                ans.answer = 'See Image';
                ans.section = that.selectedSection;
                ans.problem = that.selectedProblem;
                ans.assignment = assignment;
                ans.createdBy = student;
                await ans.save();
                return ans;
              })
            );
          }
          if (this.utils.isNonEmptyArray(answer.studentNames)) {
            return Promise.all(
              answer.studentNames.map(async (student) => {
                let ans = that.store.createRecord('answer', answer);
                ans.answer = 'See Image';
                ans.section = that.selectedSection;
                ans.problem = that.selectedProblem;
                ans.assignment = assignment;
                ans.createdBy = that.currentUser.user;
                ans.studentNames = student;
                await ans.save();
                return ans;
              })
            );
          }
        })
      );
      const flattenedAnswers = allAnswers.flat(1);
      this.alert.showToast(
        'success',
        `${flattenedAnswers.length} Submissions Created`,
        'bottom-end',
        3000,
        false,
        null
      );
      this.uploadAnswers = true;
      if (this.workspaceName) {
        this.isUploadingAnswer = false;
        this.isCreatingWorkspace = true;
        this.uploadedAnswers = true;
        this.createSubmissions(flattenedAnswers);
      } else {
        this.isCompDirty = false;
        this.doConfirmLeaving(false);
      }
    } catch (err) {
      this.errorHandling.handleErrors(err, 'createAnswerErrors');
    }
  }
  @action
  createSubmissions(answers) {
    let subs = answers.map((ans) => {
      const clazz = {};
      const publication = {
        publicationId: null,
        puzzle: {},
      };
      const creator = {};
      const teacher = {};
      const student = ans.createdBy;
      const section = ans.section;
      const problem = ans.problem;
      const studentNames = ans.studentNames;

      publication.puzzle.title = this.selectedProblem.title;
      publication.puzzle.problemId = problem.problemId;

      if (this.utils.isNonEmptyArray(studentNames)) {
        creator.username = studentNames;
      } else {
        creator.studentId = student.userId;
        creator.username = student.username;
      }

      if (this.utils.isNonEmptyObject(section.content)) {
        clazz.sectionId = section.sectionId;
        clazz.name = section.name;
        const teachers = section.teachers;
        const primaryTeacher = teachers.firstObject;
        teacher.id = primaryTeacher.userId;
      }

      let sub = {
        // longAnswer: ans.explanation,
        answer: ans.id,
        clazz: clazz,
        creator: creator,
        teacher: teacher,
        publication: publication,
      };
      return sub;
    });
    this.createWorkspace(subs);
  }

  @action
  async createWorkspace(subs) {
    this.isCreatingWorkspace = true;
    this.isCompDirty = false;
    this.doConfirmLeaving(false);
    let folderSetId;
    let folderSet = this.folderSet;
    if (folderSet) {
      folderSetId = folderSet.id;
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

    try {
      const res = await fetch('api/import', {
        method: 'POST',
        body: JSON.stringify(postData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      this.isCreatingWorkspace = false;
      if (data.workspace) {
        this.createdWorkspace = data.workspace;
        let hasCreatedAssignment = this.createdAssignment;
        if (!this.utils.isNonEmptyObject(hasCreatedAssignment)) {
          this.toWorkspaces(data.workspace);
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
    } catch (err) {
      this.errorHandling.handleErrors(err, 'postErrors');
    }
  }

  @action
  async createAssignment() {
    if (this.assignmentName) {
      this.savingAssignment = true;
      let section = this.selectedSection;
      let problem = this.selectedProblem;
      let name = this.assignmentName;
      let createdBy = this.currentUser.user;
      let assignedDate = new Date();
      let dueDate = new Date();

      const students = section.students;

      const createAssignmentData = this.store.createRecord('assignment', {
        createdBy: createdBy,
        createDate: new Date(),
        section: section,
        problem: problem,
        assignedDate: assignedDate,
        dueDate: dueDate,
        name: name,
      });

      students.forEach((student) => {
        createAssignmentData.students.pushObject(student);
      });

      try {
        const assignment = await createAssignmentData.save();
        this.savingAssignment = false;
        this.createdAssignment = assignment;
        this.alert.showToast(
          'success',
          'Assignment Created',
          'bottom-end',
          3000,
          false,
          null
        );
        this.uploadAnswers();
      } catch (err) {
        this.errorHandling.handleErrors(
          err,
          'createRecordErrors',
          createAssignmentData
        );
      }
    }
  }

  @action
  importWork() {
    if (this.assignmentName) {
      this.createAssignment();
    } else {
      this.uploadAnswers();
    }
  }

  @action
  toggleMenu() {
    document.getElementById('filter-list-side').classList.toggle('collapse');
    document.getElementById('arrow-icon').classList.toggle('fa-rotate-180');
    document
      .getElementById('filter-list-side')
      .classList.add('animated', 'slideInLeft');
  }
}
