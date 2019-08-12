import React from 'react';
import { connect } from 'react-redux';
import TableViewer from './table_viewer';

import { selectTemplate, selectDocuments, displayAttributes } from '../selectors/magma';
import AttributeViewer from './attributes/attribute_viewer';

const ModelViewer = ({ record_names, documents, template, attribute_names, page, pages, page_size, setPage }) => {
  if (!template || !record_names) return <div className='table'/>;

  record_names = Object.keys(documents).sort();

  let columns = attribute_names.map(
    att_name => (
      {
        Header: att_name,
        accessor: att_name,
        Cell: ({value, original}) => <AttributeViewer
          template={template}
          document={original}
          value={value}
          attribute={ template.attributes[att_name] }
        />
      }
    )
  );

  let data = record_names.map(record_name => documents[record_name]);

  return(
    <TableViewer
      pages={ pages }
      page={ page }
      page_size={ page_size }
      setPage={ setPage }
      columns={columns}
      data={ data }
    />
  );
}

export default connect(
  (state, { model_name, record_names, filter }) => {
    let template = selectTemplate(state, model_name);
    let documents = selectDocuments( state, model_name, record_names, filter );
    let attribute_names = displayAttributes(template);
    return { template, documents, attribute_names };
  }
)(ModelViewer);
