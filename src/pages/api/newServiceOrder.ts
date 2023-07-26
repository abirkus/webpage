import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    debugger
    try {
        debugger
        const response = await axios.post(`${process.env.CARRECTLY_ADMIN_URL}/api/newServiceOrder`, {
            param: req.body,
        });
        debugger
        res.status(200).json(response.statusText);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        debugger
        console.error(error.response.data);
        return res.status(error.status || 500).end(error.message);
  }
}