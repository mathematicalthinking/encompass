import RESTSerializer from '@ember-data/serializer/rest';

/**
 * ApplicationSerializer
 * Customizes the serialization for the application, ensuring compatibility with MongoDB/Mongoose by using `_id` as the primary key.
 */
export default class ApplicationSerializer extends RESTSerializer {
  primaryKey = '_id'; // Use Mongoose's _id as the primary key
}
