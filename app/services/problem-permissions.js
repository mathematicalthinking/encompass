import Service, { inject as service } from '@ember/service';






export default Service.extend({
  base: service('edit-permissions'),
  isPublic: function (problem) {
    return problem.get('privacySetting') === 'E';
  },
  isPrivate: function (problem) {
    return problem.get('privacySetting') === 'M';
  },

  isApproved(problem) {
    return problem.get('status') === 'approved';
  },

  isUsed(problem) {
    return problem.get('isUsed');
  },

  isTrashed(problem) {
    return problem.get('isTrashed');
  },

  canDelete(problem) {
    // undefined if no or bad argument passed in
    if (!problem) {
      return;
    }
    // if admin return true
    if (this.get('base.isAdmin')) {
      return true;
    }

    // only admins can edit problems that have been used (answers submitted)
    if (this.isUsed(problem)) {
      return false;
    }

    // if creator
    if (this.base.isCreator(problem)) {
      return true;
    }

    // at this point user is neither admin nor creator

    // currently this means that any non PdAdmin would not be able to edit/delete

    if (!this.get('base.isPdAdmin')) {
      return false;
    }

    // non admins can only edit true public ('E') problems if they created the // problem

    if (this.isPublic(problem)) {
      return false;
    }

    // privacy setting can now only be 'O' or 'M'
    return this.base.doesRecordBelongToOrg(problem);

  },

  canEdit(problem) {
    // undefined if no or bad argument passed in
    if (!problem) {
      return;
    }
    // if admin return true
    if (this.get('base.isAdmin')) {
      return true;
    }

    // only admins can edit problems that have been used (answers submitted)
    if (this.isUsed(problem)) {
      return false;
    }

    // if creator
    if (this.base.isCreator(problem)) {
      return true;
    }

    // at this point user is neither admin nor creator

    // currently this means that any non PdAdmin would not be able to edit/delete

    if (!this.get('base.isPdAdmin')) {
      return false;
    }

    // non admins can only edit true public ('E') problems if they created the // problem

    if (this.isPublic(problem)) {
      return false;
    }

    // privacy setting can now only be 'O' or 'M'

    return this.base.doesRecordBelongToOrg(problem);


  },

  canAssign(problem) {
    // undefined if no or bad argument passed in
    if (!problem || this.isTrashed(problem)) {
      return;
    }
    // if admin return true
    if (this.get('base.isAdmin')) {
      return true;
    }

    return this.isApproved(problem);

  },

  canPend(problem) {
    if (!problem) {
      return;
    }
    return this.get('base.isAdmin');
  },

  writePermissions(problem, isDeleteSameAsEdit = true) {
    let ret = {};

    let canDelete = this.canDelete(problem);
    ret.canDelete = canDelete;

    if (isDeleteSameAsEdit) {
      ret.canEdit = canDelete;
    } else {
      ret.canEdit = this.canEdit(problem);
    }

    ret.canAssign = this.canAssign(problem);
    ret.canPend = this.canPend(problem);

    return ret;
  },


});