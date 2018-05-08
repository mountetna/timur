// Framework libraries.
import * as React from 'react';
import * as TSV from '../../utils/tsv';

class VectorResult extends React.Component{
  componentWillMount(){
    this.setState({hidden: true});
  }

  toggle(){
    this.setState({hidden: !this.state.hidden});
  }

  display(){
    return this.state.hidden ? 'none' : 'initial';
  }

  tableRows(){
    return(
      this.props.vector.map((label, value, index)=>{
        return(
          <tr key={index}>

            <td>{label}</td>
            <td>{value}</td>
          </tr>
        );
      })
    );
  }

  downloadVector(){
    let vectors = this.props.vector.map((label,value)=>{
      return {label, value};
    });
    TSV.downloadTSV(vectors, ['label', 'value'], this.props.name);
  }

  render(){
    let {vector} = this.props;
    return(
      <div className='consignment-vector'>

        {`Vector Data: ${vector.size} elements`}
        <button className='consignment-btn' onClick={this.downloadVector.bind(this)}>
          
          <i className='fa fa-download' aria-hidden='true'></i>
          {' DOWNLOAD'}
        </button>
        <button className='consignment-btn' onClick={this.toggle.bind(this)}>

          <i className='fa fa-table' aria-hidden='true'></i>
          {this.state.hidden ? ' SHOW' : ' HIDE'}
        </button>
        <div style={{display : this.display()}}>

          <table className='consignment-table'>

            <thead>

              <tr>

                <th>{'Labels'}</th>
                <th>{'Values'}</th>
              </tr>
            </thead>
            <tbody>

              {this.tableRows()}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default VectorResult;
