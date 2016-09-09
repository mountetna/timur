Pager = React.createClass({
  rewind_page: function() {
    if (this.props.current_page > 0) this.props.set_page(this.props.current_page - 1);
  },
  advance_page: function() {
    if (this.props.current_page < this.props.pages-1) this.props.set_page(this.props.current_page + 1);
  },
  render: function() {
    var leftturn = <span className="turner inactive fa fa-chevron-left"/>
    var rightturn = <span className="turner inactive fa fa-chevron-right"/>
    if (this.props.current_page > 0) 
      leftturn = <span className="turner active fa fa-chevron-left"
        onClick={ this.rewind_page }/>
    if (this.props.current_page < this.props.pages-1)
      rightturn = <span className="turner active fa fa-chevron-right" 
        onClick={ this.advance_page }/>
    return <div className="pager">
            { leftturn }
            <div className="report">
              Page { this.props.current_page + 1 } of { this.props.pages }
            </div>
            { rightturn }
            {
              this.props.children
            }
           </div>;
  }
});

module.exports = Pager
