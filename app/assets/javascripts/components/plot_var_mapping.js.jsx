PlotVarMapping = React.createClass({
  getInitialState: function() {
    return { stain_variables: [], chain_state: {} }
  },
  render_plot: function() {
    var pop;
    if (!this.props.current) 
      pop = <span>undefined</span>;
    else if (this.props.current.type == "Population Fraction")
      pop = <span>{ this.props.current.stain + " " + this.props.current.v1.replace(/##.*/,'') + "/" + this.props.current.v2.replace(/##.*/,'') }</span>;
    else if (this.props.current.type == "MFI")
      pop = <span>{ this.props.current.stain + " " + this.props.current.population.replace(/##.*/,'') + " " + this.props.current.mfi }</span>;
    return <div className="var_mapping">
         <span className="title">{ this.props.name } mapping</span>
         { pop }
      </div>;
  },
  render: function() {
    if (this.props.mode == 'plot')
      return this.render_plot();
    else
      return <div className="var_mapping edit">
             <span className="title">{ this.props.name } mapping</span>
             <ChainSelector 
               label="Type"
               name='type' values={ [ 'Population Fraction', 'MFI' ] }
               showNone="disabled"
               change={ this.update_chain } 
               defaultValue={ this.props.current ? this.props.current.type : null }
               chain_state={ this.state.chain_state }/>
             <ChainSelector name="stain"
               label="Stain"
               change={ this.update_chain }
               values={ this.props.template.stains }
               defaultValue={ this.props.current ? this.props.current.stain : null }
               showNone="disabled"
               chain_state={ this.state.chain_state }/>
             {
               this.render_mapping_edit()
             }
          </div>;
  },
  update_chain: function (name,value) {
    current_chain = this.state.chain_state;
    current_chain[ name ] = value;
    console.log(current_chain);
    this.setState({ chain_state: current_chain });
    this.props.update_query(this.props.name, current_chain);
  },
  render_mapping_edit: function() {
    if (this.state.chain_state.type == 'Population Fraction')
      return <div style={ { display: 'inline' } }>
               <ChainSelector
                 name='v1'
                 label="Ratio"
                 depends={ ['stain'] }
                 values={ this.props.template.populations }
                 formatter={ this.population_map }
                 showNone="disabled"
                 change={ this.update_chain }
                 defaultValue={ this.props.current ? this.props.current.v1 : null }
                 chain_state={ this.state.chain_state }/>
               <ChainSelector
                 name='v2'
                 label="/"
                 depends={ ['stain'] }
                 showNone="disabled"
                 values={ this.props.template.populations }
                 defaultValue={ this.props.current ? this.props.current.v2 : null }
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
                 values={ this.props.template.mfis }
                 change={ this.update_chain }
                 defaultValue={ this.props.current ? this.props.current.population : null }
                 showNone="disabled"
                 formatter={ this.mfi_map }
                 chain_state={ this.state.chain_state }/>
               <ChainSelector
                 name='mfi'
                 label="Intensity"
                 depends={ ['stain', 'population' ] }
                 values={ this.props.template.mfis }
                 showNone="disabled"
                 defaultValue={ this.props.current ? this.props.current.mfi : null }
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
  mfi_map: function(pop) {
    [name,ancestry] = pop.split(/##/)
    return {
      key: name + ancestry,
      value: name + '##' + ancestry,
      text: name + ' > ' + ancestry.replace(/\t/g, " / ")
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
