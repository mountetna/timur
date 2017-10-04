import React, {Component} from 'react';
import SearchTableCell from './search_table_cell';

export default class SearchTableRow extends Component{

  renderTableCells(){
    var props = this.props;
    return props.attribute_names.map((att_name, i)=>{

      var table_cell_props = {
        'key': att_name,
        'att_name': att_name,
        'document': props.document,
        'template': props.template,
        'revision': props.revision,
        'record_name': props.record_name,
        'focusCell': props.focusCell,
        'mode': props.mode,
      };

      return <SearchTableCell {...table_cell_props} />;
    });
  }

  render(){

    return(
      <div className='table_row'>

        {this.renderTableCells()}
      </div>
    );
  }
};
