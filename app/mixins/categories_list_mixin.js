import { alias } from '@ember/object/computed';
import { inject as controller } from '@ember/controller';
import Mixin from '@ember/object/mixin';






export default Mixin.create({
  application: controller(),
  selectedCategories: alias('application.selectedCategories'),
});
