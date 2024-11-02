import { readingLevels } from '../data/readingLevels';
import { gradeLevels } from '../data/gradeLevels';
import { Student } from '../types/Student';

export default (student: Student) => {
    const boolProps = ['has_iep'];

    boolProps.forEach((p) => {
        student[p] = JSON.parse(student[p]);
    });

    student.grade_level = gradeLevels.filter(
        (gradeLevel) => gradeLevel.id === student.grade_level_id,
    )[0];
    student.reading_level = readingLevels.filter(
        (readingLevel) => readingLevel.id === student.reading_level_id,
    )[0];

    return student;
};
