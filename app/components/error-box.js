Encompass.ErrorBoxComponent = Ember.Component.extend({
  classNames: ['error-box', 'required', 'animated', 'fadeIn'],

  actions: {
    closeError: function() {
      let id = this.elementId;
      $(`#${id}`).removeClass('fadeIn');
      $(`#${id}`).addClass('fadeOut');

      if (this.get('resetError')) {
        this.get('resetError')();
      }

      Ember.run.later(() => {
        $(`#${id}`).remove();
      }, 500);
    }
  },

});