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

export const getPlotIds = (tab)=>{
  let { panes } = tab;

  // Loop down on the tab object and extract the manifest ids.
  let plot_ids = Object.values(panes).reduce(
    ({attributes})=> Object.values(attributes).map(attr=>attr.plot_ids)
  );

  // Flatten.
  plot_ids = [].concat.apply([], plot_ids);

  // Compact.
  plot_ids = plot_ids.filter(item=>(item != undefined && item != null));

  return plot_ids;
};
