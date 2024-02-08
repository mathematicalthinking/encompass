import { helper } from '@ember/component/helper';

export function isReplyDraft([mentorReply]) {
  return mentorReply && mentorReply.status === 'draft';
}

export default helper(isReplyDraft);
