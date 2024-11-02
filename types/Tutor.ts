export type Tutor = {
    id?: number;
    email: string;
    password_hash?: string;
    first_name: string;
    last_name: string;
    is_admin: boolean;
    tutor_type_id: number;
    first_seen_at: string;
    last_seen_at: string;
    token?: string;
};
