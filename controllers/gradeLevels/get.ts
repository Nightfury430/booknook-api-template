import { db } from '../..';
import { authorize } from '../../helpers/auth';
import { Request, Response } from 'express';
import { z } from 'zod';
import * as getGradeLevel from '../../sql/getGradeLevelQuery';
import { GradeLevel } from '../../types/GradeLevel';

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
        const paramsSchema = z.object({
            id: z.string().transform((v) => parseInt(v, 10)),
        });
        const { data } = paramsSchema.safeParse(req.params);

        if (!data?.id) {
            res.status(400);
            res.json({ success: false, message: 'Invalid id' });
            return;
        }

        db.all(
            getGradeLevel.getByIdQuery,
            getGradeLevel.prepareDataGetById(data?.id),
            function (err, rows: GradeLevel[]) {
                res.status(200);
                res.json({ success: true, grade_levels: rows });
            },
        );
    } catch (error) {
        res.status(400);
        res.json({ success: false, message: 'Server error' });
        return;
    }
}
