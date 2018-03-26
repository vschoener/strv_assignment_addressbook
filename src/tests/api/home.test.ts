import * as request from 'supertest';
import * as express from 'express';

export const HomeTest = (expressApp: express.Application) => {
    describe('Test GET /', () => {
        it('Should response with return 200 OK with json content api version', (done) => {
            return request(expressApp).get('/')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect({
                    version: 1.0
                })
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    return done();
                });
        });
    });
};
