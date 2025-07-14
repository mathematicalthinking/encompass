import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class CurrentUserService extends Service {
  @tracked user = {};

  setUser(data) {
    this.user = data;
  }

  get isAdmin() {
    return this.user.isAdmin;
  }

  get isPdAdmin() {
    return this.user.isPdAdmin;
  }

  get isTeacher() {
    return this.user.isTeacher;
  }

  get isStudent() {
    return this.user.isStudent;
  }

  get isActingAdmin() {
    return this.user.isActingAdmin;
  }

  get isActingPdAdmin() {
    return this.user.isActingPdAdmin;
  }

  get id() {
    return this.user.id;
  }

  async toggleActingRole() {
    const user = this.user;
    if (user.accountType === 'S') return;

    const newRole = user.actingRole === 'teacher' ? 'student' : 'teacher';
    user.actingRole = newRole;
    return await user.save();
  }
}
