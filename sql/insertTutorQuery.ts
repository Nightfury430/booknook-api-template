import { Tutor } from '../types/Tutor';

export const query = `
INSERT INTO 
    tutor (
        email,
        password_hash,
        first_name,
        last_name,
        is_admin,
        tutor_type_id,
        first_seen_at,
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
        ?
    )
    ;
`;

export function prepareData(tutor: Tutor) {
    return [
        tutor.email,
        tutor.password_hash,
        tutor.first_name,
        tutor.last_name,
        tutor.is_admin,
        tutor.tutor_type_id,
        tutor.first_seen_at,
        tutor.last_seen_at,
    ];
}
