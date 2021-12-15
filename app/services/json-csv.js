import Service from '@ember/service';

export default class JsonCsvService extends Service {
  arrayToCsv(array) {
    try {
      const keys = [Object.keys(array[0])].concat(array);
      return keys
        .map((row) => {
          return Object.values(row)
            .map((value) => {
              return typeof value === 'string'
                ? JSON.stringify(value).replace(/[#,]/gm, '')
                : value;
            })
            .toString();
        })
        .join('\n');
    } catch (err) {
      console.log(err);
      return 'data invalid';
    }
  }
}