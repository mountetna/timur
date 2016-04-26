var TableSet = function(records, model) {
  this.columns = Object.keys(this.model.attributes).map(function(att_name) {
    var column = new TableColumn(this.model.attributes[att_name]);
    if (!column.shown) return null;
    return column;
  }).filter(function(column) { return column != undefined });
  return this;
}

module.exports = TableSet;
