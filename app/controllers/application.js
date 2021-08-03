/**
 * # Application Controller
 * @description The controller for the application. Right now, we use this primarily for keeping track of the current user
 * @authors Damola Mabogunje <damola@mathforum.org>, Amir Tahvildaran <amir@mathforum.org>
 * @since 1.0.0
 */
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ApplicationController extends Controller {
  @service store;
  showCategoryList = false;
  isHidden = false;
  selectedCategories = [];
  isTouchScreen = false;

  get currentUser() {
    return this.model;
  }

  // resizeDisplay: function() {
  //   Ember.run.next(this, Ember.verticalSizing);
  // }.observes('isSmallHeader'),
  @action
  toHome() {
    window.location.href = '/';
  }
  @action
  handleFirstTouch() {
    this.isTouchScreen = true;
  }
}
