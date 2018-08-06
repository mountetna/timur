// Framework libraries.
import * as React from 'react';
import { downloadTSV } from '../../utils/tsv';
import ConsignmentTable from './consignment_table';
import ConsignmentResult from './consignment_result';
import { isPrimitiveType } from '../../utils/types'

class VectorResult extends React.Component{
  constructor(props){
    super(props);
    this.state = { hidden: true };
  }

  toggle(){
    this.setState({hidden: !this.state.hidden});
  }


  downloadVector(){
    let vectors = this.props.vector.map((label,value)=>{
      return {label, value};
    });
    downloadTSV(vectors, ['label', 'value'], this.props.name);
  }

  table() {
    let { vector } = this.props;
    let headers = [ 'Labels', 'Values' ];
    let rows = vector.map((label, value)=>[
      label,
      isPrimitiveType(value) ? value : <ConsignmentResult data={ value } />
    ]);

    return <ConsignmentTable headers={ headers } rows={ rows }/>;
  }

  render(){
    let {vector} = this.props;
    let {hidden} = this.state;
    return(
      <div className='consignment-vector'>
        <i className='vector-icon fas fa-list' aria-hidden='true'/>
        {` ${vector.size} elements`}
        <button className='consignment-btn' onClick={this.downloadVector.bind(this)}>
          <i className='download-icon fas fa-download' aria-hidden='true'></i>
          {'DOWNLOAD'}
        </button>
        <button className='consignment-btn' onClick={this.toggle.bind(this)}>
          <i className='fas fa-table' aria-hidden='true'></i>
          {hidden ? 'SHOW' : 'HIDE'}
        </button>
        { !hidden && this.table() }
      </div>
    );
  }
}

export default VectorResult;
