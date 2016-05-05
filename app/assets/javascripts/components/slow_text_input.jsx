var SlowTextInput = React.createClass({
  // this is a simple wrapper that debounces text input of some sort
  getInitialState: function() {
    return { }
  },
  update: function() {
    this.props.update(this.text_input.value)
  },
  componentWillMount: function() {
    this.update = $.debounce(this.props.waitTime || 500,this.update);
  },
  render: function() {
    var self = this
    return <input type='text' 
      ref={ function(input) { self.text_input = input } }
      className={ this.props.textClassName }
      onChange={ 
        function(e) {
          self.setState({ input_value: e.target.value })
          self.update()
        }
      }
      onKeyPress={ this.props.onKeyPress }
      value={ this.state.input_value == undefined ? this.props.defaultValue : this.state.input_value }
      placeholder={ this.props.placeholder }/>
  }
})

module.exports = SlowTextInput
