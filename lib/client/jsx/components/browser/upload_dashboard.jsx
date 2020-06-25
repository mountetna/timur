// Framework libraries.
import * as React from 'react';

// Class imports.
import UploadMeter from 'etna-js/upload/components/upload-meter';
import UploadControl from 'etna-js/upload/components/upload-control';

const UploadDashboard = ({ uploads }) => (
  <div id="upload-dashboard" className="upload-dashboard">
    {Object.keys(uploads).map((filekey) => (
      <div key={filekey}>
        <UploadMeter key={filekey + '-1'} upload={uploads[filekey]} />
        <UploadControl key={filekey + '-2'} upload={uploads[filekey]} />
      </div>
    ))}
  </div>
);

export default UploadDashboard;
