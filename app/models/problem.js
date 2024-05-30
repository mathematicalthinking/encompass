import { attr, belongsTo, hasMany } from '@ember-data/model';
import Auditable from './auditable';
export default class ProblemModel extends Auditable {
  get problemId() {
    return this.id;
  }
  @attr('string') title;
  @attr('number') puzzleId;
  @attr('string') text;
  @attr('string') imageUrl;
  @attr('string') sourceUrl;
  @belongsTo('image', { inverse: null }) image;
  @belongsTo('problem', { inverse: null }) origin;
  @belongsTo('user', { inverse: null }) modifiedBy;
  @belongsTo('organization', { inverse: null }) organization;
  @attr('string') additionalInfo;
  @attr('string') privacySetting;
  @hasMany('category', { inverse: null }) categories;
  @attr keywords;
  @attr('string') copyrightNotice;
  @attr('string') sharingAuth;
  @attr('string') author;
  @attr('string') error;
  @attr('boolean') isUsed;
  @attr('string') status;
  @attr flagReason;
  @attr('boolean', { defaultValue: false }) isForEdit;
  @attr('boolean', { defaultValue: false }) isForAssignment;
  @attr contexts;
}
