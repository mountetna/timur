// this table viewer expects some basic inputs for the table.
// 
// records = an array of hashes with keys defined by column_name
// columns = an array describing each column, with { name, type }

TableSet = function(table) {
  this.records = table.records;
  this.model = table.model;
  this.columns = Object.keys(table.model.attributes).map(function(att_name) {
    var column = new TableColumn(table.model.attributes[att_name]);
    if (!column.shown) return null;
    return column;
  }).filter(function(column) { return column != undefined });
  return this;
}

TableColumn = function(attribute,model) {
  var self = this;

  var att_class = attribute.attribute_class.replace('Magma::','');

  this.name = attribute.name;

  this.shown = attribute.shown;
  
  this.format = function(value) {
    // this returns a plain text or number version of this attribute,
    // suitable for searching
    if (value == undefined) return "";

    switch(att_class) {
      // how to search:
      case "TableAttribute":
        return "";
      case "ForeignKeyAttribute":
        return (value || {}).identifier || "";
      case "SelectAttribute":
      case "Attribute":
        return value;
      case "DateTimeAttribute":
        var date = new Date(value);
        var hours = ('00' + date.getHours()).slice(-2);
        var minutes = ('00' + date.getMinutes()).slice(-2);
        return $.datepicker.formatDate( 'yy-mm-dd', date ) + '@' + hours + ':' + minutes;
      case "CheckboxAttribute":
        return value ? "true" : "false";
      case "DocumentAttribute":
      case "ImageAttribute":
        return value.path
      case "CollectionAttribute":
        return value.map(function(item) { return item.identifier }).join(",");
      case "IntegerAttribute":
      case "FloatAttribute":
        return value || 0;
      default:
        console.log("Couldn't find "+att_class);
        return value || "";
    }
  };

  this.render = function(record, mode) {
    // this returns a react class displaying the given value for 
    // this attribute
    
    if (att_class == "TableAttribute")
      return <div className="value"> (table) </div>;

    var AttClass = eval(att_class);

    return <AttClass record={ record } 
      model={ model }
      mode={ mode } 
      attribute={ attribute }/>
  }
};

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
                table.columns.map(function(column) {
                  return <div className="table_header">{ column.name }</div>
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
                        table.columns.map(function(column) {
                          var value = record[ column.name ];
                          var txt = column.render(record, self.props.mode);
                          return <div className="item_value"> { txt } </div>;
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
