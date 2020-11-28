import { sortAttributes } from '../utils/attributes';

export const selectView = (state, model_name) => (
  state.views
  ? state.views[model_name]
  : null
)

export const getDefaultTab = (view) => view.tabs ? view.tabs[0].name : 'default';

export const hasMagmaAttribute = item =>
  item.type == 'magma' || (item.type == 'markdown' && item.attribute_name);

export const getAttributes = ({panes})=> panes.map(
  ({items}) => items.filter(hasMagmaAttribute).map(
    item => item.attribute_name
  )
).flat();
