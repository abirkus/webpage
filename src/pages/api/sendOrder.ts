import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    //if (process.env.CARRECTLY_ADMIN_URL === 'https://carrectlyautocare.com') {
    //  await axios.post(`${process.env.CARRECTLY_ADMIN_URL_OLD}/api/newBooking2`, {
    //    param: req.body,
    //  });
    //}

    const response = await axios.post(`${process.env.CARRECTLY_ADMIN_URL}/api/newBooking2`, {
      param: req.body,
    });

    res.status(200).json(response.statusText);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return res.status(error.status || 500).end(error.message);
  }
}
