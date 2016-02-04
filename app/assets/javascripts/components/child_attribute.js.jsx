
ChildAttribute = React.createClass({
  mixins: [ BaseAttribute, AttributeHelpers ],
  render_browse: function() {
    var link = this.attribute_value();
    var uri;
    if (link) uri = <a href={ Routes.browse_model_path(link.model,encodeURIComponent(link.identifier))}>{ link.identifier }</a>;
    return <div className="value">
            { uri }
           </div>
  },
  render_edit: function() {
    return <LinkAttributeEditor process={ this.props.process } hide_unlink={ true } model={ this.props.model } record={this.props.record} attribute={ this.props.attribute }/>
  }
});

module.exports = ChildAttribute;
