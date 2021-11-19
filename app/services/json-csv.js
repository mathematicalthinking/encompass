import Service from '@ember/service';

export default class JsonCsvService extends Service {
  arrayToCsv(array) {
    const keys = [Object.keys(array[0])].concat(array);
    const res = keys
      .map((row) => {
        return Object.values(row)
          .map((value) => {
            return typeof value === 'string' ? JSON.stringify(value) : value;
          })
          .toString();
      })
      .join('\n');
    console.log(res);
    return res;
  }
}
