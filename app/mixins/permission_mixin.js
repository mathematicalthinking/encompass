import { attr, belongsTo, hasMany } from '@ember-data/model';
import Mixin from '@ember/object/mixin';






export default Mixin.create({
  mode: attr('string'),
  owner: belongsTo('user', { async: true }),
  editors: hasMany('user', { async: true })
});
