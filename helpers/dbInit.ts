import { students } from '../data/students';
import * as insertStudent from '../sql/insertStudentQuery';
import { adminUser } from '../data/adminUser';
import * as insertTutor from '../sql/insertTutorQuery';
import { readingLevels } from '../data/readingLevels';
import * as insertReadingLevel from '../sql/insertReadingLevelQuery';
import { gradeLevels } from '../data/gradeLevels';
import * as insertGradeLevel from '../sql/insertGradeLevelQuery';

import { Database } from 'sqlite3';

export default function (db: Database) {
    db.serialize(function () {
        db.run(`
                CREATE TABLE student (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                sis_id TEXT,
                username TEXT,
                first_name TEXT,
                last_name TEXT,
                grade_level_id INTEGER,
                school_id INTEGER,
                reading_level_id INTEGER,
                has_iep TEXT,
                first_seen_at TEXT,
                created_at TEXT,
                last_seen_at TEXT
            )
        `);

        // Insert students
        students.forEach((student) => {
            db.run(
                insertStudent.query,
                insertStudent.prepareData(student),
                function (err) {
                    if (err) {
                        return console.log(err.message);
                    }
                },
            );
        });

        db.run(`
            CREATE TABLE tutor (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT,
            password_hash TEXT,
            first_name TEXT,
            last_name TEXT,
            is_admin TEXT,
            tutor_type_id INTEGER,
            first_seen_at TEXT,
            last_seen_at TEXT
            )
        `);

        // Insert admin user
        db.run(
            insertTutor.query,
            insertTutor.prepareData(adminUser),
            function (err) {
                if (err) {
                    return console.log(err.message);
                }
            },
        );

        db.run(`
            CREATE TABLE reading_level (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sequence INTEGER,
            reading_level TEXT,
            code TEXT,
            grade_level_id INTEGER
            )
        `);

        // Insert Reading Levels
        readingLevels.forEach((readingLevel) => {
            db.run(
                insertReadingLevel.query,
                insertReadingLevel.prepareData(readingLevel),
                function (err) {
                    if (err) {
                        return console.log(err.message);
                    }
                },
            );
        });

        db.run(`
            CREATE TABLE grade_level (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            sequence INTEGER
            )
        `);

        // Insert Grade Levels
        gradeLevels.forEach((gradeLevel) => {
            db.run(
                insertGradeLevel.query,
                insertGradeLevel.prepareData(gradeLevel),
                function (err) {
                    if (err) {
                        return console.log(err.message);
                    }
                },
            );
        });
    });
}
