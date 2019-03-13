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

  render() {
    let { className, text, data, onDownload } = this.props;
    let { hidden } = this.state;
    let icon = hidden ? 'chevron-right' : 'chevron-down';
    return(
      <div className='consignment-item'>
        <i className={ `table-visibility icon fa fa-fw fa-${icon}` }
          title={ hidden ? 'Show' : 'Hide' }
          onClick={ this.toggle.bind(this)}/>
        <i className={ `list icon ${className}` } aria-hidden='true'
          title={ hidden ? 'Show' : 'Hide' }
          onClick={ this.toggle.bind(this)}
        />
        <i className='download icon fa fa-fw fa-download'
          title='Download'
          onClick={ onDownload }/>
        <span className='size'>{text}</span>
        { !hidden && this.table() }
      </div>
    );
  }
}
