import React, {useState} from 'react';

import LinearProgress from '@material-ui/core/LinearProgress';

import TsvOptionsModal from '../search/tsv_options_modal';

export default function QueryTsvOptionsModal({onDownload}: {onDownload: any}) {
  const [transpose, setTranspose] = useState(false);
  const [loading, setLoading] = useState(false);

  const options = [
    {
      label: 'Transpose',
      onChange: setTranspose,
      checked: !!transpose
    }
  ];

  function handleOnDownload() {
    setLoading(true);
    onDownload({transpose});
  }

  return (
    <>
      <TsvOptionsModal options={options} onDownload={handleOnDownload} />
      {loading ? <LinearProgress /> : null}
    </>
  );
}
