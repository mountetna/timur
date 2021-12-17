// Framework libraries.
import React, {useState} from 'react';
import * as ReactRedux from 'react-redux';

import IconButton from '@material-ui/core/IconButton';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import Tooltip from '@material-ui/core/Tooltip';

import FileAttribute from './file_attribute';
import {STUB} from 'etna-js/actions/file_actions';

const ImageAttribute = (props) => {
  const [zoomed, setZoomed] = useState(false);
  let {mode, value} = props;

  if (
    mode != 'edit' &&
    value &&
    value !== STUB &&
    value.path !== STUB &&
    value.url
  ) {
    const zoomVerb = zoomed ? 'out' : 'in';
    return (
      <div className='attribute file image'>
        <a href={value.url}>
          <img
            className={`image-thumbnail ${zoomed ? 'medium' : 'small'}`}
            src={`${value.url}&thumbnail=true`}
          />
        </a>
        <Tooltip title={`Zoom ${zoomVerb}`} aria-label={`zpom ${zoomVerb}`}>
          <IconButton
            aria-label={`zoom ${zoomVerb}`}
            onClick={() => {
              setZoomed(!zoomed);
            }}
          >
            {zoomed ? (
              <ZoomOutIcon color='action' />
            ) : (
              <ZoomInIcon color='action' />
            )}
          </IconButton>
        </Tooltip>
      </div>
    );
  }

  return <FileAttribute {...props} />;
};

export default ReactRedux.connect(null, null)(ImageAttribute);
