import { helper as buildHelper } from '@ember/component/helper';






export default buildHelper(function (args) {
  // args is array of arguments passed in from template
  let [bytes] = args;

  if (typeof bytes !== 'number') {
    return null;
  }

  if (bytes < 1024) {
    return bytes + ' bytes';
  } else if (bytes >= 1024 && bytes < 1048576) {
    return (bytes / 1024).toFixed(1) + 'KB';
  } else if (bytes >= 1048576) {
    return (bytes / 1048576).toFixed(1) + 'MB';
  }

});
