import React, { Component } from 'react'

class D3ResponsiveWrapper extends Component {
  constructor(props) {
    super(props)

    this.state = {
      containerWidth: null,
    }

    this.fitParentContainer = this.fitParentContainer.bind(this)
  }

  componentDidMount() {
    this.fitParentContainer()
    window.addEventListener('resize', this.fitParentContainer)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.fitParentContainer)
  }

  fitParentContainer() {
    const { containerWidth } = this.state
    const currentContainerWidth = this.chartContainer
      .getBoundingClientRect().width

    const shouldResize = containerWidth !== currentContainerWidth

    if (shouldResize) {
      this.setState({
        containerWidth: currentContainerWidth,
      })
    }
  }

  render() {
    const {containerWidth} = this.state
    const shouldRenderChart = containerWidth !== null

    return (
      <div
        ref={(el) => { this.chartContainer = el }}
        className="Responsive-wrapper"
      >
        {shouldRenderChart && this.props.render(width={containerWidth})}
      </div>
    )
  }
}

export default D3ResponsiveWrapper