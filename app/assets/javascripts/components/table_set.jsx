var TableSet = function(documents, template) {
  this.records = documents
  this.model = template
  this.columns = Object.keys(template.attributes).map(function(att_name) {
    var column = new TableColumn(template.attributes[att_name]);
    if (!column.shown) return null;
    return column;
  }).filter(function(column) { return column != undefined });
  return this;
}

module.exports = TableSet;
