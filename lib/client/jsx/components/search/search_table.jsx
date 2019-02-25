import React, {Component} from 'react';
import {connect} from 'react-redux';
import Magma from '../../magma';
import AttributeViewer from '../attributes/attribute_viewer';
import ReactTable from 'react-table';

// exclude things not shown and tables
const displayedAttributes = (template) =>
  Object.keys(template.attributes).filter(
    (attribute_name) =>
    template.attributes[attribute_name].shown
    && template.attributes[attribute_name].attribute_class != 'Magma::TableAttribute'
  )

class SearchTable extends Component {
  render() {
    let { record_names, documents, template, attribute_names, page, pages, page_size, setPage } = this.props;

    if (!record_names) return <div className='table'></div>;

    let columns = attribute_names.map(
      att_name => (
        {
          Header: att_name,
          accessor: att_name,
          Cell: ({value}) => <AttributeViewer
            template={template}
            document={document}
            value={value}
            attribute={ template.attributes[att_name] }
          />
        }
      )
    );

    let data = record_names.map(record_name => documents[record_name]);

    return <div className='table'>
      <ReactTable
        manual
        showPaginationBottom={ false }
        showPaginationTop={ true }
        onPageChange={ setPage }
        page={ page }
        pages={ pages }
        pageSize={ page_size }
        columns={columns}
        nextText={'›'}
        previousText={'‹'}
        data={ data }/>
    </div>;
  }
}

export default connect(
  function(state,props) {
    if (!props.model_name) return {}

    let magma = new Magma(state)
    let documents = magma.documents(props.model_name, props.record_names)
    let template = magma.template(props.model_name)
    let attribute_names = displayedAttributes(template)

    return {
      template,
      attribute_names,
      documents
    }
  }
)(SearchTable)
