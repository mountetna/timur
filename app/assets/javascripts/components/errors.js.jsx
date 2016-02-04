Errors = React.createClass({
  render: function() {
    if (this.props.errors.length > 0) {
      return <div id="error">
              <div id="quote">
                <svg width="31" height="21">
                  <path d="M 8,20 0,0 20,20"/>
                </svg>
              </div>
              {
                this.props.errors.map(function(error, i) {
                  return <div key={i} className="error_line">{ error }</div>;
                })
              }
             </div>;
    } else
      return <div className="error_box"></div>;
  }
});

module.exports = Errors;
