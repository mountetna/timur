import ModelViewer from '../model_viewer'
import React from 'react'

const TableAttribute = ({ mode, attribute, value }) => {
  if (mode != 'browse') return <div className='attribute'/>;

  if (!value || !value.length) return <div className='attribute'>No data</div>;

  return <div className='attribute'>
    <ModelViewer
      page_size={ 10 }
      pages={ -1 }
      model_name={ attribute.model_name }
      record_names={ value }/>
  </div>
}

export default TableAttribute;
