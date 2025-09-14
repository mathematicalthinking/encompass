import Route from '@ember/routing/route';

export default class LoginRoute extends Route {
  // Makes ?oauthError=... a first-class query param
  queryParams = { oauthError: { refreshModel: true } };

  model(_params, transition) {
    return {
      oauthError: transition?.to?.queryParams?.oauthError ?? null,
    };
  }
}
