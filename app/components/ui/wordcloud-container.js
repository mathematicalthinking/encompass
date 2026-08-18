import Component from '@glimmer/component';
import WordCloud from 'wordcloud';
import { action } from '@ember/object';

export default class WordcloudContainerComponent extends Component {
  @action
  generate() {
    const options = {
      list: this.args.list,
      backgroundColor: '#ffe0e0',
      weightFactor: function (size) {
        return size * 10;
      },
      shrinkToFit: true,
    };
    WordCloud('wordcloud', options);
  }
}
