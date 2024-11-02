export const getByIdQuery = `
    SELECT *
    FROM student
    WHERE id = ?
    ;
`;

export function prepareDataGetById(id: number) {
    return [id];
}

export const getAllQuery = `
    SELECT *
    FROM student
    WHERE (
        ? IS NULL OR ? = student.school_id
    )
    AND (
        ? IS NULL OR ? = student.sis_id
    )
    ;
`;

export function prepareDataGetAll(
    schoolId: number | null = null,
    sisId: string | null = null,
) {
    return [schoolId, schoolId, sisId, sisId];
}
