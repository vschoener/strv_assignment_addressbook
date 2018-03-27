import * as request from 'supertest';
import * as express from 'express';
import { expect } from 'chai';
import * as admin from 'firebase-admin';
import * as sinon from 'sinon';

import * as Firebase from '../../firebase/firebase';
import { Contact } from '../../api/v1/contact/contact.model';
import AuthService from '../../api/v1/auth/auth.service';
import FirebaseContact from '../../api/v1/contact/contact.firebase';

export const ContactTest = (expressApp: express.Application, firebase: Firebase.Firebase) => {

    const contact = new Contact();
    let token: string;

    let firebaseDatabaseStub: sinon.SinonStub;
    let getConfigStub: sinon.SinonStub;
    const refStub = sinon.stub();
    const pushStub = sinon.stub();

    beforeAll((done) => {
        getConfigStub = sinon.stub(firebase, 'getConfig');
        getConfigStub.callsFake(() => {});
        getConfigStub.returns({
            firebase: {
                databaseURL: 'https://not-a-project.firebaseio.com',
                storageBucket: 'not-a-project.appspot.com',
            }
        });

        firebaseDatabaseStub = sinon.stub(admin, 'database');
        firebaseDatabaseStub.get(() => (() => ({ref: refStub})));
        refStub.withArgs(FirebaseContact.ref).returns({push: pushStub});

        firebase.initialize();
        contact.address = '1 street';
        contact.zipCode = 10000;
        contact.country = 'France';

        const userService = new AuthService(process.env.JWT_SECRET);
        userService.registerUser('test@crazy.com', 'yosh!')
            .then((res) => {
                token = res.token;
                done();
            }).catch(err => done(err));
    });

    describe('POST /contacts', () => {
        it('Should throw 500 error without the token', (done) => {
            request(expressApp).post('/contacts')
                .send(contact.encode())
                .expect(500)
                .end(done);
        });
    });

    describe('POST /contacts', () => {
        it('Should create a contact', (done) => {
            request(expressApp).post('/contacts')
                .set({
                    'X-AUTH': token,
                })
                .send(contact.encode())
                .expect(201)
                .end((err, res: request.Response) => {
                    if (err) {
                        throw Error(JSON.stringify(res.body));
                    }
                    done();
                });
        });
    });

    afterAll(() => {
        firebaseDatabaseStub.restore();
        refStub.restore();
        getConfigStub.restore();
    });
};
