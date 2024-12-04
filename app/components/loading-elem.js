import Component from '@glimmer/component';

export default class LoadingElemComponent extends Component {
  defaultMessage = 'Request in progress. Thank you for your patience!';

  get loadingText() {
    return this.args.loadingMessage || this.defaultMessage;
  }
}
