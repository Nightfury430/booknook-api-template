import { GradeLevel } from './GradeLevel';

export type ReadingLevel = {
    id: number;
    sequence: number;
    reading_level: string;
    code: string;
    grade_level_id: number;
    grade_level?: GradeLevel;
};
