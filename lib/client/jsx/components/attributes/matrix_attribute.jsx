import React from 'react'
import TableViewer from '../table_viewer';

export default class MatrixAttribute extends React.Component {
  constructor(props) {
    super(props)
    this.state = { filter: "", current_page: 0 }
  }

  render() {
    let { mode, attribute, value: row } = this.props;
    let { current_page, filter } = this.state;

    if (mode != 'browse') return <div className='attribute'/>;

    if (!row || !row.length) return <div className='attribute'>No data</div>;

    let columns = [
      {
        Header: 'label',
        accessor: 'row_name'
      },
      {
        Header: attribute.name,
        accessor: 'value'
      }
    ];

    filter = new RegExp(filter);
    let data = row.map( (value,i) =>({
      row_name: attribute.options[i],
      value
    }) ).filter( ({row_name}) => filter.test(row_name));

    return <div className='attribute'>
      <input placeholder='Filter query' className='filter' type='text' onChange={
        e => this.setState({ current_page: 0, filter: e.target.value })
      }/>
      <TableViewer
        pages={ -1 }
        page_size={ 10 }
        columns={ columns }
        data={ data }/>
    </div>
  }
}
