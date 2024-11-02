import { Request, Response } from 'express';
import { z } from 'zod';
import { authenticate } from '../../helpers/auth';
import { db } from '../..';

export default async function (req: Request, res: Response) {
    const authSchema = z.object({
        email: z.string(),
        password: z.string(),
    });
    const { data } = authSchema.safeParse(req.body);
    if (!data?.email) {
        res.status(400);
        res.json({ success: false, message: 'Missing email' });
        return;
    }

    if (!data?.password) {
        res.status(400);
        res.json({ success: false, message: 'Missing password' });
        return;
    }

    try {
        const authedTutor = await authenticate(data.email, data.password, db);
        res.status(200);
        res.json({ success: true, tutor: authedTutor });
    } catch (error) {
        res.status(401);
        res.json({
            success: false,

            message: 'Authorization invalid',
        });
        return;
    }
}
