const order = (attribute, identifierFirst) => {
  let { attribute_type } = attribute;
  let map = identifierFirst ?
    {
        identifier: 1,
        parent: 2
    } : {
        parent: 1,
        identifier: 2
    };

    map = { ...map, ...{
        collection: 3,
        table: 4,
        child: 5,
        link: 6,
        file: 7,
        image: 8
    }};
  return (map[attribute_type] || 9);
}

export const sortAttributes = (attributes, identifierFirst = false) =>
  Object.values(attributes).sort(
    (a, b) =>
      order(a, identifierFirst) - order(b, identifierFirst) || a.attribute_name.localeCompare(b.attribute_name)
  );
