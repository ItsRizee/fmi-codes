import axios from 'axios';

export const getSatelliteById = async (id) => {
    try {
        const response = await axios.get(`http://localhost:5001/api/Controllers/${id}`)

        return response.data;
    }catch(error)
    {
        throw error;
    }
}