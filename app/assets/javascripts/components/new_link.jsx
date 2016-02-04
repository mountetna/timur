NewLink = React.createClass({
  render: function() {
    return <div>
             Add:
             <input type='text' className="link_text" name={ this.props.name } placeholder="New or existing ID"/> 
           </div>
  }
});

module.exports = NewLink;
