import Service from '@ember/service';

export default class JsonCsvService extends Service {
  _processValue(value) {
    return typeof value === 'string'
      ? encodeURIComponent(JSON.stringify(value)).replace(/,/g, '')
      : value.toString();
  }

  arrayToCsv(array) {
    if (!array.length) {
      return 'No data to display';
    }
    try {
      // assume that the first object in the array will have all the keys needed for all array objects
      // better alternative is to explicitly pass in an array of keys
      const keys = Object.keys(array[0]);

      // Process the values in each row, converting the given object into a comma-delimited string
      const allRows = array.map((row) => {
        const processedValues = keys.map((key) => this._processValue(row[key]));
        return processedValues.join(','); // provides the comma delimiting
      });

      // add the keys (headings) to the top and return one big string with each row separated by a return
      return [keys.join(','), ...allRows].join('\n');
    } catch (err) {
      console.log(err);
      return `error: ${err.message}`;
    }
  }
}
