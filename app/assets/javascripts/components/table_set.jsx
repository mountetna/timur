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

module.exports = TableSet;
