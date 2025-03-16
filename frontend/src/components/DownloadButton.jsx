import React from "react";
import downloadSatellitesJson from '../services/downloadSatellitesJson'

const DownloadButton = () => {
  const handleDownload = () => {
    const satelliteIds = [1, 2, 3]; // Example satellite IDs
    downloadSatellitesJson(satelliteIds); 
  };

  return <button onClick={handleDownload}>Download Satellites JSON</button>;
};

export default DownloadButton;
