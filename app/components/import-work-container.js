import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class ImportWorkComponent extends Component {
  @service store;
  @service('sweet-alert') alert;
  @service('error-handling') errorHandling;
  @service('utility-methods') utils;
  @service('current-user') currentUser;

  @tracked elementId = 'import-work-container';
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
  @tracked createWorkspaceError = null;
  @tracked currentStep = { value: 1 };
  @tracked studentMap = {};
  @tracked submissionCount = 0;
  @tracked createdAssignment = null;
  @tracked isCompDirty = false;
  @tracked isFetchingSectionStudents = false;
  @tracked steps = [
    { value: 0 },
    { value: 1 },
    { value: 2 },
    { value: 3 },
    { value: 4 },
    { value: 5 },
    { value: 6 },
  ];

  getRecordId(record) {
    if (!record) {
      return null;
    }
    const proxiedContent = record.content || record._content || null;
    if (proxiedContent && proxiedContent !== record) {
      const proxiedId = this.getRecordId(proxiedContent);
      if (proxiedId) {
        return proxiedId;
      }
    }
    return (
      record.id ||
      record._id ||
      record.userId ||
      (typeof record.get === 'function'
        ? record.get('id') || record.get('_id') || record.get('userId')
        : null)
    );
  }

  getRecordValue(record, key) {
    if (!record) {
      return null;
    }
    if (typeof record.get === 'function') {
      return record.get(key);
    }
    return record[key];
  }

  findRecordInCollection(collection, id) {
    if (!collection || !id) {
      return null;
    }
    const normalizedId = String(id);
    const asArray =
      typeof collection.toArray === 'function'
        ? collection.toArray()
        : Array.isArray(collection)
        ? collection
        : [];
    return (
      asArray.find((record) => {
        const recordId =
          this.getRecordId(record) ||
          this.getRecordValue(record, 'id') ||
          this.getRecordValue(record, '_id');
        return String(recordId) === normalizedId;
      }) || null
    );
  }

  parseQueryBoolean(value) {
    if (value === true || value === 'true') {
      return true;
    }
    if (value === false || value === 'false') {
      return false;
    }
    return null;
  }

  parseDelimitedIds(value) {
    if (typeof value !== 'string') {
      return [];
    }
    return value
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean);
  }

  async restoreUploadedFilesFromQuery(uploadedFileIds) {
    const ids = this.parseDelimitedIds(uploadedFileIds);
    if (!ids.length) {
      return [];
    }

    const records = await Promise.all(
      ids.map(async (id) => {
        const fromStore = this.store.peekRecord('image', id);
        if (fromStore) {
          return fromStore;
        }
        try {
          return await this.store.findRecord('image', id);
        } catch (_err) {
          return null;
        }
      })
    );

    return records.filter(Boolean);
  }

  async restoreInitialStateFromQuery() {
    const maxStep = this.steps.length - 1;
    const parsedStep = Number.parseInt(this.args.initialStep, 10);
    let targetStep =
      Number.isInteger(parsedStep) && parsedStep >= 1 && parsedStep <= maxStep
        ? parsedStep
        : 1;

    const initialProblemId = this.args.initialProblemId;
    if (initialProblemId) {
      const selectedProblem =
        this.store.peekRecord('problem', initialProblemId) ||
        this.findRecordInCollection(
          this.args.model?.problems,
          initialProblemId
        );
      if (selectedProblem) {
        this.selectedProblem = selectedProblem;
      }
    }

    const initialSectionId = this.args.initialSectionId;
    if (initialSectionId) {
      const selectedSection =
        this.store.peekRecord('section', initialSectionId) ||
        this.findRecordInCollection(
          this.args.model?.sections,
          initialSectionId
        );
      if (selectedSection) {
        this.selectedSection = selectedSection;
      }
      // If a section was requested in query params, class matching must be on.
      this.selectedValue = true;
    }

    const initialUseClass = this.parseQueryBoolean(this.args.initialUseClass);
    if (initialUseClass !== null) {
      this.selectedValue = initialUseClass;
    }

    const restoredUploadedFiles = await this.restoreUploadedFilesFromQuery(
      this.args.initialUploadedFileIds
    );
    if (restoredUploadedFiles.length > 0) {
      this.uploadedFiles = restoredUploadedFiles;
    }

    if (targetStep > 1 && !this.selectedProblem) {
      targetStep = 1;
    }
    if (targetStep > 2 && this.selectedValue && !this.selectedSection) {
      targetStep = 2;
    }
    if (targetStep > 3 && this.uploadedFiles.length === 0) {
      targetStep = 3;
    }
    if (targetStep > 3 && this.uploadedFiles.length > 0) {
      this.loadStudentMatching();
      return;
    }

    this.currentStep = this.steps[targetStep];
  }

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
    this.sections = this.args.model?.sections || [];
    this.restoreInitialStateFromQuery().catch(() => null);
  }

  get users() {
    return this.args.users || [];
  }

  get folderSets() {
    return this.args.model?.folderSets || [];
  }

  get uploadedFileIdsParam() {
    if (!Array.isArray(this.uploadedFiles) || this.uploadedFiles.length === 0) {
      return null;
    }

    const ids = this.uploadedFiles
      .map((file) => this.getRecordId(file))
      .filter(Boolean)
      .map((id) => String(id));

    if (ids.length === 0) {
      return null;
    }

    return ids.join(',');
  }

  doConfirmLeaving(value) {
    if (typeof this.args.doConfirmLeaving === 'function') {
      this.args.doConfirmLeaving(value);
    }
  }

  toWorkspaces(workspace) {
    if (!workspace?._id) {
      return;
    }

    if (typeof this.args.toWorkspaces === 'function') {
      this.args.toWorkspaces(workspace);
      return;
    }

    const firstSubmissionId = workspace.submissions?.[0];
    if (firstSubmissionId) {
      window.location.href = `#/workspaces/${workspace._id}/submissions/${firstSubmissionId}`;
      return;
    }
    window.location.href = `#/workspaces/${workspace._id}/work`;
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
    const opts = ['selectedProblem', 'selectedSection'];
    opts.forEach((opt) => {
      this[opt] = null;
    });
    this.uploadedFiles = [];
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

  @action
  setSelectedProblem(problem) {
    if (problem) {
      this.selectedProblem = problem;
    }
    this.currentStep = this.steps[2];
  }

  @action
  updateStep2Selection(step2Selection = null) {
    if (!this.utils.isNonEmptyObject(step2Selection)) {
      return;
    }

    const { selectedSection = null, selectedValue = false } = step2Selection;
    this.selectedSection = selectedSection;
    this.selectedValue = selectedValue === true;
  }

  @action
  async setSelectedSection(step2Selection = null) {
    this.updateStep2Selection(step2Selection);
    const section = this.selectedValue ? this.selectedSection : null;

    // get section info needed for matching
    let students;
    this.isFetchingSectionStudents = true;
    try {
      students = await this.getSectionStudents(section);
    } catch (_err) {
      return;
    } finally {
      this.isFetchingSectionStudents = false;
    }

    const asArray =
      typeof students?.toArray === 'function'
        ? students.toArray()
        : Array.isArray(students)
        ? students
        : [];
    const hash = {};
    asArray.forEach((user) => {
      hash[user.id] = user;
    });
    this.studentMap = hash;
    this.currentStep = this.steps[3];
  }

  @action
  async refreshSelectedSectionStudents() {
    const section = this.selectedSection;
    if (!section) {
      return;
    }

    let students;
    this.isFetchingSectionStudents = true;
    try {
      students = await this.getSectionStudents(section);
    } catch (_err) {
      return;
    } finally {
      this.isFetchingSectionStudents = false;
    }

    const asArray =
      typeof students?.toArray === 'function'
        ? students.toArray()
        : Array.isArray(students)
        ? students
        : [];

    const hash = {};
    asArray.forEach((user) => {
      hash[user.id] = user;
    });
    this.studentMap = hash;
  }

  @action
  setUploadedFiles(files) {
    this.uploadedFiles = Array.isArray(files) ? files : [];
    this.loadStudentMatching();
  }

  @action
  setMatchedStudents() {
    let submissionCount = 0;
    (this.answers || []).forEach((answer) => {
      const studentsCount = Array.isArray(answer.students)
        ? answer.students.length
        : 0;
      const studentNamesCount = Array.isArray(answer.studentNames)
        ? answer.studentNames.length
        : 0;
      submissionCount += studentsCount + studentNamesCount;
    });
    this.submissionCount = submissionCount;
    this.currentStep = this.steps[5];
  }
  @action
  prepareReview(config = null) {
    if (this.utils.isNonEmptyObject(config)) {
      this.doCreateWs = config.doCreateWs === true;
      this.createAssignmentValue = config.createAssignmentValue === true;
      this.selectedOwner = config.selectedOwner || null;
      this.selectedFolderSet = config.selectedFolderSet || null;
      this.selectedMode = config.selectedMode || 'private';
      this.workspaceName = config.workspaceName || null;
      this.workspaceOwner = config.workspaceOwner || null;
      this.workspaceMode = config.workspaceMode || null;
      this.folderSet = config.folderSet || null;
      this.assignmentName = config.assignmentName || null;
    }
    this.currentStep = this.steps[6];
  }

  @action
  async loadStudentMatching() {
    const images = Array.isArray(this.uploadedFiles) ? this.uploadedFiles : [];
    const answers = images
      .map((image) => {
        const imageId = this.getRecordId(image);
        if (!imageId) {
          return null;
        }

        const record = this.store.peekRecord('image', imageId);
        const url = `/api/images/file/${imageId}`;
        const imgStr = `<img src='${url}'>`;
        return {
          explanation: imgStr,
          explanationImage: record || image,
          problem: this.selectedProblem,
          section: this.selectedSection,
          isSubmitted: true,
          students: [],
          studentNames: [],
        };
      })
      .filter(Boolean);

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
    this.isUploadingAnswer = true;
    let answers = this.answers || [];
    let assignment = this.createdAssignment || null;
    try {
      const allAnswerEntries = await Promise.all(
        answers.map(async (answer) => {
          if (this.utils.isNonEmptyArray(answer.students)) {
            return Promise.all(
              answer.students.map(async (student) => {
                let ans = this.store.createRecord('answer', answer);
                ans.answer = 'See Image';
                ans.section = this.selectedSection;
                ans.problem = this.selectedProblem;
                ans.assignment = assignment;
                ans.createdBy = student;
                await ans.save();
                return {
                  answerRecord: ans,
                  creatorStudent: student,
                  studentNames: [],
                };
              })
            );
          }
          if (this.utils.isNonEmptyArray(answer.studentNames)) {
            return Promise.all(
              answer.studentNames.map(async (student) => {
                let ans = this.store.createRecord('answer', answer);
                ans.answer = 'See Image';
                ans.section = this.selectedSection;
                ans.problem = this.selectedProblem;
                ans.assignment = assignment;
                ans.createdBy = this.currentUser.user;
                ans.studentNames = [student];
                await ans.save();
                return {
                  answerRecord: ans,
                  creatorStudent: this.currentUser.user,
                  studentNames: [student],
                };
              })
            );
          }
          return [];
        })
      );
      const flattenedAnswerEntries = allAnswerEntries.flat(1);
      this.alert.showToast(
        'success',
        `${flattenedAnswerEntries.length} Submissions Created`,
        'bottom-end',
        3000,
        false,
        null
      );
      this.uploadedAnswers = true;
      const normalizedWorkspaceName =
        typeof this.workspaceName === 'string'
          ? this.workspaceName.trim()
          : this.workspaceName;
      const shouldCreateWorkspace = Boolean(normalizedWorkspaceName);
      this.workspaceName = normalizedWorkspaceName || null;
      if (shouldCreateWorkspace) {
        this.isUploadingAnswer = false;
        this.isCreatingWorkspace = true;
        await this.createSubmissions(flattenedAnswerEntries);
      } else {
        this.isUploadingAnswer = false;
        this.isCompDirty = false;
        this.doConfirmLeaving(false);
      }
    } catch (err) {
      this.isUploadingAnswer = false;
      this.isCreatingWorkspace = false;
      this.errorHandling.handleErrors(err, 'createAnswerErrors');
      this.alert.showToast(
        'error',
        err?.message || 'Failed while preparing workspace submissions',
        'bottom-end',
        5000,
        false,
        null
      );
    }
  }
  @action
  createSubmissions(answerEntries) {
    if (!Array.isArray(answerEntries) || answerEntries.length === 0) {
      throw new Error('No submissions were prepared for workspace creation.');
    }
    let subs = answerEntries.map((entry) => {
      const ans = entry?.answerRecord || entry;
      const clazz = {};
      const publication = {
        publicationId: null,
        puzzle: {},
      };
      const creator = {};
      const teacher = {};
      const student =
        entry?.creatorStudent || this.getRecordValue(ans, 'createdBy');
      const section =
        this.getRecordValue(ans, 'section') || this.selectedSection;
      const problem =
        this.getRecordValue(ans, 'problem') || this.selectedProblem;
      const entryStudentNames = Array.isArray(entry?.studentNames)
        ? entry.studentNames
        : [];
      const ansStudentNames = this.getRecordValue(ans, 'studentNames');
      const studentNames = this.utils.isNonEmptyArray(entryStudentNames)
        ? entryStudentNames
        : this.utils.isNonEmptyArray(ansStudentNames)
        ? ansStudentNames
        : [];

      publication.puzzle.title =
        this.getRecordValue(this.selectedProblem, 'title') || '';
      publication.puzzle.problemId =
        this.getRecordValue(problem, 'problemId') ||
        this.getRecordValue(problem, 'id') ||
        this.getRecordId(problem) ||
        null;

      if (this.utils.isNonEmptyArray(studentNames)) {
        creator.username = studentNames[0];
      } else {
        creator.studentId =
          this.getRecordValue(student, 'userId') || this.getRecordId(student);
        creator.username =
          this.getRecordValue(student, 'username') ||
          this.getRecordValue(student, 'name') ||
          '';
      }

      if (section) {
        clazz.sectionId =
          this.getRecordValue(section, 'sectionId') ||
          this.getRecordId(section);
        clazz.name = this.getRecordValue(section, 'name') || '';
        const teachers = this.getRecordValue(section, 'teachers');
        const primaryTeacher =
          teachers?.firstObject ||
          (Array.isArray(teachers) ? teachers[0] : null) ||
          null;
        if (primaryTeacher) {
          teacher.id =
            this.getRecordValue(primaryTeacher, 'userId') ||
            this.getRecordId(primaryTeacher);
        }
      }

      const answerId = this.getRecordId(ans);
      let sub = {
        // longAnswer: ans.explanation,
        answer: answerId,
        clazz: clazz,
        creator: creator,
        teacher: teacher,
        publication: publication,
      };
      return sub;
    });

    return this.createWorkspace(subs);
  }

  @action
  async createWorkspace(subs) {
    this.isCreatingWorkspace = true;
    this.createWorkspaceError = null;
    this.isCompDirty = false;
    this.doConfirmLeaving(false);
    const ownerRecord = this.workspaceOwner || this.selectedOwner || null;
    const workspaceOwnerId =
      this.getRecordId(ownerRecord) || this.getRecordId(this.currentUser?.user);
    const folderSetRecord = this.folderSet || this.selectedFolderSet || null;
    const folderSetId = this.getRecordId(folderSetRecord) || '';
    const workspaceMode = this.workspaceMode || this.selectedMode || 'private';
    const requestedName =
      typeof this.workspaceName === 'string'
        ? this.workspaceName.trim()
        : this.workspaceName;
    const safeRequestedName =
      requestedName || `Imported Workspace ${new Date().toISOString()}`;

    if (!workspaceOwnerId) {
      this.isCreatingWorkspace = false;
      const msg = 'Workspace owner is required to create workspace';
      this.errorHandling.handleErrors(new Error(msg), 'postErrors');
      this.alert.showToast('error', msg, 'bottom-end', 4000, false, null);
      return;
    }

    let postData = {
      subs: JSON.stringify(subs),
      doCreateWorkspace: true,
      workspaceOwner: JSON.stringify(workspaceOwnerId),
      requestedName: JSON.stringify(safeRequestedName),
      workspaceMode: JSON.stringify(workspaceMode),
      folderSet: JSON.stringify(folderSetId),
    };
    try {
      let timeoutId;
      const requestTimeoutMs = 45000;
      const res = await Promise.race([
        fetch('/api/import', {
          method: 'POST',
          body: JSON.stringify(postData),
          headers: {
            'Content-Type': 'application/json',
          },
        }),
        new Promise((_, reject) => {
          timeoutId = setTimeout(() => {
            reject(
              new Error(
                'Workspace creation timed out. It may still finish in the background.'
              )
            );
          }, requestTimeoutMs);
        }),
      ]).finally(() => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      });
      const raw = await res.text();
      let data = {};
      if (raw) {
        try {
          data = JSON.parse(raw);
        } catch (_err) {
          data = { message: raw };
        }
      }

      if (!res.ok) {
        const message =
          data?.errors?.[0]?.detail ||
          data?.message ||
          `Workspace creation failed with status ${res.status}`;
        throw new Error(message);
      }

      const createdWorkspace =
        data.workspace ||
        (Array.isArray(data.workspaces) ? data.workspaces[0] : null);

      if (!createdWorkspace) {
        throw new Error(
          'Workspace was not created. No workspace payload returned.'
        );
      }

      this.isCreatingWorkspace = false;
      this.createdWorkspace = createdWorkspace;
      let hasCreatedAssignment = this.createdAssignment;
      if (!this.utils.isNonEmptyObject(hasCreatedAssignment)) {
        this.toWorkspaces(createdWorkspace);
      }
      this.alert.showToast(
        'success',
        'Workspace Created',
        'bottom-end',
        4000,
        false,
        null
      );
    } catch (err) {
      this.isCreatingWorkspace = false;
      this.createWorkspaceError = err?.message || 'Workspace creation failed';
      this.errorHandling.handleErrors(err, 'postErrors');
      this.alert.showToast(
        'error',
        err?.message || 'Workspace creation failed',
        'bottom-end',
        5000,
        false,
        null
      );
    }
  }

  @action
  resetCreateWorkspaceError() {
    this.createWorkspaceError = null;
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
        this.savingAssignment = false;
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
    const filter = document.getElementById('filter-list-side');
    const arrow = document.getElementById('arrow-icon');
    if (!filter || !arrow) {
      return;
    }
    filter.classList.toggle('collapse');
    arrow.classList.toggle('fa-rotate-180');
    filter.classList.add('animated', 'slideInLeft');
  }
}
