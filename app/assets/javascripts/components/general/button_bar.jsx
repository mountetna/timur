import * as React from 'react';

/*
 * A component that displays a set of buttons with Font Awesome icon and a label
 * properties:
 *   className - can be passed in
 *   buttons - an array of { label, icon, click }
 */
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
const BarButton = (button)=>{
  return(
    <button key={button.label} onClick={button.click}>

      <i className={`fa fa-${ button.icon }`} aria-hidden='true'></i>
      {button.label}
    </button>
  );
};
