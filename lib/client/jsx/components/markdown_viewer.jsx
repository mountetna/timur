import * as React from 'react';

import markdown from 'etna-js/utils/markdown';

const MarkdownViewer = ({text}) =>
  <div className='markdown' dangerouslySetInnerHTML={ {__html: markdown(text) } }/>

export default MarkdownViewer;
