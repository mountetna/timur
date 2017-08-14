/*
 * The main graphical structure of the Timur application is a 'Tab'. A 'Tab'
 * represents a particular view of a page or data model. 
 * 
 * A 'Tab' is broken up into 'Panes' which is a graphical section of a 'Tab'.
 *
 * A 'Pane' contains 'Attributes' which are the individual data elements to be
 * rendered.
 *
 * Records that come from our Magma DB also have attributes. The Attributes in
 * the Magma DB correspond to columns in the DB. These DB attributes are
 * different that the 'Attributes' in the UI. The DB attributes have a data type
 * and the UI Attribute is selected on the DB data attribute type.
 *
 * i.e. In a patient record we have the DB attribute 'notes'. This data is
 * of a text type. When the data gets to the front end the DB attribute 
 * 'notes' uses the UI 'Attribute' 'TextAttribute'.
 */

export default class Tab{
  constructor(model_name, record_name, tab_name, config, template){
    this.name = tab_name;
    this.model_name = model_name;
    this.record_name = record_name;

    this.panes = Object.keys(config.panes).map((pane_name) =>{
      var pane = new Pane(pane_name, config.panes[pane_name], template);
      return pane;
    });
  }

  requiredAttributes(){
    if (this.panes.some((pane)=>!pane.display.length)) return 'all';

    var panes = this.panes.map((pane)=>{
      return pane.display.map((item)=>{
        return item.attribute.name;
      });
    });

    return panes.flatten();
  }

  requiredManifests(){
    var panes = this.panes.map((pane)=>{
      return pane.manifests(this.record_name);
    });

    return panes.compact().flatten();
  }
}

class Pane{
  constructor(pane_name, config, template){
    this.name = pane_name;
    this.title = config.title;

    if(config.display.length){
      this.display = config.display.map((display_item)=>{

        var template_attribute = template && template.attributes[display_item.name];
        var display_item = new DisplayItem(template_attribute, display_item.attribute);
        return display_item;
      });
    }
    else if(template){
      this.display = Object.values(template.attributes).map((template_attribute)=>{

        template_attribute = template_attribute.shown ? (new DisplayItem(template_attribute)) : null;
        return template_attribute;
      });

      this.display = this.display.compact();
    }
    else{
      this.display = [];
    }
  }

  manifests(record_name){
    var manifest = this.display.map((display_item)=>{
      return display_item.manifest(record_name);
    });

    return manifest.compact().flatten();
  }
}

class DisplayItem{
  constructor(template_attribute, display_attribute){

    this.template_attribute = template_attribute;
    this.display_attribute = display_attribute;
    this.plot = display_attribute && display_attribute.plot;
    this.attribute = {
       ...this.template_attribute,
       ...this.display_attribute
    };
  }

  editable(){
    return this.template_attribute;
  }

  manifest(record_name) {
    if (this.plot) return {
      name: this.plot.name,
      manifest: [
        [ 'record_name', `'${ record_name }'` ],
        ...this.plot.manifest
      ]
    }
  }
}
