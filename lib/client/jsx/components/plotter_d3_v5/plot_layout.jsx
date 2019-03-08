import * as React from 'react';

const LayoutInput = ({header, value, onChange}) =>
  <div className='pl-group' key={`${header}`}>
    <label className='sub-label'>{header}</label>
    <input
      className='pl-input'
      onChange={(e) => onChange(e.target.value)} 
      value={value}
      type='number'
      min='0'/>
      <span className='unit'>px</span>
  </div>;

const Spacer = () => <div style={{clear:'both'}}/>;

class PlotLayout extends React.Component{
  render(){
    let {layout, onChange} = this.props;
    let { margin, height, width } = layout;
    return(
       <div className='pl-container'>
          <div>
            <label className='type-label'>Size</label>
            <LayoutInput header='height' value={height} onChange={ new_height => onChange({...layout, height: new_height}) } />
            <LayoutInput header='width' value={width} onChange={ new_width => onChange({...layout, width: new_width}) } />
          </div>
          <Spacer/>
          <div>
            <label className='type-label'>Margin</label>
            {
              ['top', 'bottom', 'left', 'right'].map(name =>
                <LayoutInput header={name} value={margin[name]}
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
