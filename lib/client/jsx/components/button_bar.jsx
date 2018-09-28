import * as React from 'react';

/*
 * A component that displays a set of buttons with Font Awesome icon and a label
 * properties:
 *   className - can be passed in
 *   buttons - an array of { label, icon, click }
 */

const BUTTONS = {
  copy: {
    icon: 'fas fa-copy',
    label: 'COPY'
  },
  remove: {
    icon: 'fas fa-trash-alt',
    label: 'DELETE'
  },
  edit: {
    icon: 'fas fa-edit',
    label: 'EDIT'
  },
  run: {
    icon: 'fas fa-play',
    label: 'RUN',
  },
  save: {
    icon: 'far fa-save',
    label: 'SAVE'
  },
  cancel: {
    icon: 'fas fa-ban',
    label: 'CANCEL'
  }
};

export default class ButtonBar extends React.Component{
  render(){
    return(
      <div className={this.props.className}>

        {this.props.buttons.map(BarButton)}
      </div>
    );
  }
};

/*
 * A single button, which displays a text 'label', a Font Awesome 'icon' and
 * responds to 'click'.
 */
const BarButton = (button)=>(
  <button key={button.type} onClick={button.click}>
    <i className={`${ BUTTONS[button.type].icon }`} aria-hidden='true'></i>
    {BUTTONS[button.type].label}
  </button>
);
