import Model, { attr } from '@ember-data/model';
import Auditable from '../models/_auditable_mixin';

export default class ImageModel extends Model.extend(Auditable) {
  get imageId() {
    return this.id;
  }
  @attr('string') encoding;
  @attr('string') mimetype;
  @attr('string') imageData;
  @attr('string') sourceUrl;
  @attr('string') originalname;
  @attr('number') pdfPageNum;

  @attr pdfFileDisplay;
  get fileNameDisplay() {
    let num = this.pdfPageNum;
    if (typeof num === 'number') {
      return `${this.originalname} (pg. ${num})`;
    }

    return this.originalname;
  }
}
