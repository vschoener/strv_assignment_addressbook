import * as request from 'supertest';
import { expect } from 'chai';
import { expressApp } from '../bootstrap';

describe('Test 404', () => {
    it('Should return 404, Resource not found', (done) => {
        return request(expressApp).get('/42')
            .expect('Content-Type', /json/)
            .expect(404)
            .expect((res: request.Response) => {
                expect(res.body.message).to.be.equal('Resource not found');
            })
            .end((err) => {
                if (err) {
                    return done(err);
                }
                return done();
            });
    });
});
