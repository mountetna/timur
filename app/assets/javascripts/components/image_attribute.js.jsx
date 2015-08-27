
ImageAttribute = React.createClass({
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
