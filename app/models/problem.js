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
  @belongsTo('image', { inverse: null, async: true }) image;
  @belongsTo('problem', { inverse: null, async: true }) origin;
  @belongsTo('user', { inverse: null, async: true }) modifiedBy;
  @belongsTo('organization', { inverse: null, async: true }) organization;
  @attr('string') additionalInfo;
  @attr('string') privacySetting;
  @hasMany('category', { inverse: null, async: true }) categories;
  @attr keywords; // an array of strings
  @attr('string') copyrightNotice;
  @attr('string') sharingAuth;
  @attr('string') author;
  @attr('string') error;
  @attr('boolean') isUsed; // indicates if a problem has associated answers
  @attr('string') status;
  @attr flagReason;
  @attr contexts;
}
