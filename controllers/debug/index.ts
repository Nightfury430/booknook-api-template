import { Request, Response } from 'express';
import { db } from '../..';
import { Student } from '../../types/Student';
import { Tutor } from '../../types/Tutor';
import { ReadingLevel } from '../../types/ReadingLevel';
import { GradeLevel } from '../../types/GradeLevel';

export default async function (req: Request, res: Response) {
    db.all(`SELECT * FROM student`, function (err, studentRows: Student[]) {
        if (err || !studentRows) {
            res.status(404);
            res.json({
                success: false,
                message: 'Students not found',
            });
            return;
        }

        db.all(`SELECT * FROM tutor`, function (err, tutorRows: Tutor[]) {
            if (err || !tutorRows) {
                res.status(404);
                res.json({
                    success: false,
                    message: 'Tutors not found',
                });
                return;
            }

            db.all(
                `SELECT * FROM reading_level`,
                function (err, readingLevelRows: ReadingLevel[]) {
                    if (err || !readingLevelRows) {
                        res.status(404);
                        res.json({
                            success: false,
                            message: 'Reading Levels not found',
                        });
                        return;
                    }

                    db.all(
                        `SELECT * FROM grade_level`,
                        function (err, gradeLevelRows: GradeLevel[]) {
                            if (err || !gradeLevelRows) {
                                res.status(404);
                                res.json({
                                    success: false,
                                    message: 'Grade Levels not found',
                                });
                                return;
                            }

                            res.status(200);
                            res.json({
                                success: true,
                                data: {
                                    student: studentRows,
                                    tutor: tutorRows,
                                    reading_level: readingLevelRows,
                                    grade_level: gradeLevelRows,
                                },
                            });
                        },
                    );
                },
            );
        });
    });
}
