import * as React from 'react';
import { capitalize } from '../utils/format';

/*
 * A component that displays a set of buttons with Font Awesome icon and a label
 * properties:
 *   className - can be passed in
 *   buttons - an array of { label, icon, click }
 */

const BUTTONS = {
  copy: {
    icon: 'fas fa-copy',
    label: 'copy'
  },
  remove: {
    icon: 'fas fa-trash-alt',
    label: 'delete'
  },
  edit: {
    icon: 'fas fa-pencil-alt',
    label: 'edit'
  },
  run: {
    icon: 'fas fa-play',
    label: 'run',
  },
  save: {
    icon: 'fas fa-save',
    label: 'save'
  },
  load: {
    icon: 'fas fa-spinner fa-pulse',
    label: 'load'
  },
  cancel: {
    icon: 'fas fa-ban',
    label: 'cancel'
  }
};

export const buttonsWithCallbacks = (types, callbacks) => types.map(
  type => {
    let click = callbacks['on'+capitalize(type)];

    return !click ? null : { type, click };
  }
).filter(button => button);

/*
 * A single button, which displays a text 'label', a Font Awesome 'icon' and
 * responds to 'click'.
 */
const BarButton = ({type,click})=>{
  let { label, icon } = BUTTONS[type];
  return <i onClick={(click instanceof Function) ? click : null }
    title={label}
    className={`${label} ${icon}`}
    aria-hidden='true'/>
};

const ButtonBar =({ className, buttons }) =>
  <div className={className}>
    {buttons.map(button => <BarButton key={button.type} {...button}/>)}
  </div>;

export default ButtonBar;
