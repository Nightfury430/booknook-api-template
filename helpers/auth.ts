import { Request } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { secretKey } from '..';
import { Database } from 'sqlite3';
import { Tutor } from '../types/Tutor';
import * as getTutor from '../sql/getTutorQuery';

export async function authorize(
    req: Request,
    db?: Database,
): Promise<{ valid: boolean; tutor?: Tutor }> {
    const authorizationToken = req.headers?.authorization;
    const _xApiKeyToken = req.headers?.['x-api-key'];
    const xApiKeyToken =
        typeof _xApiKeyToken === 'object'
            ? _xApiKeyToken?.[0] ?? ''
            : _xApiKeyToken ?? '';
    if (authorizationToken) {
        if (!db) throw new Error('Invalid auth request');
        const tutor = await authorizeTutor(authorizationToken, db);
        return { valid: true, tutor };
    } else if (xApiKeyToken) {
        await authorizeApiKey(xApiKeyToken);
        return { valid: true };
    }
    return { valid: false };
}

export function authorizeTutor(token: string, db: Database): Promise<Tutor> {
    return new Promise((resolve, reject) => {
        const decoded = jwt.verify(token, secretKey);
        const nowSeconds = Math.floor(new Date().getTime() / 1000);
        const invalid =
            !token ||
            typeof decoded === 'string' ||
            !decoded?.exp ||
            decoded.exp < nowSeconds ||
            !decoded?.id ||
            typeof decoded.id !== 'number';
        if (invalid) {
            return reject(new Error('Invalid Authorization'));
        }

        try {
            db.get(
                getTutor.queryById,
                getTutor.prepareDataById(decoded.id),
                function (error, row: Tutor) {
                    if (error || !row) {
                        if (error) {
                            console.log({ error });
                        }
                        throw new Error('Invalid tutor');
                    }
                    resolve(row);
                },
            );
        } catch (error) {
            reject(new Error('Invalid Authorization'));
        }
    });
}

export function authorizeApiKey(token: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const decoded = jwt.verify(token, secretKey);
        const nowSeconds = Math.floor(new Date().getTime() / 1000);
        const invalid =
            !token ||
            typeof decoded === 'string' ||
            !decoded?.exp ||
            decoded.exp < nowSeconds;
        if (invalid) {
            return reject(new Error('Invalid Authorization'));
        }

        return resolve(true);
    });
}

export function authenticate(
    email: string,
    password: string,
    db: Database,
): Promise<Tutor> {
    return new Promise((resolve, reject) => {
        db.get(
            getTutor.queryByEmail,
            getTutor.prepareDataByEmail(email),
            function (err, row: Tutor) {
                if (
                    err ||
                    !row?.password_hash ||
                    !bcrypt.compareSync(password, row?.password_hash ?? '')
                ) {
                    reject('Invalid Tutor');
                }

                delete row.password_hash;
                row.token = jwt.sign({ id: row.id }, secretKey, {
                    expiresIn: '1h',
                });

                resolve(row);
            },
        );
    });
}
