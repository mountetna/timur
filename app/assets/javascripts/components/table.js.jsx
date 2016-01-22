// this table viewer expects some basic inputs for the table.
// 
// records = an array of hashes with keys defined by column_name
// columns = an array describing each column, with { name, type }

TableColumn = function(attribute,model) {
  var self = this;

  this.name = attribute.name;

  this.shown = attribute.shown;
  
  this.format = function(value) {
    // this returns a plain text or number version of this attribute,
    // suitable for searching
  };

  this.render = function(record, mode) {
    // this returns a react class displaying the given value for 
    // this attribute
    
    if (attribute.attribute_class == "Magma::TableAttribute")
      return <div className="value"> (table) </div>;

    var AttClass = eval(attribute.attribute_class.replace('Magma::',''));

    return <AttClass record={ item } 
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

      return txt.match(new RegExp(term, "i"));
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
  render_browse: function() {
    var self = this;
    var table = self.props.table;
    var filter = new RecordFilter(table, self.state.filter)
    var records = filter.records();

    if (!records) return <div className="table"></div>;

    var pages = Math.ceil(records.length / self.props.page_size);

    return <div className="table">
              <TablePager pages={ pages } set_filter={ self.set_filter } current_page={ self.state.current_page } set_page={ self.set_page }/>
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
           </div>;
  }
});
