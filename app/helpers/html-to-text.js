Encompass.HtmlToTextHelper = Ember.Helper.helper(function(text){
  let container = document.createElement('div');
  container.innerHTML = text;
  return container;
});