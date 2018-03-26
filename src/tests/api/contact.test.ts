import * as request from 'supertest';
import { expect } from 'chai';

import { Contact } from '../../api/v1/contact/contact.model';
import * as express from 'express';

const contact = new Contact();
beforeAll(() => {
    contact.address = '1 street';
    contact.zipCode = 10000;
    contact.country = 'France';
});


export const ContactTest = (expressApp: express.Application) => {
    describe('POST /contacts', () => {
        it('Should create a new entry in firebase database', (done) => {
            request(expressApp).post('/contacts')
                .send(contact.encode())
                .expect(201)
                .expect((res: request.Response) => {
                    //expect(res.body).not.equal(undefined);
                })
                .end(done);
        });
    });
};
