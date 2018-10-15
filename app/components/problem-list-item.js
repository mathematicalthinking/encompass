Encompass.ProblemListItemComponent = Ember.Component.extend({
  classNames: ['problem-list-item'],
  classNameBindings: ['isPublic', 'isPrivate', 'isOrg', 'isPows'],
  privacySetting: Ember.computed.alias('problem.privacySetting'),
  puzzleId: Ember.computed.alias('problem.puzzleId'),

  isPublic: function() {
    return this.get('privacySetting') === 'E';
  }.property('problem.privacySetting'),

  isOrg: function() {
    return this.get('privacySetting') === 'O';
  }.property('problem.privacySetting'),

  isPrivate: function() {
    return this.get('privacySetting') === 'M';
  }.property('problem.privacySetting'),

  isPows: function() {
    return this.get('puzzleId') !== null && this.get('puzzleId') !== undefined;
  }.property('problem.puzzleId')

});