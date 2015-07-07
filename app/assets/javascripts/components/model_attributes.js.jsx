ModelAttributes = React.createClass({
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
    var class_name = this.props.attribute.attribute_class.replace('::','')
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
  }
};

MagmaAttribute = React.createClass({
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

TextAttribute = React.createClass({
  mixins: [ BaseAttribute, AttributeHelpers ],
  render_browse: function() {
    return <div className="value">
            { this.attribute_value() }
           </div>
  },
  render_edit: function() {
    return <div className="value">
            <textarea className="text_box" name={ this.value_name() } defaultValue={ this.attribute_value() } />
           </div>
  }
})

IntegerAttribute = React.createClass({
  mixins: [ BaseAttribute, AttributeHelpers ],
  render_browse: function() {
    return <div className="value">
            { this.attribute_value() }
           </div>
  },
  filter_keys: function(e) {
    console.log("blah");
    console.log(e);
    if (Keycode.is_modified(e)) return true;
    if (Keycode.is_number(e)) return true;
    if (Keycode.is_printable(e)) {
      e.preventDefault();
      return true;
    }
    return true;
  },
  render_edit: function() {
    return <div className="value">
            <input type='text' className="full_text" placeholder={this.props.attribute.placeholder} onKeyDown={ this.filter_keys } name={ this.value_name() } defaultValue={ this.attribute_value() } />
           </div>
  }
})

FloatAttribute = React.createClass({
  mixins: [ BaseAttribute, AttributeHelpers ],
  render_browse: function() {
    return <div className="value">
            { this.attribute_value() }
           </div>
  },
  filter_keys: function(e) {
    console.log("blah");
    console.log(e.key);
    console.log(e.keyCode);
    console.log(e.charCode);
    console.log(e.which);
    if (Keycode.is_ctrl(e)) return true;
    if (Keycode.is_number(e)) return true;
    if (Keycode.match(e,/^[\.e\-]$/)) return true
    if (Keycode.is_printable(e)) {
      e.preventDefault();
      return true;
    }
    return true;
  },
  render_edit: function() {
    return <div className="value">
            <input type='text' placeholder={this.props.attribute.placeholder} className="full_text" onKeyPress={ this.filter_keys } name={ this.value_name() } defaultValue={ this.attribute_value() } />
           </div>
  }
})

CheckboxAttribute = React.createClass({
  mixins: [ BaseAttribute, AttributeHelpers ],
  render_browse: function() {
    if (this.attribute_value())
      check = "yes";
    else
      check = "no";
    return <div className="value">
            { check }
           </div>
  },
  render_edit: function() {
    return <div className="value">
            <input type="hidden" name={ this.value_name() } value="0" />
            <input type="checkbox" className="text_box" name={ this.value_name() } defaultChecked={ this.attribute_value() } />
           </div>
  }
})

SelectAttribute = React.createClass({
  mixins: [ BaseAttribute, AttributeHelpers ],
  render_browse: function() {
    return <div className="value">
            { this.attribute_value() }
           </div>
  },
  render_edit: function() {
    return <div className="value">
            <select name={ this.value_name() } className="selection" defaultValue={ this.attribute_value() }>
            {
              this.props.attribute.options.map(
                function(name) {
                    return <option key={name} value={name}>{ name }</option>;
                  }
                )
            }
            </select>
           </div>
  }
})

MagmaForeignKeyAttribute = React.createClass({
  mixins: [ BaseAttribute, AttributeHelpers ],
  render_browse: function() {
    var link = this.attribute_value();
    return <div className="value">
            <a href={ Routes.browse_model_path(this.props.attribute.name,encodeURIComponent(link))}>{ link }</a>
           </div>
  },
  render_edit: function() {
    return <MagmaLinkAttributeEditor model={ this.props.model } record={ this.props.record } attribute={ this.props.attribute }/>
  }
})

MagmaChildAttribute = React.createClass({
  mixins: [ BaseAttribute, AttributeHelpers ],
  render_browse: function() {
    var link = this.attribute_value();
    return <div className="value">
            <a href={ Routes.browse_model_path(this.props.attribute.name,encodeURIComponent(link))}>{ link }</a>
           </div>
  },
  render_edit: function() {
    return <MagmaLinkAttributeEditor model={ this.props.model } record={this.props.record} attribute={ this.props.attribute }/>
  }
});

MagmaLinkAttributeEditor = React.createClass({
  mixins: [ AttributeHelpers ],
  getInitialState: function() {
    if (this.attribute_exists())
      return { mode: 'linked' };
    else
      return { mode: 'create' };
  },
  mode_handler: function(mode) {
    this.setState({mode: mode});
  },
  render: function() {
    var link = this.attribute_value();
    var contents;
    if (this.state.mode == 'linked')
      contents = <MagmaLinkUnlinker mode_handler={ this.mode_handler }>{ link }</MagmaLinkUnlinker>;
    else {
      contents = <MagmaNewLink name={ this.link_name() }/>
    }
    return <div className="value">
            { contents }
           </div>
  }
});

MagmaNewLink = React.createClass({
  render: function() {
    return <div>
             Add:
             <input type='text' className="link_text" name={ this.props.name } placeholder="New or existing ID"/> 
           </div>
  }
});
MagmaLinkUnlinker = React.createClass({
  render: function() {
    return <div>{ this.props.children } <span className="button" onClick={ this.props.mode_handler.bind(null,'create') }>Unlink</span></div>
  }
});

MagmaDocumentAttribute = React.createClass({
  mixins: [ BaseAttribute, AttributeHelpers ],
  render_browse: function() {
    if (this.attribute_exists() )
      return this.render_attribute();
    else
      return this.render_empty();
  },
  render_attribute: function() {
    return <div className="value">
            <a href={ this.attribute_value().url } > { this.attribute_value().path }</a>
           </div>
  },
  render_empty: function() {
    return <div className="value">
            <div className="document_empty">No file.</div>
           </div>
  },
  render_edit: function() {
    return <div className="value">
             <input type="file" name={ this.value_name() } />
           </div>
  }
});

MagmaImageAttribute = React.createClass({
  mixins: [ BaseAttribute, AttributeHelpers ],
  render_browse: function() {
    if (this.attribute_exists() )
      return this.render_attribute();
    else
      return this.render_empty();
  },
  render_attribute: function() {
    return <div className="value">
            <a href={ this.attribute_value().url } ><img src={ this.attribute_value().thumb }/></a>
           </div>
  },
  render_empty: function() {
    return <div className="value">
            <div className="document_empty">No file.</div>
           </div>
  },
  render_edit: function() {
    return <div className="value">
             <input type="file" name={ this.value_name() } />
           </div>
  }
});
