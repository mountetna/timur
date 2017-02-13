window.React    = require('react')
window.ReactDOM = require('react-dom')
window.Redux = require('redux')
Promise = require('es6-promise').Promise
window.Provider = require('react-redux').Provider
window.connect = require('react-redux').connect
window.thunk = require('redux-thunk')
window.chroma = require('chroma-js')

window.dates = require('dates')

classNames = function(nameset) {
  return Object.keys(nameset).filter(function(name) {
    return nameset[name]
  }).join(" ")
}
