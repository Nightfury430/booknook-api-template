import { Tutor } from '../types/Tutor';

export const adminUser: Tutor = {
    id: parseInt(process.env.TUTOR_ID ?? '99', 10),
    email: 'interviewee@booknook.com',
    password_hash:
        '$2b$10$iw4x0M5hCKEsAZRBV4j.U.C/Il1xLDw.OW5WH3Nv.F6nq8pup4Vw6', // 'password'
    first_name: 'B.N.',
    last_name: 'Interviewee',
    is_admin: true,
    tutor_type_id: 1,
    first_seen_at: '2024-04-07T19:04:58.489Z',
    last_seen_at: '2024-04-09T20:25:41.617Z',
};
