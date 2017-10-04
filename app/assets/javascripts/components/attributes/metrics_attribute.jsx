import { selectConsignment } from '../../selectors/consignment'

var CategoryControl = React.createClass({
  render: function() {
    var props = this.props
    var categories = Object.keys(props.metric_names)
    return <div className="categories">
      {
        categories.map((category) =>
          <div key={ category }
            className={ props.hidden[category] ?  "category_label hidden" : "category_label" }
            onClick={ () => props.toggleHidden(category) }>
            { category }
          </div>
        )
      }
      <div className="metrics_names">
      {
        categories.map((category) => {
          var metric_names = props.metric_names[category]
          if (props.hidden[category])
            return null
          else
            return <div className="category" key={ category }>
              {
                metric_names.map((metric_name) =>
                  <div key={ metric_name } className="metric">
                    { metric_name }
                  </div>
                )
              }
            </div>
        })
      }
      </div>
    </div>
  }
})

var RecordMetrics = React.createClass({
  render: function() {
    var categories = Object.keys(this.props.metric_names)
    return <div className="metrics">
      <div className="record_name"><MagmaLink link={this.props.record_name} model={this.props.model_name}/></div>
      {
        categories.map((category) =>
          this.props.hidden[category] ?
            null
          :
          <CategoryMetrics
            record_name={ this.props.record_name }
            key={ category }
            metrics={ this.props.metric_names[category].map(
              (metric_name) => this.props.metrics[metric_name]
            ) }/>
        )
      }
    </div>
  }
})

var Metric = React.createClass({
  render: function() {
    var metric = this.props.metric
    return <div
      className="metric_box"
      onClick={ () => this.props.showDetails() }>
      <div title={
        metric.details.length ? metric.message + " [ Click for details ]" : metric.message
      } className={ metric.score + " metric" }>
      &nbsp;
      </div>
    </div>
  }
})

Metric = connect(
  null,
  function(dispatch,props) {
    var metric = props.metric
    var details = metric.details
    return {
      showDetails: function() {
        if (details.length) {
          dispatch(
            messageActions.showMessages([
`# The test ${metric.name} on ${props.record_name} failed.
${
  metric.details.map((detail) =>
`## ${detail.title}
${
    detail.entries.map((entry) => `- ${entry}`).join("\n")
}`).join("\n")
}`
            ])
          )
        }
      }
    }
  }
)(Metric)

var CategoryMetrics = React.createClass({
  render: function() {
    return <div className="category">
    {
      this.props.metrics.map(
        (metric) => <Metric key={ metric.name } record_name={ this.props.record_name } metric={ metric }/>
      )
    }
    </div>
  }
})

var MetricsAttribute = React.createClass({
  getInitialState: function() {
    return { category_hidden: {} }
  },
  render: function() {
    var props = this.props
    var categories = props.categories
    return <div className="value">
      <CategoryControl
        hidden={ this.state.category_hidden }
        metric_names={ props.metric_names }
        toggleHidden={
          (category) => {
            this.setState({
              category_hidden: {
                ...this.state.category_hidden,
                [category]: !this.state.category_hidden[category]
              }
            })
          }
        }
      />
      <div className="metrics_view">
      {
        props.metrics.map((identifier,metric_set) => <RecordMetrics
             model_name={ props.model_name }
             record_name={ identifier }
             metric_names={ props.metric_names }
             hidden={ this.state.category_hidden }
             key={ identifier }
             metrics={ metric_set }/>
        )
      }
      </div>
    </div>
  },
})

MetricsAttribute = connect(
  function(state,props) {
    var consignment = selectConsignment(state,props.attribute.plot.name)

    var metric_names = {}
    var metrics = []
    var model_name

    if (consignment && consignment.metrics) {
      for (var metric_name in consignment.metrics.values[0]) {
        var metric = consignment.metrics.values[0][metric_name]
        metric_names = {
          ...metric_names,
          [metric.category]: [
            metric_name,
            ...(metric_names[metric.category] || [])
          ]
        }
      }

      metrics = consignment.metrics
      model_name = consignment.model_name
    }
    return {
      metrics: metrics,
      metric_names: metric_names,
      model_name: model_name
    }
  }
)(MetricsAttribute)

module.exports = MetricsAttribute
