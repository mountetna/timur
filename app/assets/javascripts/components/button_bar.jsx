import { Component } from 'react';


const BarButton = (button) => (
  <button key={ button.label } onClick={button.click}>
    <i className={ `fa fa-${ button.icon }` } aria-hidden="true"></i>
    { button.label }
  </button>
)

export default class ButtonBar extends Component {
  render() {
    return <div className={ this.props.className }>
      {
        this.props.buttons.map(BarButton)
      }
    </div>
  }
}

