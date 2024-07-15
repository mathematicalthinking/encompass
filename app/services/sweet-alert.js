import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default class SweetAlertService extends Service {
  @service currentUser;

  title = null;
  type = null;
  toast = true;
  position = null;
  timer = null;
  showConfirmButton = null;
  backgroundColor = null;
  successColor = '#CBFDCB';
  errorColor = '#ffe0e0';
  warningColor = '#ffcd94';
  infoColor = '#afeeee';

  setBackgroundColor(type) {
    switch (type) {
      case 'success':
        this.backgroundColor = this.successColor;
        break;
      case 'error':
        this.backgroundColor = this.errorColor;
        break;
      case 'warning':
        this.backgroundColor = this.warningColor;
        break;
      case 'info':
        this.backgroundColor = this.infoColor;
        break;
      default:
        this.backgroundColor = '#fff';
        break;
    }
  }

  showToast(
    type = 'success',
    title = 'Updated Successfully',
    position = 'bottom-end',
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
  }

  showModal(type, title, text, confirmText, cancelText = 'Cancel') {
    return window.swal({
      type: type,
      title: title,
      text: text,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
    });
  }

  showPrompt(input, title, text, confirmButtonText) {
    return window.swal({
      input: input,
      title: title,
      text: text,
      confirmButtonText: confirmButtonText,
      showCancelButton: true,
    });
  }

  showPromptSelect(
    title,
    inputOptions,
    inputPlaceholder,
    text = null,
    confirmButtonText = 'OK'
  ) {
    return window.swal({
      input: 'select',
      title,
      inputPlaceholder,
      inputOptions,
      showCancelButton: true,
      inputValidator: (value) => {
        return !value && 'Please choose an option.';
      },
      text,
      confirmButtonText,
    });
  }
}
