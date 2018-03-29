import * as request from 'supertest';
import { expressApp } from '../../bootstrap';

describe('Test GET /', () => {
    it('Should response with return 200 OK with json content api version', (done) => {
        return request(expressApp).get('/')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect({
                version: 1.0
            })
            .end((err) => {
                if (err) {
                    return done(err);
                }
                return done();
            });
    });
});
