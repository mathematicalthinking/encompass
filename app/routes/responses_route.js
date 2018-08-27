Encompass.ResponsesRoute = Encompass.AuthenticatedRoute.extend({

  model: function(){
    var responses = this.get('store').findAll('response');
    return responses;
    // var route = this;
    // var promise = new Ember.RSVP.Promise(function(resolve, reject) {
    //   route.store.findAll('response').then( function(responses){
    //     var filteredResponses = responses.filterBy( 'persisted', true );
    //     resolve( filteredResponses );
    //   });
    // });

    // return promise;
  }
});


