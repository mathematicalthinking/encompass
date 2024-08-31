import Service from '@ember/service';
import Swal from 'sweetalert2';

export default class SweetAlertService extends Service {
  successColor = '#CBFDCB';
  errorColor = '#ffe0e0';
  warningColor = '#ffcd94';
  infoColor = '#afeeee';

  setBackgroundColor(type) {
    switch (type) {
      case 'success':
        return this.successColor;
      case 'error':
        return this.errorColor;
      case 'warning':
        return this.warningColor;
      case 'info':
        return this.infoColor;
      default:
        return '#fff';
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
    const backgroundColor = this.setBackgroundColor(type);
    return Swal.fire({
      icon: type,
      title: title,
      position: position,
      timer: timer,
      toast: true,
      showConfirmButton: showConfirmButton,
      confirmButtonText: confirmButtonText,
      background: backgroundColor,
    });
  }

  showModal(type, title, text, confirmText, cancelText = 'Cancel') {
    return Swal.fire({
      icon: type,
      title: title,
      text: text,
      showCancelButton: cancelText !== null,
      showConfirmButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
    });
  }

  showPrompt(input, title, text, confirmButtonText) {
    return Swal.fire({
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
    return Swal.fire({
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
