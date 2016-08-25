/*
 * The Search view allows us to post queries for a particular table.
 * 
 */

SearchTable = React.createClass({
  render: function() {
    var self = this
    var table = self.props.table

    if (!records) return <div className="table"></div>

    return <div className="table">
            <Pager pages={ pages } 
              current_page={ self.state.current_page }
              set_page={ self.set_page } >
              <input className="export" type="button" value={"\u21af TSV"}/>
            </Pager>
              <div className="table_item">
              {
                table.columns.map(function(column,i) {
                  return <div key={i} className="table_header">{ column.name }</div>
                })
              }
              </div>
              {
                records.map(
                  function(record) {
                    return <div key={ record.id }
                      className="table_item">
                      {
                        table.columns.map(function(column, i) {
                          var value = record[ column.name ]
                          var txt = column.render(record, self.props.mode)
                          return <div key={i} className="item_value">{ txt }</div>
                        })
                      }
                    </div>
                  })
              }
             </div>
  },
})

Search = React.createClass({
  getInitialState: function() {
    return { mode: 'search', page_size: 10, record_names: [] }
  },
  componentDidMount: function() {
    var self = this

    this.props.getModels()
  },
  page_record_names: function(page, record_names) {
    if (!record_names) return []
    return record_names.slice( this.state.page_size * page, this.state.page_size * (page + 1) )
  },
  render: function() {
    var self = this

    var documents // = this.props.documentsFor(this.state.selected_model)

    var pages = Math.ceil(self.state.record_names.length / self.state.page_size)

    var page_record_names = self.page_record_names(0, self.state.record_names)
    if (self.props.hasCompleteRecords(self.state.selected_model, page_record_names)) {
      console.log("Getting these:")
      console.log(page_record_names)
      documents = self.props.documentsFor(self.state.selected_model, page_record_names)
      console.log(documents)
    }

    return <div id="search">
        <span className="label">Show table</span>

        <Selector name="model"
          values={
            Object.keys(this.props.magma_models)
          }
          onChange={
            function(model_name) {
              self.setState({ selected_model: model_name, record_names: [] })
            }
          }
          showNone="enabled"/>

        <input type="text" className="filter" 
          placeholder="filter query"
          onChange={
          function(e) {
            self.setState({ current_filter: e.target.value })
          }
        }/>

        <input type="button" className="button" value="Search" 
          disabled={ !this.state.selected_model || this.state.loading_table }
          onClick={ 
            function(e) {
              self.props.query(
                self.state.selected_model, 
                self.state.current_filter,
                function(response) {
                  self.setState({ record_names: response.record_names })

                  page_record_names = self.page_record_names(0, response.record_names)
                  if (!self.props.hasCompleteRecords(self.state.selected_model, page_record_names)) {
                    self.props.requestDocuments( self.state.selected_model, page_record_names )
                  }
                }
              )
            }
          } />
        {
          documents ?  
            <SearchTable 
            table={ TableSet( documents, this.props.templateFor(this.state.selected_model) ) }
            pages={ pages }
            current_page={ self.state.current_page }
            page_size={ self.state.page_size }/> : null
        }
    </div>
  }
})

Search = connect(
  function(state, props) {
    return $.extend({},
      props,
      {
        magma_models: state.templates,
        documentsFor: function(model_name, record_names) {
          if (state.templates[model_name] && state.templates[model_name].documents)
          return record_names.map(function(record_name){
            return state.templates[model_name].documents[record_name]
          })
        },
        templateFor: function(model_name) {
          if (state.templates[model_name]) return state.templates[model_name].template
        },
        hasCompleteRecords: function(model_name, record_names) {
          model_info = state.templates[model_name]

          if (!model_info) return false

          template = model_info.template

          return record_names.every(function(record_name) {
            record = model_info.documents[record_name]

            if (!record) return false

            console.log(Object.keys(template.attributes).filter(function(attribute_name) {
              return !(template.attributes[attribute_name].attribute_class == "TableAttribute" || record.hasOwnProperty(attribute_name))
            }))

            return Object.keys(template.attributes).every(function(attribute_name) {
              return template.attributes[attribute_name].attribute_class == "TableAttribute" || record.hasOwnProperty(attribute_name)
            })
          })
        }
      }
    )
  },
  function(dispatch,props) {
    return {
      getModels: function() {
        dispatch(magmaActions.requestModels())
      },
      query: function(model, filter, success) {
        dispatch(magmaActions.queryDocuments(model,filter,success))
      },
      requestDocuments: function(model, record_names, success) {
        dispatch(magmaActions.requestDocuments(model,record_names,success))
      },
    }
  }
)(Search)

module.exports = Search
