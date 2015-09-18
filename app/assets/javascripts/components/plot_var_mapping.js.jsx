PlotVarMapping = React.createClass({
  getInitialState: function() {
    return { stain_variables: [] }
  },
  render_mapping: function() {
    if (!this.props.mapping) return <span>undefined</span>;
    return <span>{ this.props.mapping.stain + " " + this.props.mapping.v1.replace(/##.*/,'') + "/" + this.props.mapping.v2.replace(/##.*/,'') }</span>;
  },
  render: function() {
    console.log(this.props.mapping);
    if (this.props.mode == 'plot')
      return <div className="var_mapping">
           <span className="title">{ this.props.name } mapping</span>
           { this.render_mapping() }
        </div>;
    else
      return <div className="var_mapping edit">
             <span className="title">{ this.props.name } mapping</span>
             Type: 
             <Selector name='type' values={ [ 'Population Count', 'MFI', 'Clinical variable' ] }
                onChange={ this.update_type } 
                defaultValue={ this.props.mapping ? this.props.mapping.type : "Population Count" }/>
             Stain: 
             <Selector name='stain' values={ Object.keys(this.props.template.variables) }
                onChange={ this.update_stain }
                defaultValue={ this.props.mapping ? this.props.mapping.stain : "none" }>
               <option disabled key="none" value="none"> --- </option>
             </Selector>
             Ratio: 
             <Selector name='v1' values={ this.state.stain_variables.map(this.population_map) }
                defaultValue={ this.props.mapping ? this.props.mapping.v1 : null }
                onChange={ this.update_mapping }/>
             /
             <Selector name='v2' values={ this.state.stain_variables.map(this.population_map) }
                defaultValue={ this.props.mapping ? this.props.mapping.v2 : null }
                onChange={ this.update_mapping }/>
          </div>;
  },
  population_map: function(pop) {
    return { 
      key: pop.name + pop.ancestry,
      value: pop.name + '##' + pop.ancestry,
      text: pop.name + ' > ' + pop.ancestry.replace(/\t/g, " / ")
    }
  },
  update_stain: function(e) {
    var stain = e.target.value;
    this.setState({ stain_variables: this.props.template.variables[stain] });
    this.update_mapping();
  },
  update_mapping: function() {
    var node = $(React.findDOMNode(this));
    this.props.update_mapping(this.props.name + '_proposed', {
      type: 'population',
      stain: node.find('select[name=stain]').val(),
      v1: node.find('select[name=v1]').val(),
      v2: node.find('select[name=v2]').val()
    });
  },
})
