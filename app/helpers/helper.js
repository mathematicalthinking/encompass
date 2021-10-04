/*global _:false */

export default {
  /**
   * Summarize the property of a set of objects
   */
  describeProperty: function (objects, property) {
    var properties = {};
    objects.forEach(function (object) {
      var value = object.get(property);
      if (value) {
        if (properties[value]) {
          properties[value]++;
        } else {
          properties[value] = 1;
        }
      }
    });

    var valueNames = _.keys(properties);
    var number = valueNames.length;
    var text = valueNames.join(", ");

    return {
      text: text,
      number: number,
      multiple: number > 1 ? true : false
    };
  }
};
