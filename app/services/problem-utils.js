import Service from '@ember/service';
import { service } from '@ember/service';
import { hash } from 'rsvp';

export default class ProblemUtilityService extends Service {
  @service store;
  @service currentUser;
  @service('sweet-alert') alert;

  async fetchProblemData(problemId) {
    const problem = await this.store.findRecord('problem', problemId);
    const organization = await this.currentUser.user.organization;
    const recommendedProblems = organization
      ? await organization.recommendedProblems
      : [];

    let flaggedBy, flaggedDate;
    if (problem.flagReason?.flaggedBy) {
      flaggedBy = await this.store.findRecord(
        'user',
        problem.flagReason.flaggedBy
      );
      flaggedDate = new Date(problem.flagReason.flaggedDate);
    }

    return hash({
      problem,
      sectionList: this.store.findAll('section'),
      orgList: this.store.findAll('organization'),
      recommendedProblems,
      flaggedBy,
      flaggedDate,
    });
  }

  // Return a local copy of the problem as an object.
  async extractEditableProperties(problem) {
    const categories = await problem.categories; // fully load
    return {
      title: problem.title,
      author: problem.author,
      text: problem.text,
      categories: categories || [],
      status: problem.status,
      privacySetting: problem.privacySetting,
      sharingAuth: problem.sharingAuth,
      additionalInfo: problem.additionalInfo,
      copyrightNotice: problem.copyrightNotice,
      image: problem.image,
      keywords: problem.keywords?.slice() || [],
    };
  }

  /**
   * Converts an Ember Data Problem model into a plain JS object
   * suitable for passing to createRecord('problem', { ... }).
   *
   * Note: We omit fields like 'id', 'isUsed', 'error' because they
   * are typically not needed when creating a new problem record.
   */
  async convertToObject(problem) {
    const categories = await problem.categories; // fully load
    return {
      title: problem.title,
      puzzleId: problem.puzzleId,
      text: problem.text,
      imageUrl: problem.imageUrl,
      sourceUrl: problem.sourceUrl,
      image: problem.image, // Ember Data relationship (model instance) if loaded
      origin: problem.origin,
      modifiedBy: problem.modifiedBy,
      organization: problem.organization,
      additionalInfo: problem.additionalInfo,
      privacySetting: problem.privacySetting,
      categories: categories || [], // copy the array of models
      keywords: problem.keywords?.slice() ?? [], // copy the array of strings
      copyrightNotice: problem.copyrightNotice,
      sharingAuth: problem.sharingAuth,
      author: problem.author,
      status: problem.status,
      flagReason: problem.flagReason,
      contexts: problem.contexts,
    };
  }

  /**
   * Creates and saves a new "Problem" record, copying all fields from the given
   * `problem` but overwriting any specified in `newProperties`.
   *
   * @param {DS.Model} problem - An existing Problem model to copy.
   * @param {Object} newProperties - Key-value pairs that override the copied fields.
   * @returns {Promise<DS.Model>} - Resolves with the newly created and saved Problem.
   */
  async saveCopy(problem, newProperties = {}) {
    // Convert the existing problem into plain JS object
    let baseObject = await this.convertToObject(problem);

    // Merge the newProperties over the base fields
    let mergedProps = { ...baseObject, ...newProperties };

    // Create a new problem record
    let newProblem = this.store.createRecord('problem', mergedProps);

    // Save and return the promise so callers can await or .then().catch()
    return newProblem.save();
  }

  async deleteProblem(problem) {
    const { value: shouldDelete } = await this.alert.showModal(
      'warning',
      'Are you sure you want to delete this problem?',
      null,
      'Yes, delete it'
    );

    if (!shouldDelete) {
      return { wasDeleted: false, wasRestored: false };
    }

    problem.isTrashed = true;
    const savedProblem = await problem.save();

    const { value: shouldRestore } = await this.alert.showToast(
      'success',
      'Problem Deleted',
      'bottom-end',
      5000,
      true,
      'Undo'
    );

    if (!shouldRestore) {
      return { wasDeleted: true, wasRestored: false };
    }

    savedProblem.isTrashed = false;
    savedProblem.save().then(() => {
      this.alert.showToast(
        'success',
        'Problem Restored',
        'bottom-end',
        3000,
        false,
        null
      );
      return { wasDeleted: false, wasRestored: true };
    });
  }
}
