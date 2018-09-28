Encompass.SweetAlertService = Ember.Service.extend({
  title: null,
  type: null,
  toast: true,
  position: null,
  timer: null,
  showConfirmButton: null,
  backgroundColor: null,
  successColor: '#CBFDCB',
  errorColor: 'ffe0e0',
  warningColor: 'ffcd94',
  infoColor: '#afeeee',

  setBackgroundColor: function(type) {
    switch (type) {
      case 'success':
        this.set('backgroundColor', this.get('successColor'));
        break;
      case 'error':
        this.set('backgroundColor', this.get('errorColor'));
        break;
      case 'warning':
        this.set('backgroundColor', this.get('warningColor'));
        break;
      case 'info':
        this.set('backgroundColor', this.get('infoColor'));
        break;
      default:
        this.set('backgroundColor', '#fff');
        break;
    }
  },

  showToast: function(type="success", title="Updated Successfully", position='bottom-end', timer=4000, showConfirmButton=false) {
    this.setBackgroundColor();
    return window.swal({
      title: title,
      position: position,
      timer: timer,
      toast: true,
      type: type,
      background: this.get('backgroundColor'),
      showConfirmButton: showConfirmButton,
    });
  },

  showModal: function(type, title, position='bottom-end', timer=4000, showConfirmButton=false) {
    this.setBackgroundColor();
    return window.swal({
      title: title,
      position: position,
      timer: timer,
      type: type,
      background: this.get('backgroundColor'),
      showConfirmButton: showConfirmButton,
    });
  }

});
