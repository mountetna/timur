const Vector = function(list_items) {
  let vector = function(idx) {
    if (Number.isInteger(idx)) return list_items[idx].value;

    if (Array.isArray(idx)) {
      return idx.map((i) => list_items[i].value);
    }

    if (typeof idx === 'string') {
      let item = list_items.find((item) => item.label == idx);
      if (item) return item.value;
      return null;
    }
  };

  vector.which = function(callback) {
    return list_items.map((item,i) => callback.call(null,item.value) ? i : null ).filter((v) => v != null);
  };

  vector.map = function(callback) {
    return list_items.map((item,i) => callback.call(null, item.label, item.value, i));
  };

  vector.values = list_items.map((item) => item.value);

  vector.labels = list_items.map((item) => item.label);

  vector.size = list_items.length;

  Object.setPrototypeOf(vector, Vector.prototype);

  return vector;
};

Object.defineProperty(
  Vector.prototype, 'length', {
    get: function() {
       return this.size;
    }
  }
);

export default Vector;
