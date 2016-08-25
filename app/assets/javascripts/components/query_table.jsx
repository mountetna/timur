
QueryTable = React.createClass({
  getInitialState: function() {
    return { new_items: [], current_page: 0, filter: "" }
  },
  row_for: function(page) {
    return this.props.page_size * page
  },
  set_page: function(page) {
    this.setState({ current_page: page })
  },
  render_browse: function() {
    var self = this
    var table = self.props.table
    var pages = Math.ceil(records.length / self.props.page_size)

    return <div className="table">
              <TablePager pages={ pages } 
                current_page={ self.state.current_page }
                set_page={ self.set_page }>
              </TablePager>
              <div className="table_item">
              {
                table.columns.map(function(column,i) {
                  return <div key={i} className="table_header">{ column.name }</div>
                })
              }
              </div>
              {
                records.slice(self.row_for(self.state.current_page),
                              self.row_for(self.state.current_page+1)).map(
                  function(record) {
                    return <div key={ record.id }
                      className="table_item">
                      {
                        table.columns.map(function(column, i) {
                          var value = record[ column.name ]
                          var txt = column.render(record, self.props.mode)
                          return <div key={i} className="item_value">{ txt }</div>
                        })
                      }
                    </div>
                  })
               }
             </div>
  },
  render: function() {
    if (this.props.mode == 'browse')
      return this.render_browse()
    else
      return this.render_edit()
  },
  render_edit: function() {
    return <div className="value">
           </div>
  }
})

module.exports = TableViewer
