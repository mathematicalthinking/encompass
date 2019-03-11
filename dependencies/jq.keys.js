$(document).keydown(function(e){
  if(!($(e.target).is('textarea') || $(e.target).is('input'))) {
    if(e.keyCode === 37) {
      $('#leftArrow').click();
    }
    if(e.keyCode === 39) {
      $('#rightArrow').click();
    }
  }
  return true;
});
