import axios from 'axios';
import { webhookStudents } from './data/webhookStudents';

const baseUrl = 'http://localhost:3001';

async function main() {
    for (let i = 0; i < webhookStudents.length; i++) {
        const student = webhookStudents[i];
        axios.post(`${baseUrl}/webhook`, student);
    }
}

main();
