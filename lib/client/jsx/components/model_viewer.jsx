import React from 'react';
import {connect} from 'react-redux';
import TableViewer from 'etna-js/components/table_viewer';

import {
  selectTemplate,
  selectDocuments,
  displayAttributes
} from 'etna-js/selectors/magma';
import AttributeViewer from './attributes/attribute_viewer';

const ModelViewer = ({
  record_names,
  documents,
  template,
  attribute_names,
  page,
  pages,
  page_size,
  setPage,
  children,
  restricted_attribute_names = null
}) => {
  if (!template || !record_names) return <div className='table' />;

  record_names = Object.keys(documents).sort();

  const display_attribute_names = restricted_attribute_names
    ? restricted_attribute_names
    : attribute_names;

  let columns = display_attribute_names.map((att_name) => ({
    Header: att_name,
    accessor: att_name,
    Cell: ({value, row}) => (
      <AttributeViewer
        template={template}
        record={row.original}
        attribute_name={att_name}
        mode="model_viewer"
      />
    )
  }));


  let data = record_names.map((record_name) => documents[record_name]);

  return (
    <TableViewer
      pages={pages}
      page={page}
      page_size={page_size}
      setPage={setPage}
      columns={columns}
      data={data}
    >{children}</TableViewer>
  );
};

export default connect((state, {model_name, record_names, filter}) => {
  let template = selectTemplate(state, model_name);
  let documents = selectDocuments(state, model_name, record_names, filter);
  let attribute_names = displayAttributes(template);
  return {template, documents, attribute_names};
})(ModelViewer);
