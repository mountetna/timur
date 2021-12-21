import { sortAttributes } from '../utils/attributes';
import { defaultMemoize } from 'reselect';

export const selectView = (state, model_name, template) => {
  if (!state.views) return null;

  let view = state.views[model_name]

  if (!view) return null;

  if (Object.keys(view).length == 0) return defaultView(template);

  return view;
}

const attributeItem = attribute_name => ({ type: 'magma', attribute_name });

const filterAttributes = (attributes, types, exclude=false) => Object.keys(attributes)
  .filter( attribute_name => !attributes[attribute_name].hidden && (!types || types.includes(attributes[attribute_name].attribute_type) ? !exclude : exclude))
  .sort( (a,b) => a.localeCompare(b));

const overviewItems = (attributes, others=[]) => filterAttributes(attributes, [ 'parent' ]).concat(
          filterAttributes(attributes, [ 'link', 'collection', 'child' ])
        ).concat(
          filterAttributes(attributes, [ 'link', 'collection', 'child', 'parent', 'identifier' ].concat(others), true)
        ).map(attributeItem)

const basicView = ({attributes}) => {
  let overview = {
    name: 'overview',
    panes: [
      {
        items: overviewItems(attributes, [ 'matrix', 'table' ])
      }
    ]
  };

  let tables = {
    name: 'tables',
    panes: [
      {
        items: Object.keys(attributes).filter(
          attribute_name => [ 'matrix', 'table' ].includes(attributes[attribute_name].attribute_type)
        ).map(attributeItem)
      }
    ]
  }

  return [ overview, tables ].filter( t => t.panes[0].items.length)

};

const groupView = ({attributes}) => {
  let groups = Object.keys(attributes).reduce(
    (groups, attribute_name) => {
      let { attribute_group='overview', attribute_type } = attributes[attribute_name];

      if (attribute_type == 'parent') attribute_group = 'overview';

      if (attribute_type != 'identifier') {
        if (!groups[attribute_group]) groups[attribute_group] = {};
        groups[attribute_group][ attribute_name ] = attributes[attribute_name];
      }

      return groups;
    }, {}
  );

  return Object.keys(groups).sort(
    (g1, g2) => g1 == 'overview' ? -1 : g2 == 'overview' ? 1 : g1.localeCompare(g2)
  ).map( group => ({
    name: group,
    panes: [
      {
        items:  group == 'overview' ? overviewItems(groups[group]) : filterAttributes(groups[group]).map(attributeItem)
      }
    ]
  }));
}

export const defaultView = defaultMemoize(
  (template) => {
    if (!template) return null;

    let view = { tabs: [ ] };

    let groups = Object.values(template.attributes).map(a => a.attribute_group).filter(_=>_);

    if (groups.length == 0) view.tabs = basicView(template);
    else view.tabs = groupView(template);

    return view;
  }
);

export const getDefaultTab = (view) => view && view.tabs ? view.tabs[0].name : 'default';

export const hasMagmaAttribute = item =>
  item.type == 'magma' || (item.type == 'markdown' && item.attribute_name) || (item.type == 'image' && item.attribute_name);

export const getAttributes = ({panes})=> panes.map(
  ({items}) => items.filter(hasMagmaAttribute).map(
    item => item.attribute_name
  )
).flat();
