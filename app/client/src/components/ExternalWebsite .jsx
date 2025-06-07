import React, { useEffect, useState } from 'react';

const domain = import.meta.env.VITE_SERVER
const subdir = import.meta.env.VITE_SUBDIR ? `/${import.meta.env.VITE_SUBDIR}` : ''

const ExternalWebsite = ({ url = null, name = null, type = null }) => {
  const [externalWebsite, setExternalWebsite] = useState(null)
  useEffect(() => {
    if (type && type == "Upload") {
      setExternalWebsite(`${subdir}/${domain}/documents?name=${name}`)
    } else {
      setExternalWebsite(`${subdir}/api/proxy?url=${url}`)
    }
  }, [url])

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <iframe
        view='FitH'
        src={externalWebsite}
        title="External Website"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          aspectRatio: '4 / 3'
        }}
      />
    </div>
  );
};

export default ExternalWebsite;
