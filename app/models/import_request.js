/**
  * @howto: ImportRequest properties should be the same as `cache` options
  * @see [Cache Module](./datasource/api/cache.js)
  */
import Model, { attr } from '@ember-data/model';
import Auditable from '../models/_auditable_mixin';


export default Model.extend(Auditable, {
  teacher: attr('string'),
  submitter: attr('string'),
  publication: attr('number'),
  puzzle: attr('number'),
  submissions: attr('raw'),
  collection: attr('string'),
  folders: attr('string'),

  /*jshint camelcase: false */
  class_id: attr('number'),
  since_date: attr('number'),
  max_date: attr('number'),
  since_id: attr('number'),
  max_id: attr('number'),

  results: attr('raw'), // Used to return the result of the request
});
