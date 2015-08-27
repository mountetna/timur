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

AttributeRow = React.createClass({
  attribute_class: function() {
    var class_name = this.props.attribute.attribute_class.replace('Magma::','')
    return eval(class_name);
  },
  render: function() {
    var AttClass = this.attribute_class();
    return <div className="attribute">
            <div className="name" title={ this.props.attribute.desc }>
             { this.props.attribute.display_name }
            </div>
            <AttClass process={ this.props.process } record={ this.props.record } model={ this.props.model } mode={ this.props.mode } attribute={ this.props.attribute }/>
           </div>
  }
});

BaseAttribute = {
  render: function() {
    if (this.props.mode == 'browse')
      return this.render_browse();
    else
      return this.render_edit();
  }
}
AttributeHelpers = {
  attribute_exists: function() {
    return(this.attribute_value() != null)
  },
  attribute_value: function() {
    return(this.props.record[this.props.attribute.name]);
  },
  value_name: function() {
    return "values[" + this.props.attribute.name + "]";
  },
  link_name: function() {
    return "link[" + this.props.attribute.name + "]";
  },
  unlink_name: function() {
    return "unlink[" + this.props.attribute.name + "]";
  }
};

Attribute = React.createClass({
  mixins: [ BaseAttribute, AttributeHelpers ],
  render_browse: function() {
    return <div className="value">
            { this.attribute_value() }
           </div>
  },
  render_edit: function() {
    return <div className="value">
            <input type='text' className="full_text" placeholder={ this.props.attribute.placeholder } name={ this.value_name() } defaultValue={ this.attribute_value() } />
           </div>
  }
});

LinkAttributeEditor = React.createClass({
  mixins: [ AttributeHelpers ],
  getInitialState: function() {
    if (this.attribute_exists())
      return { mode: 'linked' };
    else
      return { mode: 'create' };
  },
  mode_handler: function(mode) {
    if (mode == 'unlink') {
      this.setState({mode: 'create'});
      this.props.process('form-token-update', { name: this.unlink_name(), value: true });
    }
    else
      this.setState({mode: mode});
  },
  render: function() {
    var link = this.attribute_value();
    var contents;
    if (this.state.mode == 'linked')
      if (this.props.hide_unlink)
        contents = <div>{ link.identifier } </div>;
      else
        contents = <LinkUnlinker mode_handler={ this.mode_handler }>{ link.identifier }</LinkUnlinker>;
    else {
      contents = <NewLink name={ this.link_name() }/>
    }
    return <div className="value">
            { contents }
           </div>
  }
});

NewLink = React.createClass({
  render: function() {
    return <div>
             Add:
             <input type='text' className="link_text" name={ this.props.name } placeholder="New or existing ID"/> 
           </div>
  }
});

LinkUnlinker = React.createClass({
  render: function() {
    return <div>{ this.props.children } <span className="button" onClick={ this.props.mode_handler.bind(null,'unlink') }>Unlink</span></div>
  }
});


