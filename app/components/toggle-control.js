Encompass.ToggleControlComponent = Ember.Component.extend({
  classNames: [],
  currentValue: null,

  iconClass: function() {
    let isActive = this.get('isActive');
    let options = this.get('options');
    if (!isActive) {
      return options[0].icon;
    }
    return this.get('currentValue.icon');

  }.property('isActive', 'currentValue', 'currentState'),

  didReceiveAttrs() {
    if (this.classToAdd) {
      this.set('classNames',[this.classToAdd]);
    }
    let activeType = this.activeType;
    let isActive = activeType === this.type;
    this.set('isActive', isActive);

    if (!_.isUndefined(this.initialState) && _.isUndefined(this.get('currentToggleState'))) {
      let options = this.get('options');
      this.set('currentToggleState', this.initialState);
      this.set('currentValue', options[this.initialState]);
    }

    this._super(...arguments);
  },

  actions: {
    onToggle() {
      let currentState = this.get('currentToggleState');
      let newState;
      let newVal;
      let options = this.get('options');

      if (currentState === 0) {
       newState = 1;
      }else if (currentState === 1) {
        newState = 2;
      }
      else if (currentState === 2) {
        newState = 1;
      }

      newVal = options[newState];
      this.set('currentValue', newVal);
      this.set('currentToggleState', newState);


      if (this.get('onUpdate')) {
        this.get('onUpdate')(newVal);
      }
    }
  }
});