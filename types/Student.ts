import { GradeLevel } from './GradeLevel';
import { ReadingLevel } from './ReadingLevel';

export type Student = {
    id?: number;
    sis_id?: string;
    username: string;
    first_name: string;
    last_name: string;
    grade_level_id: number;
    grade_level?: GradeLevel;
    school_id?: number;
    reading_level_id: number;
    reading_level?: ReadingLevel;
    has_iep: boolean;
    first_seen_at?: string;
    created_at?: string;
    last_seen_at?: string;
};
