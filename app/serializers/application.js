import RESTSerializer from '@ember-data/serializer/rest';

export default RESTSerializer.extend({
    primaryKey: "_id", // Fix for Ember to recognise Mongoose object ids
    isNewSerializerAPI: true
});
