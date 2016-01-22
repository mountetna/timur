TableAttribute = React.createClass({
  mixins: [ BaseAttribute, AttributeHelpers ],
  row_for: function(page) {
    return this.state.page_size * page;
  },
  set_page: function(page) {
    this.setState({ current_page: page });
  },
  set_filter: function(evt) {
    this.setState({ current_page: 0, filter: evt.target.value });
  },
  filter_records: function(table) {
    var self = this;
    if (!table || table.records.length == 0) return null;

    if (!this.state.filter) return table.records;

    terms = this.state.filter.split(/\s+/);

    return table.records.filter(function(record) {
      // see if it matches
      return terms.every(function(term) { 
        if (!term) return true;
        return Object.keys(table.model.attributes).some(function(att) {
          if (!table.model.attributes[att].shown) { return false; }
          if ($.type(record[att]) != "string") { return false; }
          if (record[att].match(new RegExp(term, "i"))) return true;
        });
      });
    });
  },
  render_browse: function() {
    // [ record, record ]
    // { model: {}, records: [ record, record ] }
    var self = this;
    var table = this.attribute_value();
    var records = this.filter_records(table);
    if (!records) return <div className="value"></div>;
    var pages = Math.ceil(records.length / this.state.page_size);
    return <div className="value">
             <div className="table">
              <TablePager pages={ pages } set_filter={ this.set_filter } current_page={ this.state.current_page } set_page={ this.set_page }/>
              <div className="table_item">
              {
                Object.keys(table.model.attributes).map(function(att) {
                  if (table.model.attributes[att].shown) return <div className="table_header">{ att }</div>
                })
              }
              </div>
              {
                records.slice(this.row_for(this.state.current_page), this.row_for(this.state.current_page+1)).map(
                  function(item) {
                    values = self.format_attributes(item);

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
  format_attributes: function(item) {
    var table = this.attribute_value();
    var self = this;

    values = Object.keys(table.model.attributes).map(function(att_name) {
      var att = table.model.attributes[att_name];

      if (!att.shown) return null;

      value = item[att_name];

      if (!value) return '';

      if (att.attribute_class == "Magma::TableAttribute") return <div className="value">(table)</div>;

      var AttClass = eval(att.attribute_class.replace('Magma::',''));

      return <AttClass record={ item } 
        model={ table.model }
        mode={ self.props.mode } 
        attribute={ att }/>
    }).filter(function(v) { return v != null });

    return values;
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
            <div className='search'>&#x2315;</div>
            <input className="filter" type="text" onChange={ this.props.set_filter }/>
           </div>;
  }
});
