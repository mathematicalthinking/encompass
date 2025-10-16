import Service from '@ember/service';

export default class QuillUtilsService extends Service {
  defaultMaxLength = 14680064; // 14MB

  returnSizeDisplay(bytes) {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / 1048576).toFixed(1)}MB`;
  }

  formatTooLongErrorMsg(actualLength, maxLength) {
    const maxSizeDisplay = this.returnSizeDisplay(maxLength);
    const actualSizeDisplay = this.returnSizeDisplay(actualLength);
    return `The total size of your response (${actualSizeDisplay}) exceeds the maximum limit of ${maxSizeDisplay}. Please remove or resize any large images and try again.`;
  }

  isQuillContentEmpty(quillInstance) {
    if (!quillInstance) return true;
    const text = quillInstance.getText().trim();
    if (text.length > 0) return false;
    const content = quillInstance.root.innerHTML;
    return !content.includes('<img');
  }

  validateQuillContent(content, maxLength) {
    const isEmpty = !content || content.trim().length === 0;
    const isOverLimit = content && content.length > maxLength;
    return { isEmpty, isOverLimit };
  }

  isOldFormatText(text) {
    if (!text) return false;
    const parsed = new DOMParser().parseFromString(text, 'text/html');
    return !Array.from(parsed.body.childNodes).some(
      (node) => node.nodeType === 1
    );
  }
}
