import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await axios.get(`${process.env.CARRECTLY_ADMIN_URL}/api/cars/getAllYears`);
    res.send(response.data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return res.status(error.status || 500).end(error.message);
  }
}
