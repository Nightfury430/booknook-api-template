import type { Student } from '../types/Student';

export const query = `
    UPDATE student 
    SET
        username = ?,
        sis_id = ?,
        first_name = ?,
        last_name = ?,
        grade_level_id = ?,
        reading_level_id = ?,
        has_iep = ?
    WHERE id = ?
    ;
`;

export function prepareData(student: Student) {
    if (!student.id) throw new Error('Cannot update student without id');
    return [
        student.username,
        student?.sis_id ?? null,
        student.first_name,
        student.last_name,
        student.grade_level_id,
        student.reading_level_id,
        student.has_iep,
        student.id,
    ];
}
