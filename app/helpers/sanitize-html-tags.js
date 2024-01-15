// app/helpers/sanitize-html-tags.js

import { helper } from '@ember/component/helper';

export default helper(function sanitizeHtmlTags([explanation]) {
  if (explanation) {
    return explanation.replace(
      /<\/?([a-z][a-z0-9]*)(?:[^>]*(\s=\s*"[^"]*"))?>/gi,
      ''
    );
  } else {
    return explanation;
  }
});
