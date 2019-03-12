import React, {Component} from 'react';
import {connect} from 'react-redux';
import ReactTable from 'react-table';

import AttributeViewer from '../attributes/attribute_viewer';
import { selectDocuments, selectTemplate } from '../../selectors/magma';

const TableButton = ({direction,children,disabled,...props}) =>
  <div className={ `pagination-nav ${disabled ? 'disabled' : ''}` } {...props } disabled={disabled}>
    <i className={ `fas fa-chevron-${direction}`}/>
  </div>;

const Prev = (props) => <TableButton direction='left' {...props}/>
const Next = (props) => <TableButton direction='right' {...props}/>

class SearchTable extends Component {
  render() {
    let { record_names, documents, template, attribute_names, page, pages, page_size, setPage } = this.props;

    if (!record_names) return <div className='table'></div>;


    let data = record_names.map(record_name => documents[record_name]);

    return <div className='table'>
      <ReactTable
        manual
        showPaginationBottom={ false }
        showPaginationTop={ true }
        onPageChange={ setPage }
        sortable={ false }
        page={ page }
        pages={ pages }
        pageSize={ page_size }
        showPageSizeOptions={ false }
        PreviousComponent={ Prev }
        NextComponent={ Next }
        columns={columns}
        data={ data }/>
    </div>;
  }
}

export default connect(
  function(state,props) {
    let { model_name, record_names } = props;
    if (!model_name || !record_names) return {}

    let documents = selectDocuments(state, model_name, record_names);
    let template = selectTemplate(state, model_name);
    let attribute_names = displayedAttributes(template)

    return {
      template,
      attribute_names,
      documents
    }
  }
)(SearchTable)
