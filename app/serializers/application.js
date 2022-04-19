import RESTSerializer from '@ember-data/serializer/rest';
// The serializer is a ember formatter that can help format data from the mongo/mongoose backend.
export default class ApplicationSerializer extends RESTSerializer {
  primaryKey = '_id'; // Fix for Ember to recognise Mongoose object ids
  isNewSerializerAPI = true;
}
