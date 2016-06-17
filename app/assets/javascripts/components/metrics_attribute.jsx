var CategoryControl = React.createClass({
  render: function() {
    var self = this
    return <div className="categories">
      {
        Object.keys(this.props.categories).map(function(category) {
          return <div key={ category } className={ self.props.category_hidden[category] ?  "category_label hidden" : "category_label" }
            onClick={
              function() {
                self.props.toggleHidden(category)
              }
            } >
            { category }
          </div>
        })
      }
      <div className="metrics_names">
      {
        Object.keys(this.props.categories).map(function(category) {
          var metrics_names = self.props.categories[category]
          if (self.props.category_hidden[category])
            return null
          else
            return <div className="category" key={ category }>
              {
                metrics_names.map(function(metric) {
                  return <div key={ metric } className="metric">
                    { metric }
                    </div>
                })
              }
            </div>
        })
      }
      </div>
    </div>
  }
})

var SampleMetrics = React.createClass({
  render: function() {
    var self = this
    return <div className="metrics">
    <div className="sample_name">{ this.props.sample_name }</div>
    {
      Object.keys(this.props.categories).map(function(category) {
        if (self.props.category_hidden[category])
          return null
        else
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
        return <div key={ metric.name } className="metric_box">
          <div title={metric.message} className={ klass }>
          &nbsp;
          </div>
        </div>
      })
    }
    </div>
  }
})

var MetricsAttribute = React.createClass({
  getInitialState: function() {
    return { category_hidden: {} }
  },
  render: function() {
    var categories = this.props.value.categories
    var metrics = this.props.value.metrics
    var self = this
    return <div className="value">
             <CategoryControl category_hidden={ this.state.category_hidden } categories={ categories }
              toggleHidden={
                function(category) {
                  var new_category_hidden = {}
                  new_category_hidden[category] = !self.state.category_hidden[category]
                  self.setState({ category_hidden: freshen(self.state.category_hidden, new_category_hidden) })
                }
              } />
             <div className="metrics_view">
             {
               Object.keys(metrics).map(function(sample_name) {
                 return <SampleMetrics sample_name={ sample_name } 
                          categories={ categories }
                          category_hidden={ self.state.category_hidden }
                          key={ sample_name }
                          metrics={ metrics[sample_name] }/>
               })
             }
             </div>
           </div>
  },
})

module.exports = MetricsAttribute
