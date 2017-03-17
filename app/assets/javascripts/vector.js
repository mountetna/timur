
var Vector = function(list_items) {
  
  var vector = function(idx) {
    if (Number.isInteger(idx)) return list_items[idx].value

    if (Array.isArray(idx)) {
      return idx.map((i) => list_items[i].value)
    }

    if (typeof idx === 'string') {
      var item = list_items.find((item) => item.label == idx)
      if (item) return item.value
      return null
    }
  }

  vector.which = function(callback) {
    return list_items.map((item,i) => callback.call(null,item.value) ? i : null ).filter((v) => v != null)
  }

  vector.map = function(callback) {
    return list_items.map((item,i) => callback.call(null, item.label, item.value, i))
  }

  vector.values = list_items.map((item) => item.value)

  vector.labels = list_items.map((item) => item.label)

  vector.size = list_items.length

  return vector
}

module.exports = Vector
