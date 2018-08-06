// Framework libraries.
import * as React from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/addon/mode/simple';
import { defineSimpleMode } from 'codemirror';

const timur_lang = [
  { regex: /\#.*$/m, token: 'comment'},
  { regex: /@[\w]+(?=\()/i, token: 'macro'},
  { regex: /@[\w]+/, token: 'variable'},
  { regex: /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/, token: 'string' },
  { regex: /[\w]+(?=\s*:)/i, token: 'label'},
  { regex: /[{}]/, token: 'template'},
  { regex: /[\w]+(?=\()/i, token: 'function'},
  { regex: /[\[\]]/, token: 'vector'},
  { regex: /\$[\w]+/, token: 'column'}
];

defineSimpleMode('timur_lang', {
  start: timur_lang,
  meta: {
    lineComment: "#"
  }
});


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
    let className = is_editing ? 'manifest-script editing' : 'manifest-script';

    return <div className={className}>
      <CodeMirror
        options={{
          readOnly: is_editing ? false : 'nocursor',
          lineNumbers: is_editing,
          mode: 'timur_lang'
        }}
        value={script}
        onBeforeChange={(editor, data, value) => {
          onChange(value)
        }}
      />
    </div>
  }
}
