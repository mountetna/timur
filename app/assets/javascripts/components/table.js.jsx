TableAttribute = React.createClass({
  mixins: [ BaseAttribute, AttributeHelpers ],
  row_for: function(page) {
    return this.state.page_size * page;
  },
  set_page: function(page) {
    this.setState({ current_page: page });
  },
  filter: function(evt) {
    this.setState({ filter: evt.target.value });
  },
  render_browse: function() {
    // [ record, record ]
    // { model: {}, records: [ record, record ] }
    var self = this;
    var table = this.attribute_value();
    if (!table || table.records.length == 0) return <div className="value"></div>;
    var pages = Math.ceil(table.records.length / this.state.page_size);
    return <div className="value">
             <div className="table">
              <TablePager pages={ pages } filter={ this.filter } current_page={ this.state.current_page } set_page={ this.set_page }/>
              <div className="table_item">
              {
                Object.keys(table.model.attributes).map(function(att) {
                //Object.keys(table.records[0]).map(function(att) {
                  if (table.model.attributes[att].shown) return <div className="table_header">{ att }</div>
                })
              }
              </div>
              {
                table.records.slice(this.row_for(this.state.current_page), this.row_for(this.state.current_page+1)).map(
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

   values = Object.keys(table.model.attributes).map(function(att) {

     if (!table.model.attributes[att].shown) return null;

     value = item[att];

     if (!value) return '';

     if (table.model.attributes[att].attribute_class == "Magma::TableAttribute") return value.records;

     return value;
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
            <input type="text" onChange={ this.props.filter }/>
           </div>;
  }
});
