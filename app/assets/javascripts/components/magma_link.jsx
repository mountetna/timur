var MagmaLink = React.createClass({
  render: function(){

    var route_args = [
      PROJECT_NAME,
      this.props.model,
      encodeURIComponent(this.props.link)
    ];

    var link_props = {
      'className': 'link',
      'href': Routes.browse_model_path(...route_args)
    };

    return(
      <a {...link_props}>

        {this.props.link}
      </a>
    );
  }
});

module.exports = MagmaLink;
