import { db } from '../..';
import { authorize } from '../../helpers/auth';
import { Request, Response } from 'express';
import { z } from 'zod';
import * as getReadingLevel from '../../sql/getReadingLevelQuery';
import { ReadingLevel } from '../../types/ReadingLevel';

export default async function (req: Request, res: Response) {
    try {
        await authorize(req, db);
    } catch (error) {
        res.json({
            success: false,
            message: 'Authorization invalid',
        });
        return;
    }

    try {
        const querySchema = z.object({
            code: z.string().optional(),
        });
        const { data: queryData, success: querySuccess } =
            querySchema.safeParse(req.query);
        if (!querySuccess) {
            res.status(400);
            res.json({ success: false, message: 'Invalid query params' });
            return;
        }

        db.all(
            getReadingLevel.getByCodeQuery,
            getReadingLevel.prepareDataGetByCode(queryData?.code),
            function (err, rows: ReadingLevel[]) {
                res.status(200);
                res.json({ success: true, reading_levels: rows });
            },
        );
    } catch (error) {
        res.status(400);
        res.json({ success: false, message: 'Server error' });
        return;
    }
}
