
var infix = function(expression) {
  // evaluate a properly-formed expression in infix notation
  var output = []
  var stack = []

  var cn = true
  var token
  var precedence = { "/":2, "*":2, "+":1, "-":1, "%":0 }

  if (!expression || !expression.length) return 0

  while (token=get_token(expression,cn)) {
    term = token[0]
    expression = token[1]
    is_number = token[2]

    if (is_number) {
      output.push(term)
      cn = false
    } else if (term == '(') {
      stack.push(term)
      cn = true
    } else if (term == ')') {
      cn = false
      while (stack.length && stack[stack.length-1] != '(') {
        output.push(stack.pop())
      }
      if (!stack.length) return 0
      stack.pop()
    } else {
      // you are an operator
      while (stack.length 
        && stack[stack.length-1].match(/[\+\*\-\%\/]/)
        && precedence[stack[stack.length-1]] >= precedence[term]) {
        output.push(stack.pop())
      }
      stack.push(term)
      cn = true
    }
  }

  while (stack.length) {
    if (stack[stack.length-1] == '(') {
      return 0
    }
    output.push(stack.pop())
  }

  return output
}

var get_token = function(s,cn) {
  if (!s || !s.length) return null

  // delete initial space
  s = s.replace(/^\s+/,'')
  
  var match

  // you match an operator including minus
  if (!cn && s.match(/^[\+\*\/\(\%\-\)\^]/)) {
    return [s.slice(0,1),s.slice(1),0]
  }

  // you match a number
  if (match = s.match(/^\-?[0-9]+\.?[0-9]*/)) {
    match = match[0]
    var token = s.slice(0,match.length)
    return [Number(token), s.slice(match.length),1]
  }

  // you match an operator
  if (s.match(/^[\+\*\%\/\(\-\)\^]/)) {
    return [s.slice(0,1),s.slice(1),0]
  }

  // you match a string
  if (match = s.match(/^[\w]+/)) {
    match = match[0]
    if (s.charAt(match.length) == '(') {
      var nest = 1
      var i = match.length
      while (nest) {
        if (s.charAt(++i) == '(') nest++
        if (s.charAt(i) == ')') nest--
      }
      token = s.slice(0,i)
      return [token,s.slice(i),1]
    }
    
    return [s.slice(0,match.length),s.slice(match.length),1]
  }

  return null
}

module.exports = infix 
