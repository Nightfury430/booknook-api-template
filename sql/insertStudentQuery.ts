import { Student } from '../types/Student';

export const query = `
    INSERT INTO 
    student (
        username,
        sis_id,
        first_name,
        last_name,
        grade_level_id,
        school_id,
        reading_level_id,
        has_iep,
        first_seen_at,
        created_at,
        last_seen_at
    )
    VALUES (
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?
    )
    ;
`;

export function prepareData(student: Student) {
    return [
        student.username,
        student?.sis_id ?? null,
        student.first_name,
        student.last_name,
        student.grade_level_id,
        student.school_id,
        student.reading_level_id,
        student.has_iep,
        student.first_seen_at,
        student.created_at,
        student.last_seen_at,
    ];
}
