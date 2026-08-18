import RESTSerializer from '@ember-data/serializer/rest';

/**
 * ApplicationSerializer
 * Customizes the serialization for the application, ensuring compatibility with MongoDB/Mongoose by using `_id` as the primary key.
 */
export default class ApplicationSerializer extends RESTSerializer {
  primaryKey = '_id'; // Use Mongoose's _id as the primary key

  normalizeResponse(store, primaryModelClass, payload, id, requestType) {
    if (payload && typeof payload === 'object') {
      Object.keys(payload).forEach((key) => {
        const value = payload[key];
        if (Array.isArray(value)) {
          payload[key] = value.filter(Boolean);
        }
      });
    }
    return super.normalizeResponse(
      store,
      primaryModelClass,
      payload,
      id,
      requestType
    );
  }
}
