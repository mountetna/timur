// Framework libraries.
import React from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';


function ViewScript(props) {

  /*
  scroll() {
    let { is_editing } = this.props;
    if (this.editor && this.script) {
      if (is_editing) this.script.scrollTop = this.editor.scrollTop;
      else this.editor.scrollTop = this.script.scrollTop;
    }
  }
   */

  let { is_editing, onChange, script } = props;
  let className = is_editing ? 'view-script editing' : 'view-script';
  return (
      <div className={className}>
        <CodeMirror
            options = {{
              readOnly: is_editing ? false : 'no-cursor',
              lineNumbers: is_editing,
              lineWrapping: true,
              mode: 'json'
            }}
            value={script}
            onBeforeChange={(editor, data, value) => {
              onChange(value);
            }}
        />
      </div>
  );
}
export default ViewScript;
