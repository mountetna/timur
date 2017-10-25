import { reviseDocument } from '../../actions/magma_actions';
import { Component } from 'react';
import NumericInput from '../inputs/numeric_input';

class IntegerAttribute extends Component {
  render() {
    let { mode, value } = this.props;

    return <div className='value'>
      {
        mode == 'edit' ? this.renderInput() : value
      }
    </div>;
  }

  update(value) {
    let { document, template, attribute, reviseDocument } = this.props;

    reviseDocument(
      document, template, attribute, value
    );
  }

  renderInput() {
    let { inputType, revision, attribute } = this.props;

    return <NumericInput 
        update={ this.update.bind(this) }
        inputType={ inputType }
        className='full_text'
        placeholder={attribute.placeholder}
        defaultValue={ revision } />
  }
}

export default connect(
  null,
  { reviseDocument }
)(IntegerAttribute);
