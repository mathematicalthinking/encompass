import { helper as buildHelper } from '@ember/component/helper';






export default buildHelper(function (setting) {
  if (setting[0] === "M") {
    return 'Just Me';
  } else if (setting[0] === "O") {
    return 'My Organization';
  } else if (setting[0] === "E") {
    return 'Everyone';
  } else {
    return 'Undefined';
  }

});

