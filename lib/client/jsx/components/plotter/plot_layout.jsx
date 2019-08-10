import * as React from 'react';
import NumberInput from '../inputs/number_input';

const Spacer = () => <div style={{clear:'both'}}/>;

class PlotLayout extends React.Component{
  render(){
    let {layout, onChange} = this.props;
    let { margin, height, width } = layout;
    return(
       <div className='plot-layout-container'>
         <div>
           <label className='type-label'>Size</label>
           <NumberInput header='height' value={height} unit='px'
             onChange={ new_height => onChange({...layout, height: new_height}) } />
           <NumberInput header='width' value={width} unit='px'
             onChange={ new_width => onChange({...layout, width: new_width}) } />
         </div>
         <Spacer/>
         <div>
           <label className='type-label'>Margin</label>
           {
             ['top', 'bottom', 'left', 'right'].map(name =>
               <NumberInput key={name}
                 header={name} value={margin[name]} unit='px'
                 onChange={ new_value => onChange({...layout, margin: {...margin, [name]: new_value}}) }/>
             )
           }
         </div>
         <Spacer/>
      </div>
    );

  }
}

export default PlotLayout;
