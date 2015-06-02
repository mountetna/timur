ModelAttributes = React.createClass({
  render: function() {
    var self = this;
    return <div id="attributes">
          {
            Object.keys(model.attributes).map(
              function(name) {
                var att = model.attributes[name]
                if (att.shown) {
                  return <AttributeRow key={att.name} mode={self.props.mode} attribute={att}/>;
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
            <AttClass mode={ this.props.mode } attribute={ this.props.attribute }/>
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
    return(record[this.props.attribute.name] != null)
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
            { record[this.props.attribute.name] }
           </div>
  },
  render_edit: function() {
    return <div className="value">
            <input type='text' className="full_text" name={ this.value_name() } defaultValue={ record[this.props.attribute.name] } />
           </div>
  }
});


MagmaForeignKeyAttribute = React.createClass({
  mixins: [ BaseAttribute, AttributeHelpers ],
  render_browse: function() {
    var link = record[this.props.attribute.name];
    return <div className="value">
            <a href={ Routes.browse_model_path(this.props.attribute.name,encodeURIComponent(link))}>{ link }</a>
           </div>
  },
  render_edit: function() {
    return <MagmaLinkAttributeEditor attribute={ this.props.attribute }/>
  }
})

MagmaChildAttribute = React.createClass({
  mixins: [ BaseAttribute, AttributeHelpers ],
  render_browse: function() {
    var link = record[this.props.attribute.name];
    return <div className="value">
            <a href={ Routes.browse_model_path(this.props.attribute.name,encodeURIComponent(link))}>{ link }</a>
           </div>
  },
  render_edit: function() {
    return <MagmaLinkAttributeEditor attribute={ this.props.attribute }/>
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
    var link = record[this.props.attribute.name];
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
            <a href={ record[this.props.attribute.name].url } > { record[this.props.attribute.name].path }</a>
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

MagmaCollectionAttribute = React.createClass({
  mixins: [ BaseAttribute, AttributeHelpers ],
  render_browse: function() {
    var self = this;
    return <div className="value">
             <div className="collection">
              {
                record[this.props.attribute.name].map(
                  function(link) {
                    return <div key={ link } className="collection_item">
                      <a href={ Routes.browse_model_path(self.props.attribute.name,encodeURIComponent(link)) }>{ link }</a>
                    </div>;
                  })
               }
             </div>
           </div>
  },
  getInitialState: function() {
    return { new_items: [] };
  },
  new_items_name: function() {
    return "link[" + this.props.attribute.name + "][]";
  },
  new_collection_item: function() {
    this.state.new_items.push({})
    this.setState({ new_items: this.state.new_items });
  },
  render_edit: function() {
    var self = this;
    return <div className="value">
             <div className="collection">
              {
                record[this.props.attribute.name].map(
                  function(link) {
                    // this thing has state, reflecting whether or not you want to delete this component
                    return <MagmaCollectionUnlink key={ link } current={ link }/>
                  })
              }
              {
                this.state.new_items.map(
                  function(link) {
                    // this thing has state, reflecting whether or not you want to delete this component
                    return <div className="collection_item"><MagmaNewLink name={ self.new_items_name() }/></div>
                  })
              }
              <div className="collection_item"><span className="button" onClick={ this.new_collection_item.bind(null) }>Add</span></div>
             </div>
           </div>
  }
});

MagmaCollectionUnlink = React.createClass({
  getInitialState: function() {
    return { mode: 'linked' };
  },
  mode_handler: function(mode) {
    this.setState({ mode: mode });
  },
  render: function() {
    if (this.state.mode == 'linked')
      return <div className="collection_item">{ this.props.current } <span className="button" onClick={ this.mode_handler.bind(null,'unlinked') }>Unlink</span></div>
    else
      return <div className="collection_item"><strike>{ this.props.current }</strike> <span className="button" onClick={ this.mode_handler.bind(null,'linked') }>Re-link</span></div>
  }
});
