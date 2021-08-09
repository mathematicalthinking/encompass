import { attr } from '@ember-data/model';
import Auditable from './auditable';
export default class ImageModel extends Auditable {
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
