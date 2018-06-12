// Framework libraries.
import * as React from 'react';
import * as TSV from '../../utils/tsv';

class ConsignmentTable extends React.Component{
  header() {
    let { headers } = this.props;

    return(
      <div className='consignment-row'>
        {
          headers.map(
            (col_name, index) =>
              <div className='consignment-header' key={index}>{col_name}</div>
          )
        }
      </div>
    );
  }

  tableRows(){
    let { headers, rows } = this.props;
    return rows.map( (row, i) =>
      <div className='consignment-row' key={i}>
        {row.map((data, j)=>(<div className='consignment-cell' key={j}>{data}</div>))}
      </div>
    );
  }

  render() {
    return <div className='consignment-result-group'>
      <div className='consignment-table'>
        <div className='consignment-head'>
          {this.header()}
        </div>
        <div className='consignment-body'>
          {this.tableRows()}
        </div>
      </div>
    </div>
  }
}

export default ConsignmentTable;
