/**
 * @howto: ImportRequest properties should be the same as `cache` options
 * @see [Cache Module](./datasource/api/cache.js)
 */
import Model, { attr } from '@ember-data/model';
import Auditable from './auditable';
export default class ImportRequestModel extends Model(Auditable) {
  @attr('string') teacher;
  @attr('string') submitter;
  @attr('number') publication;
  @attr('number') puzzle;
  @attr('raw') submissions;
  @attr('string') collection;
  @attr('string') folders;

  /*jshint camelcase: false */
  @attr('number') class_id;
  @attr('number') since_date;
  @attr('number') max_date;
  @attr('number') since_id;
  @attr('number') max_id;

  @attr('raw') results; // Used to return the result of the request
}
