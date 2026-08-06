import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { next } from '@ember/runloop';
import { registerDestructor } from '@ember/destroyable';
import { format, subYears } from 'date-fns';

export default class SubmissionsFilterComponent extends Component {
  @service('sweet-alert') alert;
  @service('error-handling') errorHandling;
  @service('utility-methods') utils;
  @service store;
  @service('current-user') currentUser;

  _isDestroyed = false;

  constructor() {
    super(...arguments);
    registerDestructor(this, () => {
      this._isDestroyed = true;
    });
  }

  findRecordErrors = [];
  wsRequestErrors = [];

  // Filter selections — local state seeded from args. The parent reads results
  // back through @onSearch, not by reading these, so the component owns them.
  @tracked selectedTeacher = this.args.selectedTeacher;
  @tracked selectedAssignment = this.args.selectedAssignment;
  @tracked selectedProblem = this.args.selectedProblem;
  @tracked selectedSection = this.args.selectedSection;
  @tracked selectedStudents = this.args.selectedStudents ?? [];
  @tracked startDate = format(subYears(new Date(), 1), 'yyyy-MM-dd');
  @tracked endDate = format(new Date(), 'yyyy-MM-dd');
  @tracked doIncludeOldPows = this.args.doIncludeOldPows;
  @tracked isVmtOnly = false;
  @tracked isTrashedOnly = this.args.isTrashedOnly;
  @tracked vmtSearchText;
  @tracked showVmtFilters = false;
  @tracked isMissingCriteria = null;
  @tracked isInvalidDateRange = null;

  tooltips = {
    teacher: 'Find all work related to this teacher',
    assignment: 'Find all work related to this assignment',
    problem: 'Find all accessibile work related to this problem',
    class: 'Find all work completed by this class',
    dateRange: 'Find all accessibile work for this date range',
    owner: 'Who will have ownership of this workspace',
    name: 'Give your workspace a name. If not, workspace names are generated based off given criteria',
    folders: 'Choose a starter folder set, you can create your own later',
    privacy:
      'Private workspaces are only visibile by the owner and collaborators. Public workspaces are visibile to all users',
  };
  missingCriteriaMessage =
    'Please select either a teacher, assignment, problem, class, or at least one student.';
  invalidDateRangeMessage = 'Please provide a valid date range.';

  // base pools snapshotted from the passed model args (was didReceiveAttrs)
  get baseSections() {
    return this.args.sections ? this.args.sections.slice() : [];
  }
  get baseAssignments() {
    return this.args.assignments ? this.args.assignments.slice() : [];
  }
  get baseUsers() {
    return this.args.users ? this.args.users.slice() : [];
  }

  get doFetchStudents() {
    return (
      !this.selectedAssignment && !this.selectedSection && !this.selectedTeacher
    );
  }

  get isTeacher() {
    const user = this.currentUser.user;
    return user?.accountType === 'T' && user?.actingRole !== 'student';
  }

  get initialTeacherItem() {
    if (this.isTeacher) {
      return [this.currentUser.user?.id];
    }
    if (this.selectedTeacher) {
      return [this.selectedTeacher.id];
    }
    return [];
  }

  get initialStudentItem() {
    if (this.currentUser.isStudent) {
      return [this.currentUser.user?.id];
    }
    if (Array.isArray(this.selectedStudents)) {
      return this.selectedStudents.map((student) => student.id);
    }
    return [];
  }

  get initialAssignmentItem() {
    if (this.selectedAssignment) {
      return [this.selectedAssignment.id];
    }
    return [];
  }

  get initialProblemItem() {
    if (this.selectedProblem) {
      return [this.selectedProblem.id];
    }
    return [];
  }

  get initialSectionItem() {
    if (this.selectedSection) {
      return [this.selectedSection.id];
    }
    return [];
  }

  get teacherPool() {
    const assignment = this.selectedAssignment;
    const section = this.selectedSection;
    const students = this.selectedStudents;

    if (section) {
      return section.get('teachers');
    }
    if (assignment) {
      return assignment.get('section.teachers');
    }

    if (this.utils.isNonEmptyArray(students)) {
      const sections = this.selectedStudentsSections;
      if (sections) {
        const teachers = sections.mapBy('teachers');
        const results = [];
        if (teachers) {
          teachers.forEach((arr) => {
            results.addObjects(arr);
          });
          return results;
        }
      }
      return [];
    }

    if (this.baseUsers) {
      return this.baseUsers.rejectBy('accountType', 'S');
    }
    return [];
  }

  get teacherPoolOptions() {
    if (!this.teacherPool) {
      return [];
    }
    return this.teacherPool.map((teacher) => {
      return {
        id: teacher.get('id'),
        username: teacher.get('username'),
      };
    });
  }

  get studentPool() {
    const assignment = this.selectedAssignment;
    const section = this.selectedSection;
    const teacher = this.selectedTeacher;

    // students can only make workspaces from their own work
    if (this.currentUser.isStudent) {
      return [this.currentUser.user];
    }

    if (assignment) {
      return assignment.get('students');
    }

    if (section) {
      return section.get('students');
    }

    if (teacher) {
      const sections = this.selectedTeacherSections;

      const studentsBySection = sections.mapBy('students');
      const results = [];
      studentsBySection.forEach((students) => {
        results.addObjects(students);
      });
      return results;
    }
    const baseUsers = this.baseUsers;
    if (baseUsers) {
      return baseUsers;
    }
    return [];
  }

  get problemFilters() {
    const results = {};
    const assignment = this.selectedAssignment;
    if (assignment) {
      const id = assignment.belongsTo('problem').id();
      results.ids = [id];
    }
    return results;
  }

  get studentPoolOptions() {
    const students = this.studentPool;

    if (!students || typeof students !== 'object') {
      return [];
    }
    return students.map((user) => {
      return {
        id: user.get('id'),
        username: user.get('username'),
      };
    });
  }

  get selectedTeacherSectionIds() {
    const sectionsFromTeacher = this.selectedTeacher?.get('sections');
    if (sectionsFromTeacher) {
      return sectionsFromTeacher
        .filter((section) => section.role === 'teacher')
        .map((section) => section.sectionId);
    }
    return [];
  }

  get selectedTeacherAssignments() {
    if (!this.selectedTeacher) {
      return [];
    }
    // Read the related ids off the relationship reference (no network load), so
    // an assignment pointing at a deleted section/teacher doesn't 404.
    return this.baseAssignments.filter((assignment) => {
      return (
        assignment.belongsTo('createdBy').id() === this.selectedTeacher.id ||
        this.selectedTeacherSectionIds.includes(
          assignment.belongsTo('section').id()
        )
      );
    });
  }

  get selectedProblemAssignments() {
    if (!this.selectedProblem) {
      return [];
    }
    return this.baseAssignments.filter(
      (assignment) =>
        assignment.belongsTo('problem').id() === this.selectedProblem.id
    );
  }

  get selectedSectionAssignments() {
    if (!this.selectedSection) {
      return [];
    }
    return this.baseAssignments.filter((assignment) => {
      return this.selectedSection.get('assignments').includes(assignment);
    });
  }

  get selectedStudentsAssignments() {
    const students = this.selectedStudents;
    if (!this.utils.isNonEmptyArray(students)) {
      return [];
    }
    const assignments = students.mapBy('assignments');
    const results = [];
    assignments.forEach((arr) => {
      results.addObjects(arr);
    });
    return results;
  }

  get assignmentOptions() {
    let assignments = [];
    const teacher = this.selectedTeacher;
    const problem = this.selectedProblem;
    const section = this.selectedSection;
    const students = this.selectedStudents;
    const utils = this.utils;

    if (!teacher && !problem && !section && !students) {
      assignments = this.baseAssignments;
    } else {
      const hashMaps = [];
      if (teacher) {
        const teacherMap = {};
        this.selectedTeacherAssignments.forEach((assignment) => {
          teacherMap[assignment.get('id')] = true;
        });
        hashMaps.push(teacherMap);
      }
      if (problem) {
        const problemMap = {};
        this.selectedProblemAssignments.forEach((assignment) => {
          problemMap[assignment.get('id')] = true;
        });
        hashMaps.push(problemMap);
      }
      if (section) {
        const sectionMap = {};
        this.selectedSectionAssignments.forEach((assignment) => {
          sectionMap[assignment.get('id')] = true;
        });
        hashMaps.push(sectionMap);
      }
      if (utils.isNonEmptyArray(students)) {
        const studentsMap = {};
        this.selectedStudentsAssignments.forEach((assignment) => {
          studentsMap[assignment.get('id')] = true;
        });
        hashMaps.push(studentsMap);
      }
      assignments = this.baseAssignments.filter((assignment) => {
        return hashMaps.every((hashMap) => hashMap[assignment.get('id')]);
      });
    }

    return assignments.map((assignment) => {
      return {
        id: assignment.id,
        name: assignment.get('name'),
      };
    });
  }

  get sectionPool() {
    const assignment = this.selectedAssignment;
    const teacher = this.selectedTeacher;
    const students = this.selectedStudents;
    const utils = this.utils;
    if (assignment) {
      const section = assignment.get('section');
      if (section) {
        return [section];
      }
      return [];
    }

    if (utils.isNonEmptyArray(students)) {
      return this.selectedStudentsSections;
    }

    if (teacher) {
      return this.selectedTeacherSections;
    }
    if (this.baseSections) {
      return this.baseSections;
    }
    return [];
  }

  get sectionPoolOptions() {
    const sections = this.sectionPool;
    if (sections) {
      return sections.map((section) => {
        return {
          id: section.get('id'),
          name: section.get('name'),
        };
      });
    }
    return [];
  }

  get selectedStudentSectionIds() {
    const students = this.selectedStudents;
    if (!students) {
      return [];
    }
    const studentSections = students.mapBy('sections');
    const sectionObjects = [];
    studentSections.forEach((arr) => {
      sectionObjects.addObjects(arr);
    });

    const filtered = sectionObjects.filterBy('role', 'student');
    return filtered.mapBy('sectionId');
  }

  get selectedStudentsSections() {
    const students = this.selectedStudents;
    const sections = this.baseSections;
    if (!students) {
      return [];
    }
    const ids = this.selectedStudentSectionIds;
    if (sections && Array.isArray(ids)) {
      return sections.filter((section) => {
        return ids.includes(section.get('id'));
      });
    }
    return [];
  }

  get selectedTeacherSections() {
    if (!this.selectedTeacher) {
      return [];
    }
    const sections = this.baseSections;
    const ids = this.selectedTeacherSectionIds;
    if (sections && Array.isArray(ids)) {
      return sections.filter((section) => {
        return ids.includes(section.get('id'));
      });
    }
    return [];
  }

  get selectedAssignmentSections() {
    if (!this.selectedAssignment) {
      return [];
    }
    return this.baseSections.filter((section) => {
      const assignments = section.get('assignments');
      return assignments
        ? assignments.includes(this.selectedAssignment)
        : false;
    });
  }

  get sectionOptions() {
    let sections = [];
    const teacher = this.selectedTeacher;
    const assignment = this.selectedAssignment;

    if (!teacher && !assignment) {
      sections = this.baseSections;
    } else {
      const hashMaps = [];
      if (teacher) {
        const teacherMap = {};
        this.selectedTeacherSections.forEach((section) => {
          teacherMap[section.get('id')] = true;
        });
        hashMaps.push(teacherMap);
      }

      if (assignment) {
        const assignmentMap = {};
        this.selectedAssignmentSections.forEach((assignmentSection) => {
          assignmentMap[assignmentSection.get('id')] = true;
        });
        hashMaps.push(assignmentMap);
      }
      sections = this.baseSections.filter((section) => {
        return hashMaps.every((hashMap) => hashMap[section.get('id')]);
      });
    }

    return sections.map((section) => {
      return {
        id: section.id,
        name: section.get('name'),
      };
    });
  }

  get isAnswerCriteriaValid() {
    const utils = this.utils;
    const params = [
      'selectedTeacher',
      'selectedAssignment',
      'selectedProblem',
      'selectedSection',
      'vmtSearchText',
    ];
    for (const param of params) {
      if (this[param]) {
        return true;
      }
    }
    if (utils.isNonEmptyArray(this.selectedStudents)) {
      return true;
    }
    return false;
  }

  @action
  buildCriteria() {
    // clear errors if any
    const errorProps = ['isMissingCriteria', 'isInvalidDateRange'];
    errorProps.forEach((prop) => {
      if (this[prop]) {
        this[prop] = null;
      }
    });
    const utils = this.utils;
    if (!this.isAnswerCriteriaValid) {
      this.isMissingCriteria = true;
      return;
    }

    const students = this.selectedStudents;
    let studentIds;
    if (students) {
      studentIds = students.map((student) => student.id);
    }
    const criteria = {
      teacher: this.selectedTeacher?.id,
      assignment: this.selectedAssignment?.id,
      problem: this.selectedProblem?.id,
      section: this.selectedSection?.id,
      startDate: this.startDate,
      endDate: this.endDate,
      students: studentIds,
      doIncludeOldPows: this.doIncludeOldPows,
      isVmtOnly: this.isVmtOnly,
      vmtSearchText: this.vmtSearchText,
      isTrashedOnly: this.isTrashedOnly,
    };
    Object.keys(criteria).forEach((key) => {
      const val = criteria[key];
      if (utils.isNullOrUndefined(val) || val === '') {
        delete criteria[key];
      }
    });
    this.args.onSearch(criteria);
  }

  // SelectizeInput fires @onItemAdd/@onItemRemove from a did-update modifier
  // (to sync its initial selection), i.e. during render — so we schedule the
  // tracked write for after render to avoid a read-then-write backtracking
  // assertion, and skip no-op re-syncs so the sync loop settles.
  _setSelectionLater(prop, value) {
    if (this[prop] === value) {
      return;
    }
    next(this, () => {
      if (this._isDestroyed) {
        return;
      }
      this[prop] = value;
    });
  }

  @action
  updateSelectizeSingle(val, $item, propToUpdate, model) {
    if ($item === null) {
      this._setSelectionLater(propToUpdate, null);
      return;
    }
    const record = this.store.peekRecord(model, val);
    if (!record) {
      return;
    }
    this._setSelectionLater(propToUpdate, record);
  }

  @action
  updateSelectedStudents(val, $item) {
    if (!val) {
      return;
    }
    const selectedStudents = this.selectedStudents ?? [];
    if ($item === null) {
      // removal
      const studentToRemove = selectedStudents.find(
        (student) => student.id === val
      );
      if (studentToRemove) {
        this._setSelectionLater(
          'selectedStudents',
          selectedStudents.filter((student) => student !== studentToRemove)
        );
      }
      return;
    }
    const record = this.store.peekRecord('user', val);
    // skip re-syncs for a student that is already selected
    if (record && !selectedStudents.includes(record)) {
      this._setSelectionLater('selectedStudents', [
        ...selectedStudents,
        record,
      ]);
    }
  }

  @action
  toggleVmtFilters() {
    this.showVmtFilters = !this.showVmtFilters;
  }

  @action
  resetMissingCriteria() {
    this.isMissingCriteria = null;
  }

  @action
  resetInvalidDateRange() {
    this.isInvalidDateRange = null;
  }
}
