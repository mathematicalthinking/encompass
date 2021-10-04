import { helper as buildHelper } from '@ember/component/helper';






export default buildHelper(function (params) {
  var number = params[0];
  var singular = params[1];
  var plural = params[2];

  if (number === 1) {
    return singular;
  } else {
    return (typeof plural === 'string' ? plural : singular + 's');
  }
});

//Ember.Handlebars.registerBoundHelper('pluralCount', function(number, singular, plural) {
//  return number+' '+Ember.Handlebars.helpers.pluralize.apply(this, arguments);
//});
