import { sortAttributes } from '../utils/attributes';

export const selectView = (state, model_name, template) => {
  if (!state.views) return null;

  let view = state.views[model_name]

  if (!view) return null;

  if (Object.keys(view).length == 0) return defaultView(template);

  return view;
}

const attributeItem = attribute_name => ({ type: 'magma', attribute_name });

const filterAttributes = (attributes, types, exclude=false) => Object.keys(attributes)
  .filter( attribute_name => types.includes(attributes[attribute_name].attribute_type) ? !exclude : exclude)
  .sort( (a,b) => a.localeCompare(b));

const basicView = ({attributes,identifier,parent}) => [
  {
    name: 'overview',
    panes: [
      {
        items: filterAttributes(attributes, [ 'parent' ]).concat(
          filterAttributes(attributes, [ 'link', 'collection', 'child' ])
        ).concat(
          filterAttributes(attributes, [ 'link', 'collection', 'child', 'parent', 'identifier', 'matrix', 'table' ], true)
            .filter( n => ![ 'created_at', 'updated_at' ].includes(n))
        ).map(attributeItem)
      }
    ]
  },
  {
    name: 'tables',
    panes: [
      {
        items: Object.keys(attributes).filter(
          attribute_name => [ 'matrix', 'table' ].includes(attributes[attribute_name].attribute_type)
        ).map(attributeItem)
      }
    ]
  }
];

export const defaultView = (template) => {
  if (!template) return null;

  let { attributes } = template;

  let view = { tabs: [ ] };

  let groups = Object.values(attributes).map(a => a.attribute_group).filter(_=>_);

  if (groups.length == 0) view.tabs = basicView(template);

  return view;
};

export const getDefaultTab = (view) => view.tabs ? view.tabs[0].name : 'default';

export const hasMagmaAttribute = item =>
  item.type == 'magma' || (item.type == 'markdown' && item.attribute_name);

export const getAttributes = ({panes})=> panes.map(
  ({items}) => items.filter(hasMagmaAttribute).map(
    item => item.attribute_name
  )
).flat();
