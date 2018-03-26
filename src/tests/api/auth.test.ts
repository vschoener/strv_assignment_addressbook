import * as request from 'supertest';
import { expect } from 'chai';

import * as express from 'express';

let token: any;

export const AuthTest = (expressApp: express.Application) => {
    describe('POST /auth/register', () => {
        it('Should register a new user', (done) => {
            return request(expressApp).post('/auth/register')
                .send({
                    email: 'john.doe@gmail.com',
                    password: 'securePassword'
                })
                .expect(201)
                .expect((res: any) => {
                    expect(res.headers['x-auth']).not.equal(undefined);
                    token = res.headers['x-auth'];
                })
                .end(done);
        });

        it('Should be unique', (done) => {
            return request(expressApp).post('/auth/register')
                .send({
                    email: 'john.doe@gmail.com',
                    password: 'securePassword'
                })
                .expect(422)
                .end(done);
        });
    });

    describe('GET /auth/login', () => {
        it('Should return the token with the right credential', (done) => {
            return request(expressApp).post('/auth/login')
                .send({
                    email: 'john.doe@gmail.com',
                    password: 'securePassword'
                })
                .expect(200)
                .expect((res: any) => {
                    expect(res.body.token).not.equal(undefined);
                    expect(res.body.token).equal(token);
                })
                .end(done);
        });

        it('Should not return the token with the wrong login', (done) => {
            return request(expressApp).post('/auth/login')
                .send({
                    email: 'john.doe@gmail.com',
                    password: 'WrOngSecurePassword'
                })
                .expect(401)
                .end(done);
        });
    });
};
