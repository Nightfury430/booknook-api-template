import { Request, Response } from 'express';
import { z } from 'zod';
import { authorize } from '../../helpers/auth';
import { db } from '../..';
import { Student } from '../../types/Student';
import renderStudent from '../../helpers/renderStudent';
import * as getStudent from '../../sql/getStudentQuery';

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
    const paramsSchema = z.object({
        id: z.string().transform((v) => parseInt(v, 10)),
    });
    const { data } = paramsSchema.safeParse(req.params);

    if (!data?.id) {
        res.status(400);
        res.json({ success: false, message: 'Invalid id' });
        return;
    }

    db.get(
        getStudent.getByIdQuery,
        getStudent.prepareDataGetById(data.id),
        function (err, row: Student) {
            if (err || !row) {
                res.status(404);
                res.json({
                    success: false,
                    message: 'Student not found',
                });
                return;
            }
            const student = renderStudent(row);
            res.status(200);
            res.json({ success: true, student });
        },
    );
}
