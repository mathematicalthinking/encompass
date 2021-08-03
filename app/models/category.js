import Model, { attr } from '@ember-data/model';
import Auditable from '../models/_auditable_mixin';


export default Model.extend(Auditable, {
  identifier: attr('string'),
  description: attr('string'),
  url: attr('string'),
});
