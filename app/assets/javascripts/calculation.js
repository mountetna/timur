// return a vector that results from the column-wise operation on matrix
var Calculation = function(matrix, equation) {
  var vector_values = function(symbol) {
    // first, numbers simply become numbers
    if (typeof symbol == "number") return matrix.map_row(function(row) {
      return symbol
    })

    // then, special cases are handled
    if (symbol == "row_name") return matrix.map_row(function(row,i, row_name) {
      return row_name
    })

    if (symbol == "row_number") return matrix.map_row(function(row,i, row_name) {
      return i
    })

    // now we look for columns
    var column = matrix.col_index(symbol)
    if (column == -1) return rows.map(function(row) {
      return null
    })

    // convert column types, which Matrix does not do
    return matrix.col(column).map(function(value) {
      var type = matrix.col_type(column)
      if (type == "DateTime")
        return new Date(value)
      else
        return value
    })
  }
  
  this.value = function() {
    var input = infix(equation)
    var stack = []

    input.forEach(function(item) {
      if ( (typeof item == 'string' || item instanceof String) 
          && item.match(/[\+\*\-\%\/\^]/)) {
        var x1 = stack.pop()
        var x2 = stack.pop()
        var calc_vector = matrix.map_row(function(row, i) {

          // missing information should be emphasized
          if (x1[i] == null || x2[i] == null) return null

          // then deal with non-numbers
          if (typeof(x1[i]) != "number" || typeof(x2[i]) != "number") return NaN
          if (item  == '*') return (x2[i]*x1[i])
          if (item  == '/') return (x2[i]/x1[i])
          if (item  == '+') return (x2[i]+x1[i])
          if (item  == '-') return (x2[i]-x1[i])
          if (item  == '%') return (x2[i]%x1[i])
          if (item  == '^') return (Math.pow(x2[i],x1[i]))
        })
        stack.push(calc_vector)
      } else {
        stack.push(vector_values(item))
      }
    })

    return stack[0]
  }

  return this
}

module.exports = Calculation
