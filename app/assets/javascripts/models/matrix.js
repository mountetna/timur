export default class Matrix {
  constructor() {
    if (arguments.length == 3) {
      this.rows = arguments[0];
      this.row_names = arguments[1];
      this.col_names = arguments[2];
    }
    else {
      this.rows = arguments[0].rows;
      this.row_names = arguments[0].row_names;
      this.col_names = arguments[0].col_names;
    }

    this.num_rows = this.rows.length;

    //validate number of col_names against columns in first row
    if (this.col_names && this.rows[0] && this.rows[0].length != this.col_names.length) {
      throw 'col_names size is different from num_cols';
    }

    //set unspecified col_names for a matrix based on first row col indexes
    if (!this.col_names) {
      if (this.rows[0]) {
        this.col_names = this.rows[0].map((_, i) => `C${i}`);
      } 
      else {
        this.col_names = [];
      }
    }

    this.num_cols = this.col_names.length;

    //validate number of row_names against number of rows
    if (this.row_names.length != this.num_rows) throw 'row_names size is different from num_rows';

    //set unspecified row names for a matrix based on row's index
    if (!this.row_names) {
      this.row_names = this.rows.map((_, i) => `R${i}`);
    }
  }

  
  row(i) {
      return this.rows[i];
  }

  col(j) {
    return this.rows.map((row) => row[j]);
  }

  index(dim,name) {
    if (dim == 'row' && this.row_names) return this.row_names.indexOf(name);
    if (dim == 'col' && this.col_names) return this.col_names.indexOf(name);
  }

  map(dim,callback) {
    if (dim == 'row') {
      return this.rows.map(
        (_, i) => callback(this.row(i), i, this.row_names[i])
      );
    }
    if (dim == 'col') {
      return this.rows[0].map(
        (_, j) => callback(this.col(j), j, this.col_names[j])
      );
    }
  }
  filter(dim, callback){
    if (dim == 'row'){
      let new_rows = [];
      let new_names = [];
      this.rows.forEach((row, index)=>{
        if(callback(row, index, this.row_names[index])){
          new_rows.push(row);
          new_names.push(this.row_names[index]);
        }
      });
      return new Matrix(new_rows, new_names, this.col_names);
    }

    if (dim == 'col') {
      let selected_cols = [];
      let new_colnames = [];
      
      for (let j = 0; j < this.num_cols; j++) {
        let col = this.col(j);
        if (callback(col, j, this.col_names[j])) {
            selected_cols.push(col);
            new_colnames.push(this.col_names[j]);
        }
      }
      // make a new matrix using selected_cols
      let col_matrix = new Matrix(selected_cols,new_colnames,this.row_names);
      return col_matrix.transpose();
    }
  }

  sort(dim,callback) {
    // return a new matrix with rows sorted by comparison criterion
    if (dim == 'row') {
      let row_sorter = this.rows.map((row,index) => ({ row, index }))
        .sort((a, b) => callback(a.row, this.row_names[a.index], b.row, this.row_names[b.index]));

      let new_rows = row_sorter.map((sorter) => this.rows[sorter.index]);
      let new_names = row_sorter.map((sorter) => this.row_names[sorter.index]);
      return new Matrix(new_rows,new_names,this.col_names);
    }
    if (dim == 'col') {
      let col_sorter = this.rows[0].map((_,index) => ({ index, col: this.col(index) }))
        .sort((a, b) => callback(a.col, this.col_names[a.index] , b.col, this.col_names[b.index]));

      let new_cols = col_sorter.map((sorter) => sorter.col);
      let new_names = col_sorter.map((sorter) => this.col_names[sorter.index]);
      let col_matrix = new Matrix(new_cols,new_names,this.row_names);
      return col_matrix.transpose();
    }
  }

  transpose() {
    return new Matrix(
      this.rows[0].map(
        (_, c) => this.rows.map((r) => r[c] ) 
      ),
      this.col_names, this.row_names
    );
  }
}
