import * as request from 'supertest';
import { expect } from 'chai';

import * as express from 'express';
import { User } from '../../api/v1/user/user.model';

let token: string;
export const AuthTest = (expressApp: express.Application) => {
    describe('POST /auth/register', () => {
        it('Should register a new user', (done) => {
            request(expressApp).post('/auth/register')
                .send({
                    email: 'john.doe@gmail.com',
                    password: 'securePassword'
                })
                .expect(201)
                .expect((res: any) => {
                    expect(res.headers).to.have.ownProperty('x-auth');
                    token = res.headers['x-auth'];
                })
                .end((err: any, res: request.Response) => {
                    if (err) {
                        done(err);
                    }
                    User.findById(res.body._id).then((user) => {
                        expect(user.tokens[0].token).be.a('string');
                        expect(user.tokens[0].access).be.equal('auth');
                        done();
                    }).catch(err => done(err));
                });
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
