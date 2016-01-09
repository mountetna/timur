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
            self.setState({ model_data: result });
          });
  },
  download_table_tsv: function() {
    var token = $( 'meta[name="csrf-token"]' ).attr('content');
    var url = Routes.table_path()
    var form = $('<form></form>')
      .attr('action', url)
      .attr('method', 'post');
    // Add the one key/value
    form.append($("<input></input>")
                .attr('type', 'hidden')
                .attr('name', 'authenticity_token')
                .attr('value', token));
    form.append($("<input></input>")
                .attr('type', 'hidden')
                .attr('name', 'model')
                .attr('value', this.state.selected_model));
    //send request
    form.appendTo('body').submit().remove();
  },
  set_table_name: function(e) {
    console.log(e.target.value);
    this.setState({ selected_model: e.target.value })
  },
  render_table: function() {
    if (!this.state.model_data) return null;
    return <TableViewer mode="browse" table={ this.state.model_data } page_size={ 25 }/>;
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
          disabled={ !this.state.selected_model }
          onClick={ this.get_table_json } />
        <input type="button" className="button" value="Download TSV"
          disabled={ this.state.selected_model ? false : "disabled" }
          onClick={ this.download_table_tsv }/>
        {
          this.render_table()
        }
    </div>
  }
});
