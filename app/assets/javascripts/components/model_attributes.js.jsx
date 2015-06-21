ModelAttributes = React.createClass({
  render: function() {
    var self = this;
    return <div id="attributes">
          {
            Object.keys(self.props.model.attributes).map(
              function(name) {
                var att = self.props.model.attributes[name]
                if (att.shown) {
                  return <AttributeRow key={att.name} mode={self.props.mode} model={ self.props.model } record={ self.props.record } attribute={att}/>;
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
            <AttClass record={ this.props.record } model={ this.props.model } mode={ this.props.mode } attribute={ this.props.attribute }/>
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
    return(this.props.record[this.props.attribute.name] != null)
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
            { this.props.record[this.props.attribute.name] }
           </div>
  },
  render_edit: function() {
    return <div className="value">
            <input type='text' className="full_text" name={ this.value_name() } defaultValue={ this.props.record[this.props.attribute.name] } />
           </div>
  }
});

TextAttribute = React.createClass({
  mixins: [ BaseAttribute, AttributeHelpers ],
  render_browse: function() {
    return <div className="value">
            { this.props.record[this.props.attribute.name] }
           </div>
  },
  render_edit: function() {
    return <div className="value">
            <textarea className="text_box" name={ this.value_name() } defaultValue={ this.props.record[this.props.attribute.name] } />
           </div>
  }
})

DateTimeAttribute = React.createClass({
  mixins: [ BaseAttribute, AttributeHelpers ],
  render_browse: function() {
    return <div className="value">
            { this.props.record[this.props.attribute.name] }
           </div>
  },
  render_edit: function() {
    return <div className="value">
            <input type='text' className="full_text" name={ this.value_name() } defaultValue={ this.props.record[this.props.attribute.name] } />
           </div>
  }
})

CheckboxAttribute = React.createClass({
  mixins: [ BaseAttribute, AttributeHelpers ],
  render_browse: function() {
    if (this.props.record[this.props.attribute.name])
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
            <input type="checkbox" className="text_box" name={ this.value_name() } defaultChecked={ this.props.record[this.props.attribute.name] } />
           </div>
  }
})

SelectAttribute = React.createClass({
  mixins: [ BaseAttribute, AttributeHelpers ],
  render_browse: function() {
    return <div className="value">
            { this.props.record[this.props.attribute.name] }
           </div>
  },
  render_edit: function() {
    return <div className="value">
            <select className="selection" defaultValue={ this.props.record[this.props.attribute.name] }>
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
    var link = this.props.record[this.props.attribute.name];
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
    var link = this.props.record[this.props.attribute.name];
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
    var link = this.props.record[this.props.attribute.name];
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
            <a href={ this.props.record[this.props.attribute.name].url } > { this.props.record[this.props.attribute.name].path }</a>
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
            <a href={ this.props.record[this.props.attribute.name].url } ><img src={ this.props.record[this.props.attribute.name].thumb }/></a>
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
