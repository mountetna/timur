React    = require('react')
ReactDOM = require('react-dom')
Redux = require('redux')
Promise = require('es6-promise').Promise
Provider = require('react-redux').Provider
connect = require('react-redux').connect
thunk = require('redux-thunk')
chroma = require('chroma-js')

dates = require('dates')

classNames = function(nameset) {
  return Object.keys(nameset).filter(function(name) {
    return nameset[name]
  }).join(" ")
}

Array.prototype.flatten = function() {
  return this.reduce(function(flat, item) {
    if (Array.isArray(item)) return flat.concat(item.flatten())
    return flat.concat(item)
  }, [])
}
