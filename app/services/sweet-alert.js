import Service from '@ember/service';

export default Service.extend({
  title: null,
  type: null,
  toast: true,
  position: null,
  timer: null,
  showConfirmButton: null,
  backgroundColor: null,
  successColor: "#CBFDCB",
  errorColor: "#ffe0e0",
  warningColor: "#ffcd94",
  infoColor: "#afeeee",

  setBackgroundColor: function (type) {
    switch (type) {
      case "success":
        this.set("backgroundColor", this.successColor);
        break;
      case "error":
        this.set("backgroundColor", this.errorColor);
        break;
      case "warning":
        this.set("backgroundColor", this.warningColor);
        break;
      case "info":
        this.set("backgroundColor", this.infoColor);
        break;
      default:
        this.set("backgroundColor", "#fff");
        break;
    }
  },

  showToast: function (
    type = "success",
    title = "Updated Successfully",
    position = "bottom-end",
    timer = 4000,
    showConfirmButton = false,
    confirmButtonText = null
  ) {
    this.setBackgroundColor(type);
    return window.swal({
      type: type,
      title: title,
      position: position,
      timer: timer,
      toast: true,
      showConfirmButton: showConfirmButton,
      confirmButtonText: confirmButtonText,
      background: this.backgroundColor,
    });
  },

  showModal: function (type, title, text, confirmText, cancelText = "Cancel") {
    return window.swal({
      type: type,
      title: title,
      text: text,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
    });
  },

  showPrompt: function (input, title, text, confirmButtonText) {
    return window.swal({
      input: input,
      title: title,
      text: text,
      confirmButtonText: confirmButtonText,
      showCancelButton: true,
    });
  },

  showPromptSelect: function (
    title,
    inputOptions,
    inputPlaceholder,
    text = null,
    confirmButtonText = "OK"
  ) {
    return window.swal({
      input: "select",
      title,
      inputPlaceholder,
      inputOptions,
      showCancelButton: true,
      inputValidator: (value) => {
        return !value && "Please choose an option.";
      },
      text,
      confirmButtonText,
    });
  },
});
