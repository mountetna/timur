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
