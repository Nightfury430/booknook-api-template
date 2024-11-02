import { Request, Response } from 'express';
import { z } from 'zod';
import { authorize } from '../../helpers/auth';
import { db } from '../..';
import { Student } from '../../types/Student';
import * as getStudent from '../../sql/getStudentQuery';
import * as updateStudent from '../../sql/updateStudentQuery';
import renderStudent from '../../helpers/renderStudent';

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
    const paramsSchema = z.object({
        id: z.string().transform((v) => parseInt(v, 10)),
    });
    const { data: paramsData } = paramsSchema.safeParse(req.params);
    if (!paramsData?.id) {
        res.status(400);
        res.json({ success: false, message: 'Invalid id' });
        return;
    }

    const putStudentSchema = z.object({
        username: z.string(),
        sis_id: z.string().optional(),
        first_name: z.string(),
        last_name: z.string(),
        grade_level_id: z.number(),
        reading_level_id: z.number(),
        has_iep: z.boolean(),
    });
    const { data: putData, success } = putStudentSchema.safeParse(req.body);

    if (!success) {
        res.status(400);
        res.json({
            success: false,

            message: 'Invalid student for update',
        });
        return;
    }

    let student = { ...putData, id: paramsData.id };

    const artificialDelayMs = Math.floor(Math.random() * ARTIFICIAL_DELAY_MS);
    await new Promise((r) => setTimeout(r, artificialDelayMs));

    db.run(
        updateStudent.query,
        updateStudent.prepareData(student),
        function (err) {
            if (err) return console.log(err.message);
            db.get(
                getStudent.getByIdQuery,
                getStudent.prepareDataGetById(student.id),
                function (err, row: Student) {
                    if (err) {
                        res.status(500);
                        res.json({
                            success: false,
                            message: 'Error updating student',
                        });
                        return;
                    }
                    if (!row) {
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
        },
    );
}
