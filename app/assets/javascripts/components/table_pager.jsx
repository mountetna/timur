TablePager = React.createClass({
  rewind_page: function() {
    if (this.props.current_page > 0) this.props.set_page(this.props.current_page - 1);
  },
  advance_page: function() {
    if (this.props.current_page < this.props.pages-1) this.props.set_page(this.props.current_page + 1);
  },
  render: function() {
    var leftturn, rightturn;
    if (this.props.current_page > 0) leftturn = <div className="turner" onClick={ this.rewind_page }> &lt; </div>
    if (this.props.current_page < this.props.pages-1) rightturn = <div className="turner" onClick={ this.advance_page }> &gt; </div>
    return <div className="pager">
            { leftturn }
            { this.props.current_page + 1 } of { this.props.pages }
            { rightturn }
            <div className='search'>&#x2315;</div>
            <input className="filter" type="text" onChange={ this.props.set_filter }/>
            {
              this.props.children
            }
           </div>;
  }
});

module.exports = TablePager;
