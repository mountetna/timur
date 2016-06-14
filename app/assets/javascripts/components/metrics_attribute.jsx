var CategoryControl = React.createClass({
  render: function() {
    var self = this
    return <div className="categories">
    {
      Object.keys(this.props.categories).map(function(category) {
        var metrics = self.props.categories[category]
        
        return <div key={ category } className={ category + " category" }>
          { category }
          <div className="metrics">
          {
            metrics.map(function(metric) {
              return <div key={ metric } className="metric">
                { metric }
                </div>
            })
          }
          </div>
        </div>
      })
    }
    </div>
  }
})

var SampleMetrics = React.createClass({
  render: function() {
    var self = this
    return <div className="metrics">
    {
      Object.keys(this.props.categories).map(function(category) {
        return <CategoryMetrics key={ category } metrics={ self.props.metrics[category] }/>
      })
    }
    </div>
  }
})

var CategoryMetrics = React.createClass({
  render: function() {
    return <div className="category">
    {
      this.props.metrics.map(function(metric) {
        var klass = metric.score ? "metric good" : "metric bad"
        return <div title={metric.message} key={ metric.name } className={ klass }>
        &nbsp;
        </div>
      })
    }
    </div>
  }
})

var MetricsAttribute = React.createClass({
  render: function() {
    var categories = this.props.value.categories
    var metrics = this.props.value.metrics
    return <div className="value">
             <CategoryControl categories={ categories }/>
             <div className="metrics_view">
             {
               Object.keys(metrics).map(function(sample_name) {
                 return <SampleMetrics categories={ categories } key={ sample_name } metrics={ metrics[sample_name] }/>
               })
             }
             </div>
           </div>
  },
})

module.exports = MetricsAttribute
