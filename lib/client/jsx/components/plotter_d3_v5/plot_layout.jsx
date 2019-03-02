import * as React from 'react';

class PlotLayout extends React.Component{
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderInput(label_header, value, onChange) {
    return (
      <div className='pl-group' key={`${label_header}`}>
        <label className='sub-label'>{label_header}</label>
        <input 
          className='pl-input'
          onChange={(e) => onChange(e.target.value)} 
          value={value}
          type='number'
          min='0'
          />
          <span className='unit'>px</span>
      </div>
    );
  }

  render(){
    let {layout, onChange} = this.props;
    let {margin, height, width} = layout;
    return(
       <div className='pl-container'>
          <div>
          <label className='type-label'>Size</label>
          {this.renderInput('height', height, (new_height)=>onChange({...layout, height: new_height}))}
          {this.renderInput('width', width, (new_width)=>onChange({...layout, width: new_width}))}
          </div>
          <div style={{clear:'both'}}></div>
          <div>
          <label className='type-label'>Margin</label>
          {['top', 'bottom', 'left', 'right'].map((name) => this.renderInput(
            name,
            margin[name], 
            (new_value)=>onChange({...layout, margin: {...margin, [name]: new_value}})
          ))}
          </div>
          <div style={{clear:'both'}}></div>
          <br />
      </div>
    );

  }
}

export default PlotLayout;
