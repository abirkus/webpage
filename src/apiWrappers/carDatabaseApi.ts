import axios from 'axios';
export type CarMake = string;

export type CarModel = {
  Model: string;
  Category: string;
};

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_CARRECTLY_ADMIN_URL,
  headers: {
    'Access-Control-Allow-Origin': '*',
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export const carDatabaseApi = {
  getAllMakes: async () => {
    const carMakes = await instance
      .get(`/api/getAllMakes`)
      .then((response) => response.data as CarMake[]);
    return carMakes;
  },

  getAllModels: async (carMake: CarMake, carYear: string) => {
    const carModels = await axios
      .get(`/api/getModels/${carMake}/${carYear}`)
      .then((response) => response.data as CarModel[]);

    return carModels;
  },

  getAllYears: async () => {
    const carYears = await axios
      .get(`/api/getAllYears`)
      .then((response) => response.data as string[]);

    return carYears;
  },
};
