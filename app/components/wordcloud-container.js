Encompass.WordcloudContainerComponent = Ember.Component.extend({
  didUpdateAttrs(){
    this._super(...arguments);
    const options = {
      list: this.get('list'),
      backgroundColor: '#ffe0e0',
      weightFactor: function(size){
        return size * 10;
      },
      shrinkToFit: true,
    };
    // eslint-disable-next-line no-undef
    WordCloud(document.querySelector('.wordcloud'), options);
  }
});