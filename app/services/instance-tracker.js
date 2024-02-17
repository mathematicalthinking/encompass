import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

/**
 * In the case where the content of multiple data instances might be edited by the same resource (based on its id),
 * this service keeps track of which data instance "has" the resource currently. Right now, this is just used by
 * response-mentor-single-reply to keep track of which reply is currenty being edited by the QuillContainer.
 *
 * Note that because our tracked variable is an object, we change its reference every time so that Ember knows
 * that a change happened.
 */

export default class InstanceTrackerService extends Service {
  @tracked currentInstances = {};
  defaultID = '###defaultID';

  getCurrentInstance(id = this.defaultID) {
    return this.currentInstances[id] || null;
  }

  setCurrentInstance(instance, id = this.defaultID) {
    this.currentInstances = { ...this.currentInstances, [id]: instance };
  }

  clearCurrentInstance(id = this.defaultID) {
    const { [id]: remove, ...rest } = this.currentInstances;
    this.currentInstances[id] = rest;
  }
}
