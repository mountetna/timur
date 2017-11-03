import { connect } from 'react-redux';

import { autoColors } from '../../utils/colors'
import { selectConsignment } from '../../selectors/consignment'

var BoxPlotAttribute = React.createClass({
  render: function() {
    if (this.props.mode == "edit" || this.props.groups.length == 0)
      return <div className="value"> </div>

    return <div className="value">
      <BoxPlot
        plot={ 
          {
            width: 900,
            height: 200,
            margin: {
              left: 0,
              right: 0,
              top: 0,
              bottom: 40
            }
          }
        }
        groups={
          this.props.groups
        }
        ymin={0}
        ymax={1}
      />
    </div>
  },
})

BoxPlotAttribute = connect(
  function(state,props) {
    var consignment = selectConsignment(state,props.attribute.plot.name)

    var groups = []

    if (consignment) {
      var height = consignment.height
      var category = consignment.category

      var group_names = [ ...new Set(category.values) ]
        
      var colors = autoColors(group_names.length)
      groups = group_names.map((group_name,i) => ({
        name: group_name,
        color: colors[i],
        values: height(category.which((value) => value == group_name)).filter((v) => v != null)
      }))
    }

    return {
      groups: groups
    }
  }
)(BoxPlotAttribute)

module.exports = BoxPlotAttribute
