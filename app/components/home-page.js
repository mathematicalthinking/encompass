Encompass.HomePageComponent = Ember.Component.extend({
  elementId: 'homepage',
  className: ['homepage', 'index'],

  showToggleModal: function () {
    this.get('alert').showModal('question', 'Are you sure you want to switch roles?', 'If you are currently modifying or creating a new record, you will lose all unsaved progress', 'Ok')
    .then((result) => {
      if (result.value) {
        this.send('toggleActingRole');
      }
    });
  },

  toggleActingRole: function() {
    // should this action be moved to the application controller?
    const currentUser = this.get('currentUser');

    // student account types cannot toggle to teacher role
    if (currentUser.get('accountType') === 'S') {
      return;
    }
    const actingRole = currentUser.get('actingRole');
    if (actingRole === 'teacher') {
      currentUser.set('actingRole', 'student');
    } else {
      currentUser.set('actingRole', 'teacher');
    }
    currentUser.save().then(() => {
      this.set('actionToConfirm', null);
      this.store.unloadAll('assignment');
      this.sendAction('toHome');
      this.get('alert').showToast('success', 'Successfully switched roles', 'bottom-end', 2500, false, null);
    }).catch((err) => {
      // handle error
      this.handleErrors(err, 'toggleRoleErrors', currentUser);
      this.set('isToggleError', true);
      // send error up to application level to handle?
    });
  }
});
