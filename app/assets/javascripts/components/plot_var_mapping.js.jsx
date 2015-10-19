PlotVarMapping = React.createClass({
  getInitialState: function() {
    return { stain_variables: [], chain_state: {} }
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
             <ChainSelector 
               label="Type"
               name='type' values={ [ 'Population Count', 'MFI' ] }
               showNone="disabled"
               change={ this.update_chain } 
               chain_state={ this.state.chain_state }/>
             <ChainSelector name="stain"
               label="Stain"
               change={ this.update_chain }
               values={ this.props.template.stains }
               showNone="disabled"
               chain_state={ this.state.chain_state }/>
             {
               this.render_mapping_edit()
             }
          </div>;
  },
  update_chain: function (name,value) {
    console.log(value);
    current_chain = this.state.chain_state;
    current_chain[ name ] = value;
    this.setState({ chain_state: current_chain });
  },
  render_mapping_edit: function() {
    if (this.state.chain_state.type == 'Population Count')
      return <div style={ { display: 'inline' } }>
               <ChainSelector
                 name='v1'
                 label="Ratio"
                 depends={ ['stain'] }
                 values={ this.props.template.populations }
                 formatter={ this.population_map }
                 change={ this.update_chain }
                 chain_state={ this.state.chain_state }/>
               <ChainSelector
                 name='v2'
                 label="/"
                 depends={ ['stain'] }
                 values={ this.props.template.populations }
                 formatter={ this.population_map }
                 change={ this.update_chain }
                 chain_state={ this.state.chain_state }/>
           </div>;
    else if (this.state.chain_state.type == 'MFI')
      return <div style={ { display: 'inline' } }>
               <ChainSelector
                 name='population'
                 label="Population"
                 depends={ ['stain'] }
                 values={ this.props.template.populations }
                 formatter={ this.population_map }
                 change={ this.update_chain }
                 chain_state={ this.state.chain_state }/>
               <ChainSelector
                 name='mfi'
                 label="Intensity"
                 depends={ ['stain'] }
                 values={ this.props.template.populations }
                 formatter={ this.population_map }
                 change={ this.update_chain }
                 chain_state={ this.state.chain_state }/>
           </div>;
    return <div></div>;
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
    this.setState({ stain_variables: this.props.template.populations[stain] });
    this.props.update_mapping(this.props.name + '_proposed', {
      type: 'population',
      stain: stain,
      v1: this.population_map(this.props.template.populations[stain][0]).value,
      v2: this.population_map(this.props.template.populations[stain][0]).value
    });
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
