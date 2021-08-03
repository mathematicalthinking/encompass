import { helper as buildHelper } from '@ember/component/helper';






export default buildHelper(function (val) {
  let text;
  val = val[0];
  switch (val) {
    case 0:
      text = 'Hidden';
      return text;
    case 1:
      text = 'View Only';
      return text;
    case 2:
      text = 'Create';
      return text;
    case 3:
      text = 'Add';
      return text;
    case 4:
      text = 'Delete';
      return text;
    case 'preAuth':
      text = 'Pre-Approved';
      return text;
    case 'none':
      text = 'None';
      return text;
    case 'authReq':
      text = 'Approval Required';
      return text;
    case 'approver':
      text = 'Approver';
      return text;
    case 'indirectMentor':
      text = 'Mentor';
      return text;
    case 'directMentor':
      text = 'Mentor with Direct Send';
      return text;
    case 'editor':
      text = 'Editor';
      return text;
    case 'viewOnly':
      text = "View Only";
      return text;
    case 'custom':
      text = "Custom";
      return text;
    default:
      text = "N/A";
      return text;
  }
});
