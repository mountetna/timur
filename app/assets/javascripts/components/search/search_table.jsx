import React, {Component} from 'react';
import {connect} from 'react-redux';
import Magma from 'magma';
import SearchTableColumnHeader from './search_table_column_header';
import SearchTableRow from './search_table_row';

class SearchTable extends Component{
  constructor(props){
    super(props);
    this['state'] = {};
  }

  focusCell(row, column){
    if(column == null) return (row == this.state.focus_row);
    if(row == null) return (column == this.state.focus_col);
    this.setState({'focus_row': row, 'focus_col': column});
  }

  renderColumnHeader(){
    return this.props.attribute_names.map((attr_name, i)=>{

      var header_props = {
        'key': attr_name,
        'column': attr_name,
        'focused': this.focusCell(null, attr_name)
      };

      return <SearchTableColumnHeader {...header_props} />;
    });
  }

  renderTableRow(){

    var props = this.props;
    var documents = this.props.documents;
    var template = this.props.template;
    var revisions = this.props.revisions;
    var attribute_names = this.props.attribute_names;

    return this.props.record_names.map((record_name)=>{

      var row_props = {
        'key': record_name,
        'mode': props.mode,
        'attribute_names': attribute_names,
        'document': documents[record_name],
        'template': template,
        'record_name': record_name,
        'revision': revisions[record_name],
        'focusCell': this.focusCell.bind(this)
      };

      return <SearchTableRow {...row_props} />;
    });
  }

  render(){
    if(!this.props.documents) return <div className='table'></div>;

    return(
      <div className='table'>

        <div className='table_row'>

          {this.renderColumnHeader()}
        </div>
        {this.renderTableRow()}
      </div>
    );
  }
};

const completeRecord = (documents, attribute_names)=>{
  return (record_name)=>{
    return(
      documents[record_name] &&
      attribute_names.every((attribute_name)=>{
        return documents[record_name].hasOwnProperty(attribute_name);
      })
    );
  };
};

// exclude things not shown and tables
const displayedAttributes = (template)=>{
 return  Object.keys(template.attributes).filter((attribute_name)=>{
    return(
      template.attributes[attribute_name].shown &&
      template.attributes[attribute_name].attribute_class !=
      'Magma::TableAttribute'
    );
  });
};

const mapStateToProps = (state, ownProps)=>{
  if(!ownProps.model_name) return {};

  var magma = new Magma(state);
  var documents = magma.documents(ownProps.model_name, ownProps.record_names);
  var revisions = magma.revisions(ownProps.model_name, ownProps.record_names);
  var template = magma.template(ownProps.model_name);
  var attribute_names = displayedAttributes(template);

  var complete = ownProps.record_names.every(
    completeRecord(documents, attribute_names)
  );

  if(!complete) documents = null;

  return {
    'documents': documents,
    'revisions': revisions,
    'template': template,
    'attribute_names': attribute_names
  };
};

const mapDispatchToProps = (dispatch, ownProps)=>{
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchTable);
