import React from 'react'

const Matrix = ({col_names, row_names, rows}) => (
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
)

const List = ({dataList}) => (
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
)

const isPrimitiveType = (value) => typeof value === 'string' || typeof value === 'number' || value === null || typeof value === 'undefined'

const createManifestElement = (data) => {
  if (isPrimitiveType(data)) {
    return <div>{data}</div>
  } else if (Array.isArray(data) && data[0].label) {
    if (isPrimitiveType(data[0].value)) {
      return <List dataList={data}/>
    } else {
      console.log (data)
      return data.map((elem, index) => (
        <div key={index}>
          <h3>{elem.label}</h3>
          { createManifestElement(elem.value) }
        </div>
      ))
    }
  } else {
    return <Matrix {...data.matrix} />
  }
} 

const manifest = (manifest) => {
  const manifestElementList = Object.keys(manifest)

  return (
    <div>
      {manifestElementList.map((elementName, index) => (
        <div key={index}>
          <h3>@{elementName}</h3>
          {createManifestElement(manifest[elementName]) }
        </div>
      ))}
    </div>
  )
}

export default manifest




    //   ))
    // }     if (data[0] && isPrimitiveType(data[0].value)) {

