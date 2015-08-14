MagmaTableAttribute = React.createClass({
  mixins: [ BaseAttribute, AttributeHelpers ],
  row_for: function(page) {
    return this.state.page_size * page;
  },
  set_page: function(page) {
    this.setState({ current_page: page });
  },
  render_browse: function() {
    var self = this;
    var table = this.attribute_value();
    if (!table || table.length == 0) return <div className="value"></div>;
    var pages = Math.ceil(table.length / this.state.page_size);
    return <div className="value">
             <div className="table">
              <TablePager pages={ pages } current_page={ this.state.current_page } set_page={ this.set_page }/>
              <div className="table_item">
              {
                Object.keys(table[0]).map(function(att) {
                  return <div className="table_header">{ att }</div>
                })
              }
              </div>
              {
                table.slice(this.row_for(this.state.current_page), this.row_for(this.state.current_page+1)).map(
                  function(item) {
                    values = Object.keys(item).map(function(att) {
                      return item[att];
                    });
                    return <div key={ item.id } className="table_item">
                      {
                        values.map(function(value) {
                          return <div className="item_value"> { value } </div>;
                        })
                      }
                    </div>;
                  })
               }
             </div>
           </div>
  },
  getInitialState: function() {
    return { new_items: [], page_size: 10, current_page: 0 }
  },
  render_edit: function() {
    return <div className="value">
           </div>
  }
});

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
           </div>;
  }
});
