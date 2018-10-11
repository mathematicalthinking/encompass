Encompass.ErrorBoxComponent = Ember.Component.extend({
  classNames: ['error-box', 'required', 'animated', 'fadeIn'],

  actions: {
    closeError: function() {
      let id = this.elementId;
      $(`#${id}`).removeClass('fadeIn');
      $(`#${id}`).addClass('fadeOut');
      Ember.run.later(() => {
        $(`#${id}`).remove();
      }, 500);
    }
  }
});