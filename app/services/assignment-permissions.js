import Service, { inject as service } from '@ember/service';

export default class AssignmentPermissionsService extends Service {
  @service('edit-permissions') base;
  @service('utility-methods') utils;

  getPermissionsLevel(assignment, section, user = this.base.user) {
    console.log('here');
    if (!user) {
      return 0;
    }
    if (this.base.isActingAdmin) {
      return 4;
    }
    if (this.base.isRecordInPdDomain(section)) {
      return 3;
    }
    if (this.base.isCreator(assignment)) {
      return 2;
    }
    if (section && this.isSectionTeacher(assignment, section)) {
      return 1;
    }
    return 0;
  }

  isSectionTeacher(assignment, section) {
    if (!assignment || !section) {
      return false;
    }

    let assnSectionId = this.utils.getBelongsToId(assignment, 'section');
    if (assnSectionId !== section.id) {
      return false;
    }

    let teacherIds = this.utils.getHasManyIds(section, 'teachers');
    if (!this.utils.isNonEmptyArray(teacherIds)) {
      return false;
    }
    return teacherIds.includes(this.base.userId);
  }

  canDelete(assignment) {
    if (this.base.isActingAdmin) {
      return true;
    }
    return !this.haveAnswersBeenSubmitted(assignment);
  }

  canEditProblem(assignment, section) {
    if (this.base.isActingAdmin) {
      return true;
    }
    if (this.haveAnswersBeenSubmitted(assignment)) {
      return false;
    }
    return this.getPermissionsLevel(assignment, section) > 1;
  }

  canEditLinkedWorkspace(assignment) {
    if (this.base.isActingAdmin) {
      return true;
    }
    return this.base.isCreator(assignment);
  }

  isNowBeforeAssignedDate(assignment) {
    if (!assignment) {
      return false;
    }
    const currentDate = new Date();
    const assignedDate = assignment.assignedDate;
    return currentDate < assignedDate;
  }

  canEditAssignedDate(assignment) {
    return (
      !assignment.assignedDate ||
      !this.haveAnswersBeenSubmitted(assignment) ||
      this.isNowBeforeAssignedDate(assignment)
    );
  }

  canEditDueDate(assignment) {
    if (this.base.isActingAdmin) {
      return true;
    }
    return this.base.isCreator(assignment);
  }

  haveAnswersBeenSubmitted(assignment) {
    let answerIds = this.utils.getHasManyIds(assignment, 'answers');
    return this.utils.isNonEmptyArray(answerIds);
  }

  canEdit(cws, type, level) {
    return this.getPermissionsLevel(cws, type) >= level;
  }

  canRespond(currentWorkspace) {
    return this.canEdit(currentWorkspace, 'feedback', 1);
  }
}
