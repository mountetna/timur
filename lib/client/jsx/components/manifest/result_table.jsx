import React from 'react';
import TableViewer from '../table_viewer';

export default class ResultTable extends React.Component {
  constructor(props){
    super(props);
    this.state = { hidden: true };
  }

  toggle() {
    this.setState({hidden: !this.state.hidden});
  }

  downloadVector(){
    let vectors = this.props.vector.map((label,value)=>{
      return {label, value};
    });
    downloadTSV(vectors, ['label', 'value'], this.props.name);
  }

  table() {
    let { columns, data } = this.props;

    return(
      <TableViewer
        pages={ -1 }
        page_size={ 10 }
        columns={columns}
        data={ data }
      />
    );
  }

  render(){
    let {className, text, data, onDownload } = this.props;
    let {hidden} = this.state;
    return(
      <div className='consignment-item'>
        <i className={ className } aria-hidden='true'/>
        {text}
        <button className='consignment-btn' onClick={ onDownload }>
          {'download'}
        </button>
        <button className='consignment-btn' onClick={this.toggle.bind(this)}>
          {hidden ? 'show' : 'hide'}
        </button>
        { !hidden && this.table() }
      </div>
    );
  }
}
