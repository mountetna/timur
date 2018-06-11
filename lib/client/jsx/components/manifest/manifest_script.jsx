// Framework libraries.
import * as React from 'react';
import Prism from 'prismjs';

const timur_lang = {
  comment: /\#.*$/m,
  macro: /@[\w]+(?=\()/i,
  variable: /@[\w]+/,
  string: {
          pattern: /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
          greedy: true
  },
  label: /[\w]+(?=\s*:)/i,
  template: /[{}]/,
  function: /[\w]+(?=\()/i,
  vector: /[\[\]]/,
  column: /\$[\w]+/
};

export default class ManifestScript extends React.Component {
  render() {
    let { is_editing, onChange, script } = this.props;

    let __html = Prism.highlight(script, timur_lang);
    //let __html = script;
    return <div className='manifest-body'>
      <pre className='manifest-script' dangerouslySetInnerHTML={{__html}} />
      {
        is_editing &&
          <textarea
            className='manifest-editor'
            onChange={onChange}
            value={script} />
      }
    </div>
  }
}
