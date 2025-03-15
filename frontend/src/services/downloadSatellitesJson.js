import axios from "axios";

 const downloadSatellitesJson = async (ids) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/Controllers/GenerateFile", 
        ids,
        {
          headers: {
            'ContentType' : 'application/json'
          } ,
          responseType: "blob"
        }
       
    );

    // Create a URL for the blob response
    const url = window.URL.createObjectURL(new Blob([response.data]));
    
    // Create a link element and trigger the download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "satellites.json"); // File name
    document.body.appendChild(link);
    link.click();

    // Cleanup
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading file:", error);
  }
};

export default downloadSatellitesJson