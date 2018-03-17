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

  // Loop down on the tab object and extract the manifest ids.
  let plot_ids = Object.keys(tab.panes).map((pane_name)=>{
    return Object.keys(tab.panes[pane_name].attributes).map((attr_name)=>{
      return tab.panes[pane_name].attributes[attr_name].plot_ids;
    });
  });

  // Flatten.
  plot_ids = [].concat.apply([], plot_ids);

  // Compact.
  plot_ids = plot_ids.filter((item)=>{
    return (item == undefined || item == null) ? false : true;
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
          let view_attribute = pane.attributes[attr_name];
          let template_attribute = template.attributes[attr_name];

          /*
           * First we need to manually set the 'attribute_class' of the
           * view attribute since we don't want it to be over written in the
           * object interleave.
           */
          if(view_attribute.attribute_class == null){
            view_attribute.attribute_class = template_attribute.attribute_class;
          }

          // Interleave the attribute properties and set it back on the pane.
          pane.attributes[attr_name] = Object.assign(
            {},
            template_attribute,
            view_attribute
          );
        }
      });
    }
  });

  return tab;
}
