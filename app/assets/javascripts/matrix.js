Matrix = function(rows, rownames, colnames) {
  var num_rows = rows.length;
  var num_cols = rows[0].length;

  this._matrix = rows;
  
  this.row = function(i) {
    // array for row i in rows
      return rows[i];
  }
  this.row_name = function(i) {
    // if rownames is empty, R1, R2, etc.
      if (rownames){
          return rownames[i];
      }
      else{
          return "R" + i;
      }
  }
  this.col = function(j) {
    // this iterates over rows and returns an array of the jth elements
      return rows.map(function(row){ return row[j]; })
  }
  this.col_name = function(j) {
   // ibid
      if (colnames){
          return colnames[j];
      }
      else {
          return "C" + j;
      }
  }
  this.map_row = function(callback) {
    var self = this;
    return rows.map(function (_, c) {
      return callback(self.row(c), c, self.row_name(c));
    });
  }
  this.row_filter = function(callback) {
    // new matrix of rows that return 'true' when callback is called
    // the callback function receives: row (array), i (integer), name (string)
    var new_rows = [];
    var new_names = [];
    var self = this;
    rows.forEach(function(row,i) {
      var name = self.row_name(i);
      if (callback(row,i,name)){
          new_rows.push(row); 
          new_names.push(name);
      }        
    });
    return new Matrix(new_rows,new_names,colnames);
  }
  this.map_col = function(callback) {
    var self = this;
    return rows[0].map(function (_, c) {
      return callback(self.col(c), c, self.col_name(c));
    });
  }
  this.col_filter = function(callback) {
    // new matrix of all columns that return 'true' when callback is called
    // callback receives: col (array), i (integer), name (string)
    var selected_cols = [];
    var new_colnames = [];
    
    for (var j = 0; j < num_cols; j++) {
      var col = this.col(j);
      if (callback(col, j, this.col_name(j))) {
          selected_cols.push(col);
          new_colnames.push(this.col_name(j))
      }
    }
    // make a new matrix using selected_cols
    var col_matrix = new Matrix(selected_cols,new_colnames,rownames);
    return col_matrix.transpose();
  }
  this.transpose = function() {
    return new Matrix(
      rows[0].map(function (_, c) { return rows.map(function (r) { return r[c]; }); }),
      colnames, rownames
    );
  }
}
