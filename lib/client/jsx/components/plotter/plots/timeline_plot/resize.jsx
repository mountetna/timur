import React, { Component } from 'react'

class Resize extends Component {
  constructor(props) {
    super(props)

    this.state = {
      container_width: null
    }

    this.fitParentContainer = this.fitParentContainer.bind(this);
  }

  componentDidMount() {
    this.fitParentContainer();
    window.addEventListener('resize', this.fitParentContainer);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.fitParentContainer);
  }

  fitParentContainer() {
    const { container_width } = this.state;
    const current_container_width = this.chartContainer
      .getBoundingClientRect().width;

    const should_resize = container_width !== current_container_width;

    if (should_resize) {
      this.setState({
        container_width: current_container_width
      })
    }
  }

  render() {
    const {container_width} = this.state;
    const should_render_chart = container_width !== null;

    return (
      <div
        ref={(el) => { this.chartContainer = el }}
        className="resize-wrapper"
      >
        {should_render_chart && this.props.render(container_width)}
      </div>
    )
  }
}

export default Resize