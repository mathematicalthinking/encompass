// Ember.verticalSizing = function() {
//   $(window).unbind("resize.windowresize");
//   $('body,html').css('overflow-y','hidden');
//   var w = $(window).height();
//   $('.al_vertical_stretch:visible').each(function() {
//     var p = parseInt($(this).css('padding-top').split('px')[0], 10) + parseInt($(this).css('padding-bottom').split('px')[0], 10);
//     var m = parseInt($(this).css('margin-top').split('px')[0], 10) + parseInt($(this).css('margin-bottom').split('px')[0], 10);
//     var b = parseInt($(this).css('border-top-width').split('px')[0], 10) + parseInt($(this).css('border-bottom-width').split('px')[0], 10);
//     var o = $(this).offset().top;
//     var h = w-(o+p+m+b);
//     $(this).css({
//       'height': h,
//       'overflow': 'auto'
//     });
//   });
//   $('body,html').css('overflow-y','auto');
//   $(window).bind("resize.windowresize", function(){
//     Ember.verticalSizing();
//   });
// };
