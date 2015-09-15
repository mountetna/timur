VarSelect = React.createClass({
  getInitialState: function() {
    return { stain_variables: [] }
  },
  render: function() {
    return <div className="var_select">
           { this.props.name }:
            Stain:  { this.stain_select(this.props.name+'stain', Object.keys(this.props.variables)) }
            Ratio: { this.var_select(this.props.name+'1', this.state.stain_variables) } / { this.var_select(this.props.name+'2', this.state.stain_variables) } 
        </div>;
  },
  update_stain: function() {
    var node = $(React.findDOMNode(this));
    var stain = node.children('select[name='+this.props.name+'stain]').val();
    this.setState({ stain_variables: this.props.variables[stain] });
  },
  stain_select: function(name, values) {
    return <select name={ name } onChange={ this.update_stain } defaultValue="none">
      <option disabled key="none" value="none"> --- </option>
      {
        values.map(function(v) {
          return <option key={v} value={v} >{ v }</option>;
        })
      }
    </select>
  },
  var_select: function(name, values) {
    return <select name={ name }>
      {
        values.map(function(v) {
          return <option key={v.name + v.ancestry} value={ v.name +'##'+ v.ancestry} title={ v.ancestry}>{ v.name }</option>;
        })
      }
    </select>
  }
})
