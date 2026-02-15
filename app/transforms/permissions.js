import Transform from '@ember-data/serializer/transform';

/**
 * PermissionsTransform
 *
 * Defines the structure and serialization logic for the workspace permissions attribute.
 * Permissions is an array of permission objects, each defining a user's access level
 * and specific permissions for folders, selections, comments, and feedback.
 *
 * This transform ensures that:
 * 1. Permissions are always returned/stored as plain JavaScript objects (no Ember wrappers)
 * 2. The structure is consistent and validated
 * 3. Circular references from Ember tracking are prevented at the source
 */
export default class PermissionsTransform extends Transform {
  /**
   * Deserialize incoming data from the API into our internal format.
   * The API should return an array of permission objects.
   */
  deserialize(serialized) {
    if (!Array.isArray(serialized)) {
      return [];
    }

    // Return plain array of plain objects with only the data we need
    return serialized.map((p) => this._cleanPermission(p));
  }

  /**
   * Serialize outgoing data to send to the API.
   * Ensures we're sending only plain objects without Ember internals.
   */
  serialize(deserialized) {
    if (!Array.isArray(deserialized)) {
      return [];
    }

    // Return plain array of plain objects
    return deserialized.map((p) => this._cleanPermission(p));
  }

  /**
   * Extract only the properties we care about from a permission object.
   * This removes any Ember tracking wrappers, observers, or circular references.
   */
  _cleanPermission(p) {
    if (!p || typeof p !== 'object') {
      return null;
    }

    return {
      user: p.user,
      global: p.global,
      selections: p.selections,
      comments: p.comments,
      folders: p.folders,
      feedback: p.feedback,
      submissions: this._cleanSubmissions(p.submissions),
    };
  }

  /**
   * Clean the submissions sub-object which contains both flags and an array of IDs.
   */
  _cleanSubmissions(submissions) {
    if (!submissions || typeof submissions !== 'object') {
      return {
        all: false,
        userOnly: false,
        submissionIds: [],
      };
    }

    return {
      all: Boolean(submissions.all),
      userOnly: Boolean(submissions.userOnly),
      submissionIds: Array.isArray(submissions.submissionIds)
        ? [...submissions.submissionIds]
        : [],
    };
  }
}
