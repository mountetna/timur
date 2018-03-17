// Framework libraries.
import * as React from 'react';
import Prism from 'prismjs';

export const manifestScript = (code, props)=>{
  let __html = Prism.highlight(code, Prism.languages.javascript);
  return <pre className='manifest-script' dangerouslySetInnerHTML={{__html}} />;
};
