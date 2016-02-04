Search = React.createClass({
  getInitialState: function() {
    return { mode: 'search', magma_models: [] };
  },
  componentDidMount: function() {
    var self = this;

    $.get( Routes.search_json_path(), function(result) {
      self.setState({ magma_models: result.magma_models })
    });
  },
  get_table_json: function() {
    var self = this;
    $.get(Routes.table_json_path({ model: this.state.selected_model }),
          function(result) {
            self.setState({ model_data: result, loading_table: false });
          });
    self.setState({ loading_table: true });
  },
  set_table_name: function(e) {
    console.log(e.target.value);
    this.setState({ selected_model: e.target.value })
  },
  render_table: function() {
    if (!this.state.model_data) return null;
    var table = TableSet(this.state.model_data);
    return <TableViewer mode="browse" 
      table={ table }
      page_size={ 25 }/>;
  },
  render: function() {
    var token = $( 'meta[name="csrf-token"]' ).attr('content');
    return <div id="search">
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
          disabled={ !this.state.selected_model || this.state.loading_table }
          onClick={ this.get_table_json } />
        {
          this.render_table()
        }
    </div>
  }
});

module.exports = Search;
