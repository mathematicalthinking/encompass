import Controller from '@ember/controller';
import CurrentUserMixin from "../mixins/current_user_mixin";

export default Controller.extend(CurrentUserMixin, {
  isCompDirty: false,
  confirmLeaving: false,

  actions: {
    doConfirmLeaving: function (value) {
      this.set("confirmLeaving", value);
    },
  },
});
