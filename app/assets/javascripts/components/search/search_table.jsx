import React, {Component} from 'react';
import {connect} from 'react-redux';
import Magma from 'magma';
import SearchTableColumnHeader from './search_table_column_header';
import SearchTableRow from './search_table_row';

// exclude things not shown and tables
const displayedAttributes = (template) =>
  Object.keys(template.attributes).filter(
    (attribute_name) =>
    template.attributes[attribute_name].shown
    && template.attributes[attribute_name].attribute_class != "Magma::TableAttribute"
  )

class SearchTable extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  focusCell(row, column) {
    if (column == null) return (row == this.state.focus_row)
    if (row == null) return (column == this.state.focus_col)
    this.setState({ focus_row: row, focus_col: column })
  }

  render() {
    let { record_names, documents, template, attribute_names, mode } = this.props

    if (!record_names) return <div className="table"></div>

    return <div className="table">
              <div className="table_row">
              {
                attribute_names.map((att_name,i) =>
                  <SearchTableColumnHeader key={att_name} 
                    column={ att_name }
                    focused={ this.focusCell( null, att_name ) }
                  />
                )
              }
              </div>
              {
                record_names.map((record_name) =>
                  <SearchTableRow 
                    key={ record_name }
                    mode={ mode }
                    attribute_names={ attribute_names }
                    document={ documents[record_name] }
                    template={template}
                    record_name={ record_name }
                    focusCell={ this.focusCell.bind(this) }
                  />
                )
              }
             </div>
  }
}

export default connect(
  function(state,props) {
    if (!props.model_name) return {}

    let magma = new Magma(state)
    let documents = magma.documents(props.model_name, props.record_names)
    let template = magma.template(props.model_name)
    let attribute_names = displayedAttributes(template)

    return {
      template,
      attribute_names,
      documents
    }
  }
)(SearchTable)
