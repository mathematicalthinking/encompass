import Component from '@ember/component';
import { computed } from '@ember/object';
/*global _:false */
import { equal } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import CurrentUserMixin from '../mixins/current_user_mixin';

export default Component.extend(CurrentUserMixin, {
  elementId: 'import-work-step2',
  utils: service('utility-methods'),
  selectingClass: equal('selectedValue', true),

  useClass: {
    groupName: 'useClass',
    required: true,
    inputs: [
      {
        value: true,
        label: 'Yes',
      },
      {
        value: false,
        label: 'No',
      },
    ],
  },

  willDestroyElement: function () {
    this.set('selectedValue', this.selectedValue);
  },

  initialSectionItem: computed('selectedSection', function () {
    const selectedSection = this.selectedSection;
    if (this.utils.isNonEmptyObject(selectedSection)) {
      return [selectedSection.id];
    }
    return [];
  }),

  actions: {
    setSelectedSection(val, $item) {
      if (!val) {
        return;
      }

      const isRemoval = _.isNull($item);
      if (isRemoval) {
        this.set('selectedSection', null);
        return;
      }

      const section = this.store.peekRecord('section', val);
      if (this.utils.isNullOrUndefined(section)) {
        return;
      }

      this.set('selectedSection', section);
      if (this.missingSection) {
        this.set('missingSection', null);
      }
    },
    next() {
      const selectedValue = this.selectedValue;
      if (!selectedValue) {
        this.set('selectedSection', null);
      }
      const section = this.selectedSection;
      if (this.utils.isNonEmptyObject(section) || !selectedValue) {
        this.onProceed();
        return;
      }
      this.set('missingSection', true);
    },
    back() {
      this.onBack(-1);
    },
  },
});
