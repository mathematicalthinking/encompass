import RESTAdapter from '@ember-data/adapter/rest';

export default class ApplicationAdapter extends RESTAdapter {
  namespace = 'api';
  coalesceFindRequests = true;

  headers = {
    'Accept-Version': '*',
  };
}
