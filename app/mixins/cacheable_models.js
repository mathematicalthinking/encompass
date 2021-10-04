/**
  * # Cacheable Models Mixin
  * @description adds a cache method to the DS.Store (when mixed in) that chooses
  *   between store.all() and store.find()
  *   this uses the meta sinceToken from the server response
  *   the server needs to send this (and should only send it for findAll operations)
  * @return {PromiseArray} wrapping either store.all (if cached) or store.find(model) (findAll)
  * @param {String} model - the model you are looking for (eg 'workspace')
  * @param {Object} options
    {
      expiration: 180, //max age in seconds of the last findAll, if greater, we'll update the store
      bypass: false    //ignore the cache, force a findAll
    }
  * does not cache zero results
  * @author Amir Tahvildaran <amir@mathforum.org>
  * @since 1.0.2
  */
/*global _:false */
import { Promise } from 'rsvp';

import Mixin from '@ember/object/mixin';
import DS from 'ember-data';


export default Mixin.create({
  since: function (model) {
    //var meta = model.get('meta');
    //var since = meta.sinceToken; //this.metadataFor(model).sinceToken;
    var since = this.metadataFor(model).sinceToken;
    return since;
  },
  cacheExpired: function (model, options) {
    var cacheExpired = false;
    var lastRetrieval = this.since(model);
    if (lastRetrieval) {
      lastRetrieval = new Date(lastRetrieval).getTime() / 1000; //seconds
      var now = new Date().getTime() / 1000;
      var diff = now - lastRetrieval;
      if (diff > options.expiration) {
        cacheExpired = true;
      }
    }
    return cacheExpired;
  },
  cache: function (model, options) {
    var defaults = {
      expiration: 180,
      bypass: false
    };
    if (!options) { options = {}; }
    _.defaults(options, defaults);

    var cached = this.peekAll('workspace');

    var cacheExpired = this.cacheExpired(model, options);
    var notCached = !this.since(model);

    if (notCached || cacheExpired || options.bypass) {
      return this.findAll(model);
    }

    return DS.PromiseArray.create({
      promise: new Promise(function (resolve, reject) {
        resolve(cached);
      })
    });
  }
});
