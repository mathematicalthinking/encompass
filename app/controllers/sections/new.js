import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class SectionsNewController extends Controller {
  queryParams = [
    'returnTo',
    'returnStep',
    'importProblemId',
    'importSectionId',
    'importUseClass',
  ];

  @tracked returnTo = null;
  @tracked returnStep = null;
  @tracked importProblemId = null;
  @tracked importSectionId = null;
  @tracked importUseClass = null;
}
