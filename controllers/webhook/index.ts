import axios from 'axios';

// Types
interface WebhookRequest {
  type: 'grade_update' | 'reading_update';
  sis_id: string;
  grade?: string;
  reading_level?: string;
  'x-api-key': string;
}

interface Student {
  id: number;
  username: string;
  sis_id: string;
  first_name: string;
  last_name: string;
  grade_level_id: number;
  reading_level_id: number;
  has_iep: boolean;
}

interface GradeLevel {
  id: number;
  name: string;
  sequence: number;
}

interface ReadingLevel {
  id: number;
  code: string;
  name: string;
}

// API client with authorization header
const api = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'X-Api-Key': process.env.INTERNAL_X_API_KEY
  }
});

const gradeLevels = {
  "K": "Kindergarten",
  "1": "1st",
  "2": "2nd",
  "3": "3rd",
  "4": "4th",
  "5": "5th",
  "6": "6th",
  "7": "7th",
  "8": "8th"
}

async function findStudents(): Promise<Student[] | null> {
  const response = await api.get(`/students`);
  const students = response.data;
  return students.students.length > 0 ? students.students : null;
}

async function findGradeLevel(gradeName: string): Promise<GradeLevel | null> {
  const response = await api.get(`/grade_levels/${gradeName}`);
  const gradeLevels = response.data;
  return gradeLevels.grade_levels.length > 0 ? gradeLevels.grade_levels[0] : null;
}

async function findReadingLevel(code: string): Promise<ReadingLevel | null> {
  const response = await api.get(`/reading_levels/${code}`);
  const readingLevels = response.data;
  return readingLevels.reading_levels.length > 0 ? readingLevels.reading_levels[0] : null;
}

async function updateStudent(student: Student): Promise<void> {
  const updateData = {
    username: student.username,
    sis_id: student.sis_id,
    first_name: student.first_name,
    last_name: student.last_name,
    grade_level_id: student.grade_level_id,
    reading_level_id: student.reading_level_id,
    has_iep: student.has_iep
  };
  
  await api.put(`/students/${student.id}`, updateData);
}

export default async function webhook(req, res) {
  try {
    const data: WebhookRequest = req.body;

    const students = await findStudents();
    const student = students?.filter((student) => student.sis_id === data.sis_id)[0];

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Handle grade update
    if (data.type === 'grade_update' && data.grade) {
      const convertedGrade = gradeLevels[data.grade];
      const gradeLevel = await findGradeLevel(convertedGrade); // Convert "1" to "1st"
      if (!gradeLevel) {
        return res.status(400).json({ error: 'Invalid grade level' });
      }
      student.grade_level_id = gradeLevel.id;
    }

    // Handle reading level update
    if (data.type === 'reading_update' && data.reading_level) {
      const readingLevel = await findReadingLevel(data.reading_level);
      if (!readingLevel) {
        return res.status(400).json({ error: 'Invalid reading level' });
      }
      student.reading_level_id = readingLevel.id;
    }
    // Update the student record
    await updateStudent(student);

    return res.status(200).json({ message: 'Student updated successfully' });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
