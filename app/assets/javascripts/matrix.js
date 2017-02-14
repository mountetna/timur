window.Matrix = function() {
  var self = this
  var rows, rownames, colnames, coltypes

  if (arguments.length == 3) {
    rows = arguments[0]
    rownames = arguments[1]
    colnames = arguments[2]
  } else {
    rows = arguments[0].rows
    rownames = arguments[0].row_names
    colnames = arguments[0].col_names
    coltypes = arguments[0].col_types
  }

  this.num_rows = rows.length;
  this.num_cols = rows[0].length;

  if (colnames && colnames.length != this.num_cols) {
    throw "colnames size is different from num_cols";
  }
  if (rownames && rownames.length != this.num_rows) {
    throw "rownames size is different from num_rows";
  }

  this._matrix = rows;
  
  this.row = function(i) {
    // array for row i in rows
      return rows[i];
  }
  this.row_index = function(name) {
    if (rownames) return rownames.indexOf(name)
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
  this.col_index = function(name) {
    if (colnames) return colnames.indexOf(name)
  }
  this.col_type = function(j) {
    if (coltypes) return coltypes[j]
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
  this.row_sort = function(callback) {
    // return a new matrix with rows sorted by comparison criterion
    var row_sorter = rows.map(function(row,i) {
      return {
        index: i,
        row: row
      }
    }).sort(function(a, b) {
      var a_name = rownames[a.index]
      var b_name = rownames[b.index]

      return callback(a.row, a_name, b.row, b_name)
    })

    var new_rows = row_sorter.map(function(sorter) {
      return rows[sorter.index]
    })
    var new_names = row_sorter.map(function(sorter) {
      return rownames[sorter.index]
    })
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
    
    for (var j = 0; j < this.num_cols; j++) {
      var col = self.col(j);
      if (callback(col, j, self.col_name(j))) {
          selected_cols.push(col);
          new_colnames.push(self.col_name(j))
      }
    }
    // make a new matrix using selected_cols
    var col_matrix = new Matrix(selected_cols,new_colnames,rownames);
    return col_matrix.transpose();
  }
  this.formula = function( equation ) {
    // infix parse the equation and return the computed values as a vector.
  }
  this.col_sort = function(callback) {
    // return a new matrix with rows sorted by comparison criterion
    var col_sorter = rows[0].map(function(_,i) {
      return {
        index: i,
        col: self.col(i)
      }
    }).sort(function(a, b) {
      var a_name = colnames[a.index]
      var b_name = colnames[b.index]

      return callback(a.col, a_name, b.col, b_name)
    })

    var new_cols = col_sorter.map(function(sorter) {
      return sorter.col
    })
    var new_names = col_sorter.map(function(sorter) {
      return colnames[sorter.index]
    })
    var col_matrix = new Matrix(new_cols,new_names,rownames);
    return col_matrix.transpose();
  }
  this.transpose = function() {
    return new Matrix(
      rows[0].map(function (_, c) { return rows.map(function (r) { return r[c]; }); }),
      colnames, rownames
    );
  }
}
