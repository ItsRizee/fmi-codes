import axios from 'axios';

export const getSatellitesCollision = async (id) => {
    try {
        const response = await axios.get(`http://localhost:5001/api/Controllers/willCollide/${id}`)

        return response.data;
    }catch(error)
    {
        throw error;
    }
}