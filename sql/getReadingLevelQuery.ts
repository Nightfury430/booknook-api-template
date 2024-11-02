export const getByIdQuery = `
    SELECT *
    FROM reading_level
    WHERE id = ?
    ;
`;

export function prepareDataGetById(id: number) {
    return [id];
}

export const getByCodeQuery = `
    SELECT *
    FROM reading_level
    WHERE ? IS NULL OR ? = reading_level.code
    ;
`;

export function prepareDataGetByCode(code: string | null = null) {
    return [code, code];
}
