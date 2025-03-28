import Service from '@ember/service';

export default class JsonCsvService extends Service {
  arrayToCsv(array, columnHeaders) {
    if (!array.length) {
      return 'No data to display';
    }

    try {
      // Use given headers or from the first object
      const headers = columnHeaders || Object.keys(array[0]);

      // Create CSV header row
      const headerRow = headers
        .map((header) => {
          const escaped = header.replace(/"/g, '""');
          return `"${escaped}"`;
        })
        .join(',');

      // Create data rows
      const dataRows = array.map((item) => {
        return headers
          .map((header) => {
            const value = item[header];
            if (value == null) {
              return '';
            }
            // Convert anything that isn’t a string into a string
            let text = String(value);

            // Escape internal quotes by doubling them
            text = text.replace(/"/g, '""');

            // Wrap the entire text in quotes
            return `"${text}"`;
          })
          .join(',');
      });

      // Combine header and data rows into a proper CSV string
      const csvContent = [headerRow, ...dataRows].join('\n');

      return csvContent;
    } catch (err) {
      console.error(err);
      return `error: ${err.message}`;
    }
  }
}
