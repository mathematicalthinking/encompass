import Component from '@ember/component';
import CurrentUserMixin from '../mixins/current_user_mixin';






export default Component.extend(CurrentUserMixin, {
  elementId: 'workspace-container',
});