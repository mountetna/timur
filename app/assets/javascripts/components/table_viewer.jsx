import React from 'react'

class TableViewer extends React.Component {
  constructor(props) {
    super(props)
    this.state = { current_page: 0 }
  }

  render() {
    var props = this.props

    return <div className="table">
      <Pager pages={ props.pages } 
        current_page={ props.current_page }
        set_page={ props.set_page } >
        <div className='search'>&#x2315;</div>
        <input className="filter" type="text" onChange={ props.set_filter }/>
        <input className="export" type="button" onClick={ this.export_table.bind(this,records) } value={"\u21af TSV"}/>
        <Help info="table_viewer"/>
      </Pager>
      <div className="table_row">
      {
        attribute_names.map((att_name,i) => 
          <div key={i} className="table_header">{ att_name }</div>
        )
      }
      </div>
      {
        props.record_names.slice(props.page_size * this.state.current_page, props.page_size * (this.state.current_page+1)).map(
          (record_name) => {
            var document = documents[record_name]
            return <div key={ record_name } className="table_row">
            {
              attribute_names.map(
                (att_name, i) => <div className="table_data" key={i}>
                  <AttributeViewer 
                    template={ props.template }
                    document={ document }
                    value={ document[ att_name ] }
                    attribute={ template.attribute[att_name] }/>
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
      attribute_names: Object.keys(template.attributes).filter(
        (att_name) => template.attributes[att_name].shown
      )
    }
  }
)(TableViewer)
