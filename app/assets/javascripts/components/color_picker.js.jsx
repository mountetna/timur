ColorPicker = React.createClass({
  render: function() {
    return <div className="color_picker">
             <span className="label">{ this.props.label }</span>
             <input type='text'/>
           </div>
  },

  componentDidMount: function () {
    var picker = ".color_picker input[type=text]"

    console.log("Adding color_picker");
    var self = this;
    $(picker).spectrum({
      color: "dodgerblue",
      showAlpha: true,
      change: function(color) {
        self.props.onChange(color);
      }
    });
  }
});
