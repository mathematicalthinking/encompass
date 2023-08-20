import Service, { inject as service } from '@ember/service';

export default class PermissionService extends Service {
  @service('edit-permissions') base;
  @service('utility-methods') utils;
  // permission tiers for assignments
  // highest admin - 4
  // pdAdmin for org - 3
  // next highest creator - 2
  // teacher - 1
  // rest 0
  // next highest teachers from assignment section
  getPermissionsLevel(assignment, section, user = this.base.user) {
    if (!user) return 0;
    if (this.base.isActingAdmin) return 4;
    if (this.base.isRecordInPdDomain(section)) return 3;
    if (this.base.isCreator(assignment)) return 2;
    if (section && this.isSectionTeacher(assignment, section)) return 1;
    return 0;
  }

  isSectionTeacher(assignment, section) {
    if (!assignment || !section) return false;

    let assnSectionId = this.utils.getBelongsToId(assignment, 'section');
    let teacherIds = this.utils.getHasManyIds(section, 'teachers');

    return (
      assnSectionId === section.get('id') &&
      this.utils.isNonEmptyArray(teacherIds) &&
      teacherIds.includes(this.base.userId)
    );
  }

  canDelete(assignment) {
    return (
      this.base.isActingAdmin || !this.haveAnswersBeenSubmitted(assignment)
    );
  }

  canEditProblem(assignment, section) {
    return (
      this.base.isActingAdmin ||
      (!this.haveAnswersBeenSubmitted(assignment) &&
        this.getPermissionsLevel(assignment, section) > 1)
    );
  }

  canEditLinkedWorkspace(assignment) {
    return this.base.isActingAdmin || this.base.isCreator(assignment);
  }

  isNowBeforeAssignedDate(assignment) {
    // true if assignedDate is in future
    if (!assignment) return false;

    const currentDate = new Date();
    const assignedDate = assignment.get('assignedDate');

    return currentDate < assignedDate;
  }

  canEditAssignedDate(assignment) {
    return (
      !assignment.get('assignedDate') ||
      !this.haveAnswersBeenSubmitted(assignment) ||
      this.isNowBeforeAssignedDate(assignment)
    );
  }

  canEditDueDate(assignment) {
    return this.base.isActingAdmin || this.base.isCreator(assignment);
  }

  haveAnswersBeenSubmitted(assignment) {
    let answerIds = this.utils.getHasManyIds(assignment, 'answers');
    return this.utils.isNonEmptyArray(answerIds);
  }
}
