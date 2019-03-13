// Framework libraries.
import * as React from 'react';
import { downloadTSV } from '../../utils/tsv';
import ConsignmentResult from './consignment_result';
import ResultTable from './result_table';

class VectorResult extends React.Component{
  downloadVector(){
    let vectors = this.props.vector.map((label,value)=>{
      return {label, value};
    });
    downloadTSV(vectors, ['label', 'value'], this.props.name);
  }

  render () {
    let { vector } = this.props;

    let columns = [ 'label', 'value' ].map(
      header => (
        {
          Header: header,
          accessor: header,
          Cell: ({value}) => <ConsignmentResult data={ value } />
        }
      )
    );

    let data = vector.map((label, value)=>({label, value}))

    return <ResultTable
      data={ data }
      columns={ columns }
      onDownload={this.downloadVector.bind(this)}
      className='fas fa-list'
      text={`(${vector.size})`}/>;
  }
}

export default VectorResult;
