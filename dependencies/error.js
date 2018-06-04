function errorHandler(error) {
  console.error('an error occured: ' + JSON.stringify(error) );
  Ember.$.post('/api/errors', {
    error: error,
    stack: error.stack,
    message: error.message,
    arguments: arguments
  });

  //var errorMsg = 'There was an error.  We recommend reloading the page to ensure your data has been saved and to prevent further errors';
  var errorMsg = error;

  window.alert(errorMsg);
};

if(Ember) {
  Ember.onerror = errorHandler;
}

window.onerror = errorHandler;
