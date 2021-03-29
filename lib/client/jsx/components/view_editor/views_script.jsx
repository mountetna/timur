// Framework libraries.
import React from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';


function ViewScript(props) {

  let { is_editing, onChange, script } = props;
  let className = is_editing ? 'manifest-script editing view-editor' : 'manifest-script view-editor';
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
