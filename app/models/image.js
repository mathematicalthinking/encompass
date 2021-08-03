import Model, { attr } from '@ember-data/model';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import Auditable from '../models/_auditable_mixin';

export default Model.extend(Auditable, {
  imageId: alias('id'),
  encoding: attr('string'),
  mimetype: attr('string'),
  imageData: attr('string'),
  sourceUrl: attr('string'),
  originalname: attr('string'),
  pdfPageNum: attr('number'),

  pdfFileDisplay: computed('pdfPageNum', function () {}),

  fileNameDisplay: computed('originalname', 'pdfPageNum', function () {
    let num = this.pdfPageNum;
    if (typeof num === 'number') {
      return `${this.originalname} (pg. ${num})`;
    }

    return this.originalname;
  }),
});
