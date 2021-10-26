// Framework libraries.
import * as React from 'react';

import StringAttribute from './string_attribute';
import ImageAttribute from './image_attribute';
import FileAttribute from './file_attribute';
import FileCollectionAttribute from './file_collection_attribute';
import CheckboxAttribute from './checkbox_attribute';
import DateTimeAttribute from './date_time_attribute';
import TableAttribute from './table_attribute';
import MatrixAttribute from './matrix_attribute';
import LinkAttribute from './link_attribute';
import IdentifierAttribute from './identifier_attribute';
import { IntegerAttribute, FloatAttribute } from './numeric_attribute';
import CollectionAttribute from './collection_attribute';
import ShiftedDateTimeAttribute from './shifted_date_time_attribute';

const AttributeViewer = (props) => {
  let {attribute_name, record, revision={}, model_name, template, component } = props;
  let attribute = template.attributes[attribute_name];

  if (!attribute) {
    console.error(`No such attribute ${attribute_name} in template for ${model_name}`);
    return null;
  }

  let AttributeComponent = component || {
    collection: CollectionAttribute,
    identifier: IdentifierAttribute,
    parent: LinkAttribute,
    link: LinkAttribute,
    child: LinkAttribute,
    table: TableAttribute,
    file: FileAttribute,
    file_collection: FileCollectionAttribute,
    image: ImageAttribute,
    matrix: MatrixAttribute,
    boolean: CheckboxAttribute,
    integer: IntegerAttribute,
    float: FloatAttribute,
    date_time: DateTimeAttribute,
    string: StringAttribute,
    shifted_date_time: ShiftedDateTimeAttribute
  }[attribute.attribute_type];

  if (!AttributeComponent) {
      let msg = 'Could not match attribute '+attribute.name;
      msg += ' with class '+attribute.attribute_type+' to a display class!';
      console.error(msg);
      return null;
  }

  let value = record[attribute_name];
  let revised_value = (attribute_name in revision) ?  revision[attribute_name] : record[attribute_name];

  return <AttributeComponent
    document={record}
    value={value}
    revised_value={revised_value}
    attribute={attribute}
    {...props}
  />
}

export default AttributeViewer;
