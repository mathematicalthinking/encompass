/**
  * # Responses Controller
  * @description The controller for listing responses. 
  * @author Amir Tahvildaran <amir@mathforum.org>
  * @since 1.0.3 
  */ 
Encompass.ResponsesIndexController = Ember.Controller.extend({ 
  sortProperties: ['createDate'],
  sortAscending: false
});
