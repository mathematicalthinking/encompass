import RESTAdapter from '@ember-data/adapter/rest';

export default class ApplicationAdapter extends RESTAdapter {
  namespace = 'api';
  coalesceFindRequests = true;
  headers = {
    'Accept-Version': '*',
    'Access-Control-Allow-Origin': '*',
  };
  // host = 'http://localhost:8080';
  useFetch = false;
  ajaxOptions(url, type, _options) {
    let options = Object.assign(
      {
        // credentials: 'include',
        // xhrFields: {
        //   withCredentials: true,
        // },
        // crossDomain: true,
      },
      _options
    );

    return super.ajaxOptions(url, type, options);
  }
}
