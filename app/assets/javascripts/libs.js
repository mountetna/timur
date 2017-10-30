window.React    = require('react')
window.ReactDOM = require('react-dom')
window.Redux = require('redux')
window.Provider = require('react-redux').Provider
window.connect = require('react-redux').connect
window.thunk = require('redux-thunk')
window.chroma = require('chroma-js')

window.classNames = function(nameset) {
  return Object.keys(nameset).filter(function(name) {
    return name != undefined && name != null && nameset[name]
  }).join(" ")
}

Array.prototype.flatten = function() {
  return this.reduce((flat, item) => (Array.isArray(item) ? flat.concat(item.flatten()) : flat.concat(item)), [])
}

Array.prototype.compact = function() {
  return this.filter((item) => item != null)
}

Array.prototype.min = function() {
  if (this.length == 0) return NaN
  return this.reduce(function(a, b) {
    return a < b ? a : b
  })
}

Array.prototype.max = function() {
  return this.reduce(function(a, b) {
    return a > b ? a : b
  })
}
