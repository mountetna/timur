const order = ({attribute_type}) =>
  ({
    parent: 1,
    identifier: 2,
    collection: 3,
    table: 4,
    child: 5,
    link: 6,
    file: 7,
    image: 8
  }[attribute_type] || 9);

export const sortAttributes = (attributes) =>
  Object.values(attributes).sort(
    (a, b) =>
      order(a) - order(b) || a.attribute_name.localeCompare(b.attribute_name)
  );
