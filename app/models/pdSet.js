import Model, { attr } from '@ember-data/model';

export default class PdSetModel extends Model {
  @attr('number') count;
  get label() {
    return this.id + ' (' + this.count + ' submissions)';
  }
}
