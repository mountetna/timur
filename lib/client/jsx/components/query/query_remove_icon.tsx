import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import Tooltip from '@material-ui/core/Tooltip';

const RemoveIcon = React.memo(
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
      <Tooltip title={`Remove ${label}`} aria-label={`remove ${label}`}>
        <IconButton aria-label={`remove ${label}`} onClick={onClick}>
          <ClearIcon color='action' />
        </IconButton>
      </Tooltip>
    );
  }
);

export default RemoveIcon;
