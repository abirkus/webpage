import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await axios.post(`${process.env.CARRECTLY_ADMIN_URL}/api/newBooking`, {
      param: req.body,
    });
    await axios.post('https://carrectlyadmin.com/api/newBooking', {
      param: req.body,
    });
    res.status(200).json(response.statusText);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return res.status(error.status || 500).end(error.message);
  }
}
