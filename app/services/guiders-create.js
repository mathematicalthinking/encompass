import Service from '@ember/service';







export default Service.extend({
  /*
    attachTo: (optional) selector of the html element you want to attach the guider to
    autoFocus: (optional) if you want the browser to scroll to the position of the guider, set this to true
    buttons: array of button objects
      {
        name: "Close",
        classString: "primary-button",
        onclick: callback function for when the button is clicked
          (if name is "close", "next", or "back", onclick defaults to guiders.hideAll, guiders.next, or guiders.prev respectively)
      }
    buttonCustomHTML: (optional) custom HTML that gets appended to the buttons div
    classString: (optional) custom class name that the guider should additionally have
    closeOnEscape: (optional) if true, the escape key will close the currently open guider
    description: text description that shows up inside the guider
    highlight: (optional) selector of the html element you want to highlight (will cause element to be above the overlay)
    isHashable: (defaults to true) the guider will be shown auto-shown when a page is loaded with a url hash parameter #guider=guider_name
    offset: fine tune the position of the guider, e.g. { left:0, top: -10 }
    onClose: (optional) additional function to call if a guider is closed by the x button, close button, or escape key
    onHide: (optional) additional function to call when the guider is hidden
    onShow: (optional) additional function to call before the guider is shown
    overlay: (optional) if true, an overlay will pop up between the guider and the rest of the page
    position: (optional / required if using attachTo) clock position at which the guider should be attached to the html element. Can also use a description keyword (such as "topLeft" for 11 or "bottom" for 6)
    shouldSkip: (optional) if this function evaluates to true, the guider will be skipped
    title: title of the guider
    width: (optional) custom width of the guider (it defaults to 400px)
    xButton: (optional) if true, a X will appear in the top right corner of the guider, as another way to close the guider
  */

  createGuider: function (id, next, title, description, attachTo, highlight, position, buttons, overlay, width, onClose) {
    return window.guiders.createGuider({
      id,
      next,
      title,
      description,
      attachTo,
      highlight,
      position,
      buttons,
      overlay,
      width,
      onClose,
      xButton: true,
      closeOnEscape: true,
      autoFocus: true,
      classString: 'guide-item',
    });
  },

});
