import { ReadingLevel } from '../types/ReadingLevel';

export const query = `
INSERT INTO
    reading_level (
        id,
        sequence,
        reading_level,
        code,
        grade_level_id
    ) VALUES (
        ?,
        ?,
        ?,
        ?,
        ?
    )
    ;
`;

export function prepareData(readingLevel: ReadingLevel) {
    return [
        readingLevel.id,
        readingLevel.sequence,
        readingLevel.reading_level,
        readingLevel.code,
        readingLevel.grade_level_id,
    ];
}
