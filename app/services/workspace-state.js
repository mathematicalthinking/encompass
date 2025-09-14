import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class WorkspaceStateService extends Service {
  @tracked currentSelection = null;
}
