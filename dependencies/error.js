function errorHandler(error) {
  console.log('an error occured: ' + JSON.stringify(error) );
  Ember.$.post('/api/errors', {
    error: error,
    stack: error.stack,
    message: error.message,
    arguments: arguments
  });

<<<<<<< HEAD
  //var errorMsg = 'There was an error.  We recommend reloading the page to ensure your data has been saved and to prevent further errors';
=======
  // var errorMsg = 'There was an error.  We recommend reloading the page to ensure your data has been saved and to prevent further errors';
>>>>>>> 5f3278653fbbe12e3562e5187f3e5e0b9b21be35
  var errorMsg = error;

  window.alert(errorMsg);
};

if(Ember) {
  Ember.onerror = errorHandler;
}

window.onerror = errorHandler;
