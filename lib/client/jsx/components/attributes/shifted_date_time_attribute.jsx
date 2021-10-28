import React from 'react';

import DateTimeAttribute from './date_time_attribute';
import {formatDate} from '../../utils/dates';
import {useReduxState} from 'etna-js/hooks/useReduxState';
import {selectUser} from 'etna-js/selectors/user-selector';
import {isPrivileged} from 'etna-js/utils/janus';

const ShiftedDateTimeAttribute = (props) => {
  const user = useReduxState((state) => selectUser(state));
  const {mode, value} = props;

  if (mode == 'edit' && isPrivileged(user, CONFIG.project_name))
    return <DateTimeAttribute {...props} />;

  return <div className='attribute'>{formatDate(value)}</div>;
};

export default ShiftedDateTimeAttribute;
