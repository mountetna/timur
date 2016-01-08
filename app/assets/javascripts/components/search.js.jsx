Search = React.createClass({
  componentDidMount: function() {
    var self = this;

    $.get( Routes.search_json_path(), function(result) {
      self.data_update(result);
    });
  },
  data_update:  function(result) {
    this.setState({ magma_models: result.magma_models })
  },
  getInitialState: function() {
    return { mode: 'search', magma_models: [] };
  },
  getTable: function() {
    $.get( Routes.table_json_path( this.state.selected_), function(result) {
    });
  },
  render: function() {
    var token = $( 'meta[name="csrf-token"]' ).attr('content');
    return <div className="search">
        <span className="label">Export</span>
        <Selector name="model"
          values={
            this.state.magma_models.map(function(model) {
              return model.name;
            })
          }
          onChange={ this.set_table_name }
          showNone="enabled"/>
        <input type="button" className="button" value="Show Table" 
          onClick={ this.getTable } />
        <input type="button" className="button" value="Download TSV"/>
    </div>
  }
});
