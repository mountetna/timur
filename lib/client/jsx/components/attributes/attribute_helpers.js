
let AttributeHelpers = {
  attribute_exists: function() {
    return(this.attribute_value() != null);
  },
  attribute_value: function() {
    return(this.props.record[this.props.attribute.name]);
  },
  value_name: function() {
    return 'values[' + this.props.attribute.name + ']';
  },
  link_name: function() {
    return 'link[' + this.props.attribute.name + ']';
  },
  unlink_name: function() {
    return 'unlink[' + this.props.attribute.name + ']';
  }
};

export default AttributeHelpers;
