import { Request, Response } from 'express';
// import axios from 'axios';
// import { z } from 'zod';

export default async function (req: Request, res: Response) {
    const xApiKey = process.env.INTERNAL_X_API_KEY ?? '';
    if (!xApiKey) throw new Error('INTERNAL_X_API_KEY var missing');

    // Backend Interview task, build out this endpoint

    console.log({ body: req.body });
    res.status(200);
    res.json({ success: true, message: 'webhook boilerplate' });
}
