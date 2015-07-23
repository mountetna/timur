MagmaCollectionAttribute = React.createClass({
  mixins: [ BaseAttribute, AttributeHelpers ],
  render_browse: function() {
    var self = this;
    return <div className="value">
             <div className="collection">
              {
                this.attribute_value().map(
                  function(link) {
                    var summary;
                    if (link.summary)
                      summary = <span> - { link.summary }</span>;
                    return <div key={ link.identifier } className="collection_item">
                      <a href={ Routes.browse_model_path(self.props.attribute.name,encodeURIComponent(link.identifier)) }>{ link.identifier }</a>
                      { summary }
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
  remove_name: function() {
    return "unlink[" + this.props.attribute.name + "][]";
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
                this.attribute_value().map(
                  function(link) {
                    return <MagmaCollectionUnlink key={ link.identifier } process={ self.props.process } name={ self.remove_name() } current={ link.identifier }/>
                  })
              }
              {
                this.state.new_items.map(
                  function(link) {
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
    var val = {};
    if (mode == 'unlinked')
      val[ this.props.current ] = true;
    else
      val[ this.props.current ] = null;
    this.props.process('form-token-update', { name: this.props.name, value: val });
    this.setState({ mode: mode });
  },
  render: function() {
    if (this.state.mode == 'linked')
      return <div className="collection_item">{ this.props.current } </div>
    else
      return <div className="collection_item"><strike>{ this.props.current }</strike> <span className="button" onClick={ this.mode_handler.bind(null,'linked') }>Re-link</span></div>
  }
});
