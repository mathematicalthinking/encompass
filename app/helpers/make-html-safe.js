import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/template';

export default helper(function makeHtmlSafe(string) {
  return htmlSafe(string);
});
