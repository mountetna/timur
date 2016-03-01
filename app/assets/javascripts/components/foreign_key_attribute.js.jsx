ForeignKeyAttribute = React.createClass({
  render: function() {
    var link = this.props.value
    if (this.props.mode == "edit") {
      return <LinkAttributeEditor process={ this.props.process } model={ this.props.model } record={ this.props.record } attribute={ this.props.attribute }/>
    }
    if (link)  {
      return <div className="value">
              <a href={ Routes.browse_model_path(link.model,encodeURIComponent(link.identifier))}>{ link.identifier }</a>
           </div>
    }
    return <div className="value"/>
  }
})

module.exports = ForeignKeyAttribute
