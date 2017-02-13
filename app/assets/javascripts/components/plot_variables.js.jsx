var PlotVariables = React.createClass({
  getInitialState: function() {
    return { mode: 'plot' }
  },
  render: function() {
    var self = this;
    return <div className="variables">
      <Header mode={ this.state.mode } handler={ this.header_handler } can_edit={ true }>
        Saved Variables
      </Header>
      {
        this.render_edit()
      }
    </div>;
  },
  render_edit: function() {
    var self = this;
    if (this.state.mode == 'plot') return null;

    return <div>
             <div className="var_list">
               <div className="title">
               Series
               <input type="button" value="Add" onClick={ this.props.create.bind(null,'series') }/>
               </div>
               {
                 Object.keys(this.props.saves.series).map(function(key) {
                   series = self.props.saves.series[key];
                   return <PlotSeries 
                     update={ self.props.update }
                     key={ key }
                     current={ series }
                     template={ self.props.template } />
                 })
               }
             </div>
             <div className="var_list">
               <div className="title">
                Mappings
                <input type="button" value="Add" onClick={ this.props.create.bind(null,'mappings') }/>
               </div>
               {
                 Object.keys(this.props.saves.mappings).map(function(key) {
                   mappings = self.props.saves.mappings[key];
                   return <PlotVarMapping update_query={ self.update_query }
                     key={ key }
                     update={ self.props.update }
                     current={ mappings }
                     template={ self.props.template } />
                 })
               }
             </div>
           </div>;
  },
  header_handler: function(action) {
    if (action == 'cancel') this.setState({mode: 'plot'});
    else if (action == 'approve') {
      this.update_saves()
      this.setState({mode: 'submit'});
    }
    else if (action == 'edit') this.setState({mode: 'edit'});
  },
  update_saves: function() {
    var self = this;
    $.post( Routes.update_saves_path(), { saves: this.props.saves }, function(result) {
      self.setState({ mode: 'plot', });
    });
  }
});

module.exports = PlotVariables;
