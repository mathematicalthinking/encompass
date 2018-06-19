// import Ember from 'ember';

// export default Ember.Component.extend({

    Encompass.ResponsesComponent = Ember.Component.extend({
        tagName: 'responses',
        classNameBindings: ['isSmallHeader:small', 'isHidden:hide'],
        elementId: 'al_header',
        isSmallHeader: false,
        isHidden: false,
      
        actions: {
          largeHeader: function () {
            this.set('isSmallHeader', false)
          },
          smallHeader: function () {
            this.set('isSmallHeader', true)
          }
        }
      })