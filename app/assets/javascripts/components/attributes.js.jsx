Attributes = React.createClass({
  render: function() {
    var self = this;
    return <div id="attributes">
          {
            Object.keys(self.props.model.attributes).map(
              function(name) {
                var att = self.props.model.attributes[name]
                if (att.shown) {
                  return <AttributeRow process={ self.props.process } key={att.name} mode={self.props.mode} model={ self.props.model } record={ self.props.record } attribute={att}/>;
                }
              })
           }
        </div>
  }
});

module.exports = Attributes;
