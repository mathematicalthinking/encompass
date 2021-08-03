import { helper as buildHelper } from '@ember/component/helper';






export default buildHelper(function (setting) {
  if (setting[0] === "O" || setting[0] === "E" || setting[0] === "public" || setting[0] === "org") {
    return '<i class="fas fa-globe-americas"></i>';
  } else if (setting[0] === "M" || setting[0] === "private") {
    return '<i class="fas fa-unlock"></i>';
  } else {
    return '<i class="fa fa-question"></i>';
  }

});
