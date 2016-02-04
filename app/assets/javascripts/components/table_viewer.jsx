RecordFilter = function(table,filter) {
  var terms = filter.split(/\s+/);

  this.matches_any = function(term,record) {
    return table.columns.some(function(column) {
      var value = record[ column.name ];
      var txt = column.format( value );
      if (txt.match) return txt.match(new RegExp(term, "i"));
    });
  }

  this.matches_column = function(term, record) {
    var column_format = RegExp(
      "^" +
      "([\\w]+)" + // the column name
      "([=<>~])" + // the operator
      "(.*)" +     // the rest
      "$"
    );

    var match = column_format.exec(term);

    // format ok, find column
    if (match) {
      var column_name = match[1],
        operator = match[2],
        match_txt = match[3];

      var column = table.columns.find(function(column) {
        return column.name == match[1];
      });

      // column exists, check match
      if (column) {
        // get the value
        var value = record[ column.name ];

        var txt = column.format( value );
        switch(operator) {
          case '=':
            return txt == match_txt;
          case '~':
            return txt.match(new RegExp(match_txt, "i"));
          case '<':
            return txt < match_txt;
          case '>':
            return txt > match_txt;
        }
      }
    }
    return false;
  },

  this.records = function() {
    var self = this;

    if (!table || !table.records.length) return null;

    if (!filter || !filter.length) return table.records;

    return table.records.filter(function(record) {

      // show records which match all terms
      
      return terms.every(function(term) { 
        // ignore empty terms
        if (!term.length) return true; 

        // check column restrict
        if (self.matches_column(term, record)) return true;

        if (self.matches_any(term,record)) return true;

        return false;
      });
    });
  }
};

TableViewer = React.createClass({
  getInitialState: function() {
    return { new_items: [], current_page: 0, filter: "" }
  },
  row_for: function(page) {
    return this.props.page_size * page;
  },
  set_page: function(page) {
    this.setState({ current_page: page });
  },
  set_filter: function(evt) {
    this.setState({ current_page: 0, filter: evt.target.value });
  },
  export_table: function(records) {
    // return a tsv for this thingy.
    var table = this.props.table;

    var header = table.columns.map(function(column) {
      return column.name;
    });
    var rows = records.map(function(record) {
      return table.columns.map(function(column) {
        return column.format( record[ column.name ] ).toString().replace(/\t/g,"\\t").replace(/\n/g,"\\n");
      })
    });
    var string = [ header ].concat(rows).map(function(row) {
      return row.join("\t");
    }).join("\n");
    var uri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(string);
    var link = document.createElement("a");    
    link.href = uri;
    link.style = "visibility:hidden";
    link.download = table.model.name + ".tsv";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
  render_browse: function() {
    var self = this;
    var table = self.props.table;
    var filter = new RecordFilter(table, self.state.filter)
    var records = filter.records();

    if (!records) return <div className="table"></div>;

    var pages = Math.ceil(records.length / self.props.page_size);

    return <div className="table">
              <TablePager pages={ pages } set_filter={ self.set_filter } current_page={ self.state.current_page } set_page={ self.set_page } export_table={ self.export_table }>
                <input className="export" type="button" onClick={ self.export_table.bind(this,records) } value={"\u21af TSV"}/>
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
                          var value = record[ column.name ];
                          var txt = column.render(record, self.props.mode);
                          return <div key={i} className="item_value"> { txt } </div>;
                        })
                      }
                    </div>;
                  })
               }
             </div>
  },
  render: function() {
    if (this.props.mode == 'browse')
      return this.render_browse();
    else
      return this.render_edit();
  },
  render_edit: function() {
    return <div className="value">
           </div>
  }
});

module.exports = TableViewer;
