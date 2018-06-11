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
  scroll() {
    let { is_editing } = this.props;
    if (this.editor && this.script) {
      if (is_editing) this.script.scrollTop = this.editor.scrollTop;
      else this.editor.scrollTop = this.script.scrollTop;
    }
  }

  render() {
    let { is_editing, onChange, script } = this.props;

    let __html = Prism.highlight(script, timur_lang);
    //let __html = script;
    return <div className='manifest-body'>
      <pre
        ref={script => this.script = script}
        onScroll={ this.scroll.bind(this) }
        className='manifest-script' dangerouslySetInnerHTML={{__html}} />
      {
        <textarea
          ref={ editor => this.editor = editor }
          onScroll={ this.scroll.bind(this) }
          className='manifest-editor'
          style={ { visibility: is_editing ? 'visible' : 'hidden' } }
          onChange={onChange}
          value={script} />
      }
    </div>
  }
}
