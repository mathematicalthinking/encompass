import Transform from '@ember-data/serializer/transform';

export default Transform.extend({
  deserialize: function (serialized) {
    return serialized;
  },

  serialize: function (deserialized) {
    return deserialized;
  },
});
