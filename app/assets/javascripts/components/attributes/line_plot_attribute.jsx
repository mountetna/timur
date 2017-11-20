// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

// Class imports.
import LinePlot from '../plots/line_plot';

// Module imports.
import {autoColors} from '../../utils/colors';
import {selectConsignment} from '../../selectors/consignment';

export class LinePlotAttribute extends React.Component{
  constructor(props){
    super(props);
  }

  render(){

    let {mode, lines} = this.props;
    let line_null = lines.some((line)=>{return line == null});

    // Return an empty value if the data is not there or in edit mode.
    if(mode == 'edit' || lines.length == 0 || line_null){
      return <div className='value'></div>;
    }

    let line_plot_props = {
      ylabel: 'sample count',
      xlabel: '',
      plot: {
        width: 600,
        height: 200,
        margin: {left: 60, right: 90, top: 10, bottom: 40}
      },
      lines
    };

    return(
      <div className='value'>

        <LinePlot {...line_plot_props} />
      </div>
    );
  }
}

const mapStateToProps = (state = {}, own_props)=>{

  var consignment = selectConsignment(state, own_props.attribute.manifest_id)

    var lines = [];

    if (consignment && consignment.lines) {
      var colors = autoColors(consignment.lines.size)
      lines = consignment.lines.map(
        (label, line, i) => ({
          label: label,
          color: colors[i],
          points: line("x").map((identifier, x_val, j) => ({
            label: identifier,
            x: x_val,
            y: line("y")(j)
          })).filter((point) => point.x != null && point.y != null)
        })
      )
    }

    return {lines}
};

const mapDispatchToProps = (dispatch, own_props)=>{
  return own_props;
};

const LinePlotAttributeContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(LinePlotAttribute);

export default LinePlotAttributeContainer;
