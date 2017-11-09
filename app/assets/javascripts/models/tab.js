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

const createPanes = (config, template) =>
  Object.keys(config.panes).map(
    pane_name => new Pane(pane_name, config.panes[pane_name], template)
  );

export default class Tab{
  constructor(model_name, record_name, tab_name, config, template) {
    Object.assign(this, { 
      name: tab_name, 
      model_name,
      record_name,
      panes: createPanes(config, template)
    });
  }

  requiredAttributes(){
    if (this.panes.some((pane)=>!pane.display.length)) return 'all';

    return this.panes.reduce(
      (values, pane)=> values.concat(pane.display.map((item)=> item.attribute.name )),
      []
    );
  }

  requiredManifests(){
    return this.panes.reduce(
      (values, pane) => values.concat(pane.manifests(this.record_name)),
      []
    ).filter(_=>_);
  }
}

class Pane{
  constructor(pane_name, config, template){
    this.name = pane_name;
    this.title = config.title;

    if(config.display.length){
      this.display = config.display.map((display_item)=>{

        let template_attribute = template && template.attributes[display_item.name];
        return new DisplayItem(template_attribute, display_item.attribute);
      });
    }
    else if(template){
      this.display = Object.values(template.attributes).map((template_attribute)=>{

        template_attribute = template_attribute.shown ? (new DisplayItem(template_attribute)) : null;
        return template_attribute;
      });

      this.display = this.display.filter(_=>_);
    }
    else{
      this.display = [];
    }
  }

  manifests(record_name){
    return this.display.reduce(
      (values, display_item) => values.concat(display_item.manifest(record_name)),
      []
    ).filter(_=>_);
  }
}

class DisplayItem{
  constructor(template_attribute, display_attribute){

    Object.assign(this, { 
      template_attribute, 
      display_attribute,
      plot: display_attribute && display_attribute.plot,
      attribute: {
       ...template_attribute,
       ...display_attribute
      }
    });
  }

  editable(){
    return this.template_attribute;
  }

  manifest(record_name) {
    if (!this.plot) return null;

    return {
      name: this.plot.name,
      manifest: [
        [ 'record_name', `'${ record_name }'` ],
        ...this.plot.manifest
      ]
    };
  }
}
