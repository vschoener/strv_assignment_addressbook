import * as request from 'supertest';
import * as admin from 'firebase-admin';
import * as sinon from 'sinon';

import { expressApp, firebase, mongo } from '../../bootstrap';
import { Contact } from '../../api/v1/contact/contact.model';
import { AuthService } from '../../api/v1/auth/auth.service';
import FirebaseContact from '../../api/v1/contact/contact.firebase';
import { IUserDocument, User } from '../../api/v1/user/user.model';

const contact = new Contact();
let token: string;

let firebaseDatabaseStub: sinon.SinonStub;
let getConfigStub: sinon.SinonStub;
const refStub = sinon.stub();
const pushStub = sinon.stub();

beforeAll(async () => {
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

    await mongo.connect();
    const userService = new AuthService(process.env.JWT_SECRET, parseInt(process.env.JWT_EXPIRE));
    await User.remove({email: 'test@crazy.com'});

    const user: IUserDocument = await userService.registerUser('test@crazy.com', 'yosh!');
    const tokenInfo = await userService.generateAndAddTokenToUser(user);
    token = tokenInfo.token;
});

afterAll(() => {
    firebaseDatabaseStub.restore();
    refStub.restore();
    getConfigStub.restore();
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
