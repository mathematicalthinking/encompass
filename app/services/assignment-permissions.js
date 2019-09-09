Encompass.AssignmentPermissionsService = Ember.Service.extend({
  base: Ember.inject.service('edit-permissions'),
  utils: Ember.inject.service('utility-methods'),
  // admins, creators,

  // permission tiers for assignments
  // highest admin - 4
  // pdAdmin for org - 3
  // next highest creator - 2
  // teacher - 1
  // rest 0
  // next highest teachers from assignment section
  getPermissionsLevel(assignment, section, user=this.get('base.user')) {
    if (!user) {
      return 0;
    }
    if (this.get('base.isActingAdmin')) {
      return 4;
    }
    // assignments do not have org field but section does
    if (this.get('base').isRecordInPdDomain(section)) {
      return 3;
    }

    if (this.get('base').isCreator(assignment)) {
      return 2;
    }

    if (section) {
     if (this.isSectionTeacher(assignment, section)) {
       return 1;
     }
    }
    return 0;

  },

  isSectionTeacher(assignment, section) {
    if (!assignment || !section) {
      return;
    }

    let assnSectionId = this.get('utils').getBelongsToId(assignment, 'section');
    if (assnSectionId !== section.get('id')) {
      return false;
    }

    let teacherIds = this.get('utils').getHasManyIds(section, 'teachers');
    if (!this.get('utils').isNonEmptyArray(teacherIds)) {
      return false;
    }
    return teacherIds.includes(this.get('base.userId'));

  },

  canDelete: function(assignment) {
    if (this.get('base.isActingAdmin')) {
      return true;
    }
    if (this.haveAnswersBeenSubmitted(assignment)) {
      return false;
    }
  },

  canEditProblem(assignment, section) {
    if (this.get('base.isActingAdmin')) {
      return true;
    }
    if (this.haveAnswersBeenSubmitted(assignment)) {
      return false;
    }
    return this.getPermissionsLevel(assignment, section) > 1;
  },
  canEditLinkedWorkspace(assignment) {
    if (this.get('base.isActingAdmin')) {
      return true;
    }

    if (this.get('base').isCreator(assignment)) {
      return true;
    }

    // teachers?
  },
  isNowBeforeAssignedDate: function(assignment) {
    // true if assignedDate is in future
    if (!assignment) {
      return;
    }
    const currentDate = new Date();
    const assignedDate = assignment.get('assignedDate');
    return currentDate < assignedDate;
  },

  canEditAssignedDate(assignment) {
    return (
      !assignment.get('assignedDate') ||
      !this.haveAnswersBeenSubmitted(assignment) ||
      this.isNowBeforeAssignedDate(assignment)
    );
  },

  canEditDueDate(assignment) {
    if (this.get('base.isActingAdmin')) {
      return true;
    }

    if (this.get('base').isCreator(assignment)) {
      return true;
    }
  },

  haveAnswersBeenSubmitted(assignment) {
    let answerIds = this.get('utils').getHasManyIds(assignment, 'answers');
    return this.get('utils').isNonEmptyArray(answerIds);
  }



});