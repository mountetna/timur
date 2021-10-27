import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import FileCopyIcon from '@material-ui/icons/FileCopyOutlined';

import Tooltip from '@material-ui/core/Tooltip';

const CopyIcon = React.memo(
  ({
    canEdit,
    onClick,
    label
  }: {
    canEdit: boolean;
    onClick: () => void;
    label: string;
  }) => {
    if (!canEdit) return null;

    return (
      <Tooltip title={`Copy ${label}`} aria-label={`copy ${label}`}>
        <IconButton aria-label={`copy ${label}`} onClick={onClick}>
          <FileCopyIcon color='action' />
        </IconButton>
      </Tooltip>
    );
  }
);

export default CopyIcon;
