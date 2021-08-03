import Model, { attr, belongsTo } from '@ember-data/model';
import Auditable from '../models/_auditable_mixin';


export default Model.extend(Auditable, {
  pdSetName: attr('string'),
  folderSetName: attr('string'),
  result: belongsTo('workspace')
});
