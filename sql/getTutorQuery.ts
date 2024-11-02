export const queryByEmail = `SELECT * FROM tutor WHERE email = ?;`;

export function prepareDataByEmail(email: string) {
    return [email];
}

export const queryById = `SELECT * FROM tutor WHERE id = ?;`;

export function prepareDataById(id: number) {
    return [id];
}
