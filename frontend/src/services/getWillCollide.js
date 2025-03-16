import axios from 'axios';

export const getWillCollide = async (id) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/Controllers/GetWillCollide/${id}`)

        return response.data;
    }catch(error)
    {
        throw error;
    }
}