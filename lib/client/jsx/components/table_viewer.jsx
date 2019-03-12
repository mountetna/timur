import React from 'react';
import ReactTable from 'react-table';

const TableButton = ({direction,children,disabled,...props}) =>
  <div className={ `pagination-nav ${disabled ? 'disabled' : ''}` } {...props } disabled={disabled}>
    <i className={ `fas fa-chevron-${direction}`}/>
  </div>;

const Prev = (props) => <TableButton direction='left' {...props}/>;
const Next = (props) => <TableButton direction='right' {...props}/>;

const TableViewer = ({ page, pages, page_size, setPage, columns, data }) =>
  <div className='table'>
    <ReactTable
      showPaginationBottom={ false }
      showPaginationTop={ pages > 1 || data.length > page_size }
      onPageChange={ setPage }
      sortable={ false }
      minRows={0}
      manual={ pages != -1 }
      page={ page }
      pages={ pages == -1 ? undefined : pages }
      pageSize={ page_size }
      showPageSizeOptions={ false }
      PreviousComponent={ Prev }
      NextComponent={ Next }
      columns={columns}
      data={ data }/>
  </div>;

export default TableViewer;
