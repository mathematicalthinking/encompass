import Service from '@ember/service';

export default class JsonCsvService extends Service {
  arrayToCsv(array) {
    if (!array.length) {
      return 'No data to display';
    }
    try {
      const keys = [Object.keys(array[0])].concat(array);

      return keys
        .map((row) => {
          return Object.values(row)
            .map((value) => {
              return typeof value === 'string'
                ? encodeURIComponent(JSON.stringify(value)).replace(/,/g, '')
                : value;
            })
            .toString();
        })
        .join('\n');
    } catch (err) {
      console.log(err);
      return `error: ${err.message}`;
    }
  }
}
