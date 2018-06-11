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

export const manifestScript = (code, props)=>{
  let __html = Prism.highlight(code, timur_lang);
  return <pre className='manifest-script' dangerouslySetInnerHTML={{__html}} />;
};
