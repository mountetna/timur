export const getAttributes = (tab)=>{

  // Loop down on the tab object and extract the attributes.
  let attributes = Object.keys(tab.panes).map((pane_name)=>{
    return Object.keys(tab.panes[pane_name].attributes).map((attr_name)=>{
      return tab.panes[pane_name].attributes[attr_name].name;
    });
  });

  // Flatten.
  attributes = [].concat.apply([], attributes);

  return (attributes.length <= 0) ? 'all' : attributes;
};

export const getPlotIds = (tab)=>{

  // Loop down on the tab object and extract the plot ids.
  let plot_ids = Object.keys(tab.panes).map((pane_name)=>{
    return Object.keys(tab.panes[pane_name].attributes).map((attr_name)=>{
      return tab.panes[pane_name].attributes[attr_name].plot_id;
    });
  });

  // Flatten.
  plot_ids = [].concat.apply([], plot_ids);

  // Compact.
  plot_ids = plot_ids.filter((plot_id)=>{
    if(plot_id != undefined && plot_id != null && Number.isInteger(plot_id)){
      return true;
    }
    return false;
  });

  return plot_ids;
};


/*
 * The tabs have an associated view index order. This helps us keep ordering of
 * the tabs. If you know the index order id of the tab you want you can pass it
 * in and this function will extract it for you.
 */

export const getTabByIndexOrder = (tabs, view_index)=>{
  let tab = {};

  if(Object.keys(tabs).length > 0){
    Object.keys(tabs).forEach((tab_name, index)=>{
      if(tabs[tab_name].index_order == view_index){
        tab = tabs[tab_name];
      }
    })
  }

  return tab;
};

/*
 * There is a correlation between the Timur view model attributes and the Magma
 * model attributes. When we want to render the attributes we interleave the two
 * models and then can display the totality of the information they represent. 
 * Timur view models keep the layout and order, Magma data models keep the data
 * type and editability.
 *
 * See `/app/models/view_tab.rb` over in the server code for an idea about the 
 * tab structure.
 */
export const interleaveAttributes = (tab, template)=>{

  // Loop the panes and their attributes.
  Object.keys(tab.panes).forEach((pane_name, index)=>{
    /*
     * If there are no attributes from the view/pane data then set the defaut
     * attributes from the Magma model.
     */
    let pane = tab.panes[pane_name];
    if(Object.keys(pane.attributes).length == 0){
      pane.attributes = Object.assign({}, template.attributes);
    }
    else{
      Object.keys(pane.attributes).forEach((attr_name, index)=>{
        /*
         * If there is an attribute in the Magma model that matches an attribute
         * in the Timur view pane...
         */
        if(attr_name in template.attributes){
          let view_attr = pane.attributes[attr_name];
          let tmpl_attr = template.attributes[attr_name];

          // Set the viewablity on the attribute.
          view_attr['editable'] = tmpl_attr ? true : false;

          /*
           * Loop over the template attribute properties. If the propery is
           * missing or is empty from the view attribute then set it.
           */
          for(let prop in tmpl_attr){
            if(
              !(prop in view_attr) ||
              view_attr[prop] == null ||
              view_attr[prop] == ''
            ){
              view_attr[prop] = tmpl_attr[prop];
            }
          }
        }
      });
    }
  });

  return tab;
}
