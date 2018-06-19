// import Ember from 'ember';

// export default Ember.Component.extend({

Encompass.ProblemsComponent = Ember.Component.extend({
  tagName: 'problems',
  classNameBindings: ['isSmallHeader:small', 'isHidden:hide'],

  // init() {
  //   this._super(...arguments);
  //   this.get('problems')('').then((allResults) => this.set('results', allResults.results));
  // },

  init () {
    this._super(...arguments)
    console.log('this is init')
  },

  //this.get('problems') used to get array of objects
  didReceiveAttrs () {
    this._super(...arguments)
    console.log('did receive atts', this.get('problems'))
  },

  willRender () {
    this._super(...arguments)
    console.log('will render')
  },

  didInsertElement () {
    this._super(...arguments)
    console.log('did insert element')
  },

  didRender () {
    this._super(...arguments)
    console.log('did render')
  }
})
