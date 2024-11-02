import { Request, Response } from 'express';

export default function (req: Request, res: Response) {
    res.json({
        success: true,
        message: 'BookNook Interview API',
    });
}
