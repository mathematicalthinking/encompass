function ajaxCounter(name) {
  if(!window[name]) {
    window[name] = 0;
  }
  window[name]++;
}

$(document).ajaxStart(function() {
  $("#loading").show();
  // console.log('loading');
  window.ajaxBatchRequestCount = 0;
});

$(document).ajaxStop(function() {
  $("#loading").hide();
  // console.log('done loading');
<<<<<<< HEAD
  if(/http:\/\/localhost/.test(window.location.href)){
    $('#devTool').text(window.ajaxBatchRequestCount + 
        ' requests made, total: ' + 
        window.ajaxWindowRequestCount +
        Array(window.ajaxBatchRequestCount).join("!"));
  }
=======
  // if(/http:\/\/localhost/.test(window.location.href)){
  //   $('#devTool').text(window.ajaxBatchRequestCount + 
  //       ' requests made, total: ' + 
  //       window.ajaxWindowRequestCount +
  //       Array(window.ajaxBatchRequestCount).join("!"));
  // }
>>>>>>> 5f3278653fbbe12e3562e5187f3e5e0b9b21be35
});

$(document).ajaxSuccess(function() {
  ajaxCounter('ajaxWindowRequestCount');
  ajaxCounter('ajaxBatchRequestCount');
});

$(document).ajaxError(function(e, xhr, settings, errorText){
  var standardUrl = (settings.url != '/api/errors');
  var cannotConnect = (xhr.status === 0);
  var serverError = (xhr.status >= 500);
  if(standardUrl && (cannotConnect || serverError)) { 
    ajaxCounter('ajaxErrorCount'); 
    if(window.ajaxErrorCount > 3) {
      console.error('not continuing to log errors to the server');
      return;
    }
    var error = {
      type: 'ajax',
      message: xhr.responseText,
      status: xhr.status,
    }
    $.post('/api/errors', error).always(function(){
      window.alert(err);
    });
  }
});
