// Framework libraries.
import React from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';

import { JSHINT } from 'jshint';
window.JSHINT = JSHINT;

import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/javascript-lint';

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
              mode: 'application/json',
              autoCloseBrackets: true,
              gutters: ['CodeMirror-lint-markers'],
              lint: is_editing ? true : false,
              tabSize: 2
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
