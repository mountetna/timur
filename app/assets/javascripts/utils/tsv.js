import json2csv from 'json2csv'
import downloadjs from 'downloadjs'

export const matrixConversion = (data, fields) => {
  return data.map(dataArr => {
    return fields.reduce((acc, curr, index) => {
      return {...acc, [curr]: dataArr[index]}
    }, {})
  })
}

export const downloadTSV = (data, fields, fileName) => {
  try {
    var result = json2csv({ data: data, fields: fields, del: '\t'});
    downloadjs(result, fileName+'.tsv', 'tsv');
  } catch (err) {
    // Errors are thrown for bad options, or if the data is empty and no fields are provided.
    // Be sure to provide fields if it is possible that your data array will be empty.
    console.error(err);
  }
}
