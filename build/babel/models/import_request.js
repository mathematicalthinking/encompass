'use strict';

/**
  * @howto: ImportRequest properties should be the same as `cache` options
  * @see [Cache Module](./datasource/api/cache.js)
  */
Encompass.ImportRequest = DS.Model.extend(Encompass.Auditable, {
  teacher: DS.attr('string'),
  submitter: DS.attr('string'),
  publication: DS.attr('number'),
  puzzle: DS.attr('number'),
  submissions: DS.attr('raw'),
  collection: DS.attr('string'),
  folders: DS.attr('string'),

  /*jshint camelcase: false */
  class_id: DS.attr('number'),
  since_date: DS.attr('number'),
  max_date: DS.attr('number'),
  since_id: DS.attr('number'),
  max_id: DS.attr('number'),

  results: DS.attr('raw') // Used to return the result of the request
});
//# sourceMappingURL=import_request.js.map
