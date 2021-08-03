/*global _:false */
import { helper as buildHelper } from '@ember/component/helper';






export default buildHelper(function (args) {
  let [val] = args;

  let hash = {
    viewOnly: 'This user will be able to see the workspace, but not add or make any changes',
    editor: 'This user can add, delete or modify selections, comments, and folders, but they will not be able to see or create new responses',
    indirectMentor: 'This user can create selections, comments, and folders. They can also send feedback that will be delivered once approved by a designated feedback approver',
    directMentor: 'This user can create selections, comments, and folders. They can also send direct feedback that does not require approval',
    approver: 'This user can add, delete or modify selections, comments, and folders. They can directly send their own feedback and approve feedback created by other users',
  };

  return hash[val] || '';
});
