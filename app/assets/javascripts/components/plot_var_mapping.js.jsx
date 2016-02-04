PlotVarMapping = React.createClass({
  getInitialState: function() {
    return { stain_variables: [], chain_state: {} }
  },
  render: function() {
    if (this.props.mode == 'plot')
      return <div></div>;
    else
      return <div className="var_mapping edit">
              <div className="name option_box">
                <span className="label">Name</span>
                <input type="text" onChange={ this.update_name } defaultValue={ this.props.current ? this.props.current.name : 'mapping' }/>
              </div>
             <ChainSelector 
               label="Type"
               name='type' values={ [ 'Population Fraction', 'MFI' ] }
               showNone="disabled"
               change={ this.update_chain } 
               defaultValue={ this.props.current ? this.props.current.type : null }
               chain_state={ this.props.current }/>
             <ChainSelector name="stain"
               label="Stain"
               change={ this.update_chain }
               values={ this.props.template.stains }
               defaultValue={ this.props.current ? this.props.current.stain : null }
               showNone="disabled"
               chain_state={ this.props.current }/>
             {
               this.render_mapping_edit()
             }
            <div className='close' onClick={ this.props.update.bind(null,'mappings', this.props.current.key, 'remove') } className="close">&#x274c;</div>
          </div>;
  },
  update_name: function(evt) {
    this.props.update('mappings', this.props.current.key, 'name', evt.target.value);
  },
  update_chain: function (name,value) {
    this.props.update('mappings', this.props.current.key, name, value)
  },
  render_mapping_edit: function() {
    if (this.props.current.type == 'Population Fraction')
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
                 chain_state={ this.props.current }/>
               <ChainSelector
                 name='v2'
                 label="/"
                 depends={ ['stain'] }
                 showNone="disabled"
                 values={ this.props.template.populations }
                 defaultValue={ this.props.current ? this.props.current.v2 : null }
                 formatter={ this.population_map }
                 change={ this.update_chain }
                 chain_state={ this.props.current }/>
           </div>;
    else if (this.props.current.type == 'MFI')
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
                 chain_state={ this.props.current }/>
               <ChainSelector
                 name='mfi'
                 label="Intensity"
                 depends={ ['stain', 'population' ] }
                 values={ this.props.template.mfis }
                 showNone="disabled"
                 defaultValue={ this.props.current ? this.props.current.mfi : null }
                 change={ this.update_chain }
                 chain_state={ this.props.current }/>
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
})

module.exports = PlotVarMapping;
