import { Request, Response } from 'express';
import { z } from 'zod';
import { authorize } from '../../helpers/auth';
import { db } from '../..';
import { Student } from '../../types/Student';
import renderStudent from '../../helpers/renderStudent';
import * as getStudent from '../../sql/getStudentQuery';

const ARTIFICIAL_DELAY_MS = parseInt(
    process.env?.ARTIFICIAL_DELAY_MS ?? '31000',
    10,
);

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
            schoolId: z
                .string()
                .transform((v) => parseInt(v, 10))
                .optional(),
            sisId: z.string().optional(),
        });
        const { data: queryData, success: querySuccess } =
            querySchema.safeParse(req.query);
        if (!querySuccess) {
            res.status(400);
            res.json({ success: false, message: 'Invalid query params' });
            return;
        }

        if (queryData?.sisId) {
            const artificialDelayMs = Math.floor(
                Math.random() * ARTIFICIAL_DELAY_MS,
            );
            await new Promise((r) => setTimeout(r, artificialDelayMs));
        }

        db.all(
            getStudent.getAllQuery,
            getStudent.prepareDataGetAll(queryData?.schoolId, queryData?.sisId),
            function (err, rows: Student[]) {
                const students = rows.map(renderStudent);
                res.status(200);
                res.json({ success: true, students });
            },
        );
    } catch (error) {
        res.status(400);
        res.json({ success: false, message: 'Server error' });
        return;
    }
}
