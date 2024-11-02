import { Request, Response } from 'express';
import { z } from 'zod';
import { authorize } from '../../helpers/auth';
import { db } from '../..';
import * as insertStudent from '../../sql/insertStudentQuery';

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

    const postStudentSchema = z.object({
        username: z.string(),
        first_name: z.string(),
        last_name: z.string(),
        grade_level_id: z.number(),
    });
    const { data, success } = postStudentSchema.safeParse(req.body);

    if (!success) {
        res.status(400);
        res.json({ success: false, message: 'Invalid student' });
        return;
    }

    let student = {
        school_id: 123,
        reading_level_id: 1,
        has_iep: false,
        first_seen_at: undefined,
        created_at: new Date().toISOString(),
        last_seen_at: undefined,
        ...data,
    };

    db.run(
        insertStudent.query,
        insertStudent.prepareData(student),
        function (err) {
            if (err) {
                return console.log(err.message);
            }

            res.status(200);
            res.json({
                success: true,
                student: {
                    ...student,
                    id: this.lastID,
                },
            });
        },
    );
}
