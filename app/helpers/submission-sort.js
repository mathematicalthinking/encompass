// app/helpers/submission-sort.js

import { helper } from '@ember/component/helper';

export default helper(function submissionSort([submissions]) {
  // Convert Ember array to JavaScript array
  const submissionsArray = submissions.toArray();

  // Sort submissions alphabetically by student name
  const sortedSubmissions = [...submissionsArray].sort(
    (submission1, submission2) => {
      const username1 = submission1.get('createdBy.username') || '';
      const username2 = submission2.get('createdBy.username') || '';
      return username1.localeCompare(username2);
    }
  );

  return sortedSubmissions;
});
// Mentor replies should be collapsed, including student submissions. Should be expanded upon if user requests so.
// Should be able to show maybe student name, data submitted as preview. Then expand to show full submission.
// Should be able to show mentor reply as preview, then expand to show full reply.
// Only include the most recent submission, mentor reply. If they need the oldest submission, or other ones,
// they can go to the view all responses page or include a link to take them to the responses page.
// REMEMBER TO FIX DATES.
