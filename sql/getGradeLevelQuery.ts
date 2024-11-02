export const getByIdQuery = `
    SELECT *
    FROM grade_level
    WHERE id = ?
    ;
`;

export function prepareDataGetById(id: number) {
    return [id];
}

export const getByNameQuery = `
    SELECT *
    FROM grade_level
    WHERE ? is NULL OR lower(?) = lower(grade_level.name)
    ;
`;

export function prepareDataGetByName(name: string | null = null) {
    return [name, name];
}
