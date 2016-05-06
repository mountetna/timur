Search = React.createClass({
  getInitialState: function() {
    return { mode: 'search' };
  },
  componentDidMount: function() {
    var self = this

    this.props.getModels()
  },
  render: function() {
    var self = this

    var documents = this.props.documentsFor(this.state.selected_model)
    
    return <div id="search">
        <span className="label">Export</span>
        <Selector name="model"
          values={
            Object.keys(this.props.magma_models)
          }
          onChange={
            function(model_name) {
              self.setState({ selected_model: model_name })
            }
          }
          showNone="enabled"/>
        <input type="button" className="button" value="Show Table" 
          disabled={ !this.state.selected_model || this.state.loading_table }
          onClick={ 
            function(e) {
              self.setState({ loading_table: true });
              self.props.requestDocuments(self.state.selected_model, function(result) {
                self.setState({ loading_table: false });
              })
            }
          } />
        {
          documents ?  <TableViewer 
            mode="browse" 
            table={ TableSet( documents, this.props.templateFor(this.state.selected_model) ) }
            page_size={ 25 }/> : null
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
        documentsFor: function(model_name) {
          if (state.templates[model_name] && state.templates[model_name].documents)
          return Object.keys(state.templates[model_name].documents).map(function(key){
            return state.templates[model_name].documents[key]
          })
        },
        templateFor: function(model_name) {
          if (state.templates[model_name]) return state.templates[model_name].template
        }
      }
    )
  },
  function(dispatch,props) {
    return {
      getModels: function() {
        dispatch(magmaActions.requestModels())
      },
      requestDocuments: function(model, success) {
        dispatch(magmaActions.requestAllDocuments(model,success))
      }
    }
  }
)(Search)

module.exports = Search
