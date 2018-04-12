import React from 'react';
import TableViewer from '../table_viewer';

export default class TableAttribute extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      filter: '',
      current_page: 0
    };
  }

  render(){
    if(this.props.mode != 'browse') return <div className='value'></div>;

    let table_props = {
      page_size: 10,
      current_page: this.state.current_page,
      filter: this.state.filter,
      model_name: this.props.attribute.model_name,
      record_names: this.props.value,
      setPage: (page)=>this.setState({current_page: page-1}),
      onFilter: (filter)=>this.setState({current_page: 0, filter}),
    };

    return(
      <div className='value'>
        <TableViewer {...table_props} />
      </div>
    );
  }
}
