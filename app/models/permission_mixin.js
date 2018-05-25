Encompass.Permission = Ember.Mixin.create({
  mode: DS.attr('string'),
  owner: DS.belongsTo('user', {async: true}),
  editors: DS.hasMany('user', {async: true})
});
