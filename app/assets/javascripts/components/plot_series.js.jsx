var PlotSeries = React.createClass({
  getInitialState: function() {
    return { chain_state: {} }
  },
  render: function() {
    var self = this;
    if (this.props.mode == 'plot')
      return <div></div>;
    else {
      return <div className="series edit">
            <div className="name option_box">
              <span className="label">Name</span>
              <input type="text" onChange={ this.update_name } defaultValue={ this.props.current ? this.props.current.name : 'series' }/>
            </div>
            <ColorPicker label="Color" defaultValue={ this.props.current ? this.props.current.color : 'dodgerblue' } onChange={ this.update_color }/>
            <ChainSelector name="indication"
                label="Indication"
                change={ this.update_chain }
                values={ this.props.template.indications }
                showNone="disabled"
                defaultValue={ this.props.current ? this.props.current.indication : null }
                chain_state={ this.props.current }/>
            <ChainSelector
                name="clinical_name"
                label="Clinical Variable"
                depends={ [ "indication" ] }
                values={ this.props.template.clinicals }
                change={ this.update_chain }
                defaultValue={ this.props.current ? this.props.current.clinical_name : null }
                showNone="enabled"
                chain_state={ this.props.current } />
            <ChainSelector
                name="clinical_value"
                label="Value"
                showNone="disabled"
                depends={ [ "indication", "clinical_name" ] }
                values={ this.props.template.clinicals }
                defaultValue={ this.props.current ? this.props.current.clinical_value : null }
                change={ this.update_chain }
                chain_state={ this.props.current } />
            <div className='close' onClick={ this.props.update.bind(null,'series', this.props.current.key, 'remove') } className="close">
            <span className="fa fa-times-circle"/>
            </div>
          </div>;
    }
  },
  update_name: function(evt) {
    this.props.update('series', this.props.current.key, 'name', evt.target.value);
  },
  update_color: function(color) {
    this.props.update('series', this.props.current.key, 'color', color.toRgbString());
  },
  update_chain: function(name, value) {
    this.props.update('series', this.props.current.key, name, value)
  }
})

module.exports = PlotSeries;
