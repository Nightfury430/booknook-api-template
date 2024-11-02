import express from 'express';
import cors from 'cors';
import Sqlite3, { Database } from 'sqlite3';

import indexController from './controllers/index';
import authenticateTutorController from './controllers/tutors/authenticate';
import getStudentsController from './controllers/students';
import postStudentController from './controllers/students/post';
import getStudentController from './controllers/students/get';
import putStudentController from './controllers/students/put';
import getReadingLevelsController from './controllers/readingLevels/index';
import getReadingLevelController from './controllers/readingLevels/get';
import getGradeLevelsController from './controllers/gradeLevels/index';
import getGradeLevelController from './controllers/gradeLevels/get';
import webhookController from './controllers/webhook';
import debugController from './controllers/debug';
import dbInit from './helpers/dbInit';

const sqlite3 = Sqlite3.verbose();
export const db: Database = new sqlite3.Database(':memory:');
export const secretKey = process.env.SECRET_KEY ?? '';
const port = process.env.PORT || 3001;

if (!secretKey) {
    console.log('SECRET_KEY must be set in .env');
    process.exit();
}

dbInit(db);

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', indexController);

app.post('/tutors/authenticate', authenticateTutorController);

app.get('/students', getStudentsController);

app.post('/students', postStudentController);

app.get('/students/:id', getStudentController);

app.put('/students/:id', putStudentController);

app.get('/reading_levels', getReadingLevelsController);

app.get('/reading_levels/:id', getReadingLevelController);

app.get('/grade_levels', getGradeLevelsController);

app.get('/grade_levels/:id', getGradeLevelController);

app.post('/webhook', webhookController);

app.get('/debug', debugController);

app.listen(port, () => {
    console.log(`BookNook Interview API listening at http://localhost:${port}`);
});
