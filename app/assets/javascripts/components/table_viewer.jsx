import AttributeViewer from './attributes/attribute_viewer';
import Pager from './pager';
import Help from './help';
import { connect } from 'react-redux';

import React from 'react'
import Magma from '../magma'
import { requestTSV } from '../actions/magma_actions'

class TableViewer extends React.Component {
  render() {
    var props = this.props

    if (!props.template) return <div></div>

    if (!props.record_names.length) return <div>No entries</div>

    return <div className="table">
      <Pager pages={ props.pages } 
        current_page={ props.current_page + 1 }
        set_page={ props.set_page } >
        <div className='search'>&#x2315;</div>
        <input className="filter" type="text" onChange={ props.set_filter }/>
        <input className="export" type="button" onClick={ () => props.requestTSV(props.model_name, props.record_names) } value={"\u21af TSV"}/>
        <Help info="table_viewer"/>
      </Pager>
      <div className="table_row">
      {
        props.attribute_names.map((att_name,i) => 
          <div key={i} className="table_header">{ att_name }</div>
        )
      }
      </div>
      {
        props.record_names.slice(props.page_size * props.current_page, props.page_size * (props.current_page+1)).map(
          (record_name) => {
            var document = props.documents[record_name]
            return <div key={ record_name } className="table_row">
            {
              props.attribute_names.map(
                (att_name, i) => <div className="table_data" key={i}>
                  <AttributeViewer 
                    template={ props.template }
                    document={ document }
                    value={ document[ att_name ] }
                    attribute={ props.template.attributes[att_name] }/>
                </div>
              )
            }
            </div>
          }
        )
      }
      </div>
  }
}

export default connect(
  function(state,props) {
    var magma = new Magma(state)
    var template = magma.template(props.model_name)
    var documents = magma.documents( props.model_name, props.record_names, props.filter )
    var record_names = Object.keys(documents).sort()
    return {
      template: template,
      documents: documents,
      mode: props.mode,
      record_names: record_names,
      pages: Math.ceil(record_names.length / props.page_size),
      attribute_names: template ? Object.keys(template.attributes).filter(
        (att_name) => template.attributes[att_name].shown
      ) : null
    }
  },
  function(dispatch,props) {
    return {
      requestTSV: function(model_name, record_names) {
        dispatch(requestTSV(model_name, record_names))
      }
    }
  }
)(TableViewer)
