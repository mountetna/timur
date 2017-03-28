import React from 'react'
import json2csv from 'json2csv'
import downloadjs from 'downloadjs'

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
    <h3>
      @{name}
      <i className="fa fa-download" aria-hidden="true" onClick={() => downloadCSV(rows, col_names, name, matrixConversion)}></i>
    </h3>
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
    <h3>
      @{name}
      <i className="fa fa-download" aria-hidden="true" onClick={() => downloadCSV(dataList, ['label', 'value'], name)}></i>
    </h3>
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

const isPrimitiveType = (value) => typeof value === 'string' || typeof value === 'number' || value === null || typeof value === 'undefined'

const createManifestElement = (name, data) => {
  if (isPrimitiveType(data)) {
    return ( 
      <div>
        <h3>@{name}</h3>
        {data}
      </div>
    )
  } else if (Array.isArray(data) && data[0].label) {
    if (isPrimitiveType(data[0].value)) {
      return <List dataList={data} name={name}/>
    } else {
      return (
        <div>
          <h3>@{name}</h3>
          {data.map((elem, index) => (
            <div key={index}>
              { createManifestElement(elem.label, elem.value) }
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

const manifest = (manifest) => {
  const manifestElementList = Object.keys(manifest)

  return (
    <div className='manifest-results-container'>
      {manifestElementList.map((elementName, index) => (
        <div key={index}>
          {createManifestElement(elementName, manifest[elementName]) }
        </div>
      ))}
    </div>
  )
}

export default manifest

