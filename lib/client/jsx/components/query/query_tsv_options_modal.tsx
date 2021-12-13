import React, {useState, useCallback} from 'react';

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

  const handleOnDownload = useCallback(() => {
    setLoading(true);
    onDownload({transpose});
  }, [onDownload, transpose]);

  return (
    <>
      <TsvOptionsModal
        options={options}
        onDownload={handleOnDownload}
        disabled={loading}
      />
      {loading ? <LinearProgress /> : null}
    </>
  );
}
