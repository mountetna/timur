
import json2csv from 'json2csv'
import downloadjs from 'downloadjs'

import React from 'react'

const ManifestResults = ({ results, name }) => {
  let manifestResults

  if (typeof results === 'string') {
    manifestResults = <span>{results}</span>
  } else  if (results[name]) {
    let result = results[name]
    manifestResults = Object.keys(result).map((elementName, index) => (
      <div key={index}>
        {createResult(elementName, result[elementName]) }
      </div>
    ))
  }

  return (
    <div className='manifest-results-container'>
      <div>Results</div>
        {manifestResults}
    </div>
  )
}

const isPrimitiveType = (value) => typeof value === 'string' || typeof value === 'number' || value === null || typeof value === 'undefined'

const createResult = (name, data) => {
  if (isPrimitiveType(data)) {
    return (
      <div>
        <div>@{name}</div>
        {data}
      </div>
    )
  } else if (Array.isArray(data) && data[0].label) {
    if (isPrimitiveType(data[0].value)) {
      return <List dataList={data} name={name}/>
    } else {
      return (
        <div>
          <div>@{name}</div>
          {data.map((elem, index) => (
            <div key={index}>
              { createResult(elem.label, elem.value) }
            </div>
          ))}
        </div>
      )
    }
  } else {
    const props = { ...data.matrix, name }
    return <Matrix {...props} />
  }
}


const matrixConversion = (data, fields) => {
  return data.map(dataArr => {
    return fields.reduce((acc, curr, index) => {
      return {...acc, [curr]: dataArr[index]}
    }, {})
  })
}

const downloadCSV = (data, fields, fileName, matrixConversion = (data, fields) => data) => {
  const jsonData = matrixConversion(data, fields)
 
  try {
    var result = json2csv({ data: jsonData, fields: fields, del: '\t'});
    downloadjs(result, fileName+'.tsv', 'tsv');
  } catch (err) {
    // Errors are thrown for bad options, or if the data is empty and no fields are provided.
    // Be sure to provide fields if it is possible that your data array will be empty.
    console.error(err);
  }
}

const Matrix = ({col_names, row_names, rows, name}) => (
  <div>
    <div>
      @{name}
      <i className="fa fa-download" aria-hidden="true" onClick={() => downloadCSV(rows, col_names, name, matrixConversion)}></i>
    </div>
    <table>
      <thead>
        <tr>
          <th>row_names</th>
          {col_names.map((columnName, index) => <th key={index}>{columnName}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index}>
            <td>{row_names[index]}</td>
            { row.map((data, index) => <td key={index}>{data}</td>) }
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

const List = ({dataList, name}) => (
  <div>
    <div>
      @{name}
      <i className="fa fa-download" aria-hidden="true" onClick={() => downloadCSV(dataList, ['label', 'value'], name)}></i>
    </div>
    <table>
      <thead>
        <tr>
          <th>label</th>
          <th>value</th>
        </tr>
      </thead>
      <tbody>
        {dataList.map((data, index) =>
          <tr key={index}>
            <td>{data.label}</td>
            <td>{data.value}</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
)

export default ManifestResults