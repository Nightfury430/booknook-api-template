import { GradeLevel } from '../types/GradeLevel';

export const query = `
INSERT INTO
    grade_level (
        id,
        name,
        sequence
    ) VALUES (
        ?,
        ?,
        ?
    )
    ;
`;

export function prepareData(gradeLevel: GradeLevel) {
    return [gradeLevel.id, gradeLevel.name, gradeLevel.sequence];
}
