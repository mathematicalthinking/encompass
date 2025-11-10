import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class AiDraftService extends Service {
  @tracked contextSubmissions = [];

  setContext(submissions) {
    this.contextSubmissions = submissions || [];
  }

  clearContext() {
    this.contextSubmissions = [];
  }

  /**
   * Generate AI draft for a target submission using the stored context
   * @param {Object} targetSubmission - The target submission object
   * @returns {Promise} Promise that resolves to the AI response
   */
  async generateDraft(targetSubmission) {
    const targetId = targetSubmission.get('id');

    // Extract IDs from context submissions, excluding the target
    const contextIds = this.contextSubmissions
      .filter((sub) => sub.get('id') !== targetId)
      .map((sub) => sub.get('id'));

    const url = `/api/aiDraft?target=${encodeURIComponent(
      targetId
    )}&context=${contextIds.join(',')}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return response.json();
  }
}
