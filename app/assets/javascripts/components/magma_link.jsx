var MagmaLink = React.createClass({
  render: function() {
    var link = this.props.link
    return <a className="link" href={ 
               Routes.browse_model_path( this.props.model,
                 encodeURIComponent(link))
             }> { link } </a>
  }
})

module.exports = MagmaLink
