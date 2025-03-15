import axios from 'axios';

export const getSatelliteByIdPagination = async (search, page, count) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/Controllers/GetSatelliteByIdPagination`, {
           params: { name: search,
            page: page,
            count: count}
        })

        console.log(response)

        if(response !== undefined)
        {
            const data = await response.data;
            console.log(data)
        }

        return response.data;
    }catch(error)
    {
        throw error;
    }
}