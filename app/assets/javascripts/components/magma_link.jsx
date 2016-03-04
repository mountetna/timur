var MagmaLink = React.createClass({
  render: function() {
    var link = this.props.link
    return <a className="link" href={ 
               Routes.browse_model_path( link.model,
                 encodeURIComponent(link.identifier))
             }> { link.identifier } </a>
  }
})
MagmaLink.propTypes = {
  link: React.PropTypes.object.isRequired
};

module.exports = MagmaLink
