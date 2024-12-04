import { htmlSafe } from '@ember/template';

export default function (setting) {
  const globeSettings = ['O', 'E', 'public', 'org'];
  const unlockSettings = ['M', 'private'];

  if (globeSettings.includes(setting)) {
    return htmlSafe('<i class="fas fa-globe-americas"></i>');
  } else if (unlockSettings.includes(setting)) {
    return htmlSafe('<i class="fas fa-unlock"></i>');
  } else {
    return htmlSafe('<i class="fa fa-question"></i>');
  }
}
