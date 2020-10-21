// Framework libraries.
import * as React from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/addon/mode/simple';
import { defineSimpleMode } from 'codemirror';


const template = [
  { regex: /\}/, token: 'template', next: 'start'},
  { regex: /\%[0-9]+/, token: 'template-var'},
  { regex: /[^}]/, token: 'template-text'}
];

defineSimpleMode('timur_lang', {
  start: timur_lang,
  template,
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
          lineWrapping: true,
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
