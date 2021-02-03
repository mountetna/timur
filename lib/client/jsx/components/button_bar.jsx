import * as React from 'react';
import { capitalize } from '../utils/format';
import Icon from './icon';

/*
 * A component that displays a set of buttons with Font Awesome icon and a label
 * properties:
 *   className - can be passed in
 *   buttons - an array of { label, icon, click }
 */

const BUTTONS = {
  copy: { icon: 'copy' },
  remove: { icon: 'trash-alt', label: 'delete' },
  edit: { icon: 'pencil-alt' },
  run: { icon: 'play' },
  load: { icon: 'spinner' },
  cancel: { icon: 'ban' },
  stub: { icon: 'meh-blank' }
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
const BarButton = ({type,click,title})=>{
  let { label=type, icon=type } = BUTTONS[type] || {};
  return <Icon onClick={(click instanceof Function) ? click : null }
    className={ type }
    title={title || label }
    icon={ icon }
  />
};

const ButtonBar =({ className, buttons }) =>
  <div className={className}>
    {buttons.map(button => <BarButton className={'test-bar-button-' + button.type} key={button.type} {...button}/>)}
  </div>;

export default ButtonBar;
