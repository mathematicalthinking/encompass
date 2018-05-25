$(document).keydown(function(e){
  if(!($(e.target).is('textarea') || $(e.target).is('input'))) {
    console.debug('arrow key nav');
    if(e.keyCode === 37) {
      $('#leftArrow').click();
    }
    if(e.keyCode === 39) {
      $('#rightArrow').click();
    }
  }
  return true;
});
