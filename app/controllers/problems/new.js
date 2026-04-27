import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class ProblemsNewController extends Controller {
  queryParams = [
    'returnTo',
    'importProblemId',
    'importSectionId',
    'importUseClass',
  ];

  @tracked returnTo = null;
  @tracked importProblemId = null;
  @tracked importSectionId = null;
  @tracked importUseClass = null;
}
