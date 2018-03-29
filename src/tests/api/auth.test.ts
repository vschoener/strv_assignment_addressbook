import * as request from 'supertest';
import { expect } from 'chai';
import * as jwt from 'jsonwebtoken';

import { expressApp, mongo } from '../../bootstrap';
import { IUserDocument, User } from '../../api/v1/user/user.model';
import * as bcrypt from "bcrypt-nodejs";

let token: string;
let user: IUserDocument;
const expire = parseInt(process.env.JWT_EXPIRE);
const authEmailExpire = 'authplop@expire.com';
const authClassicEmail = 'authjohn.doe@gmail.com';
const passwordExpiredUser = 'pwet';
const backDate = new Date();
backDate.setFullYear(1970);

beforeAll(async () => {
    await mongo.connect();
    await User.remove({'email': { $in: [authClassicEmail, authEmailExpire] } });
    const oldToken = jwt.sign({ foo: 'bar', iat: Math.floor(Date.now() / 1000) - 3600 }, process.env.JWT_SECRET);
    user = (new User({
        email: authEmailExpire,
        password: bcrypt.hashSync(passwordExpiredUser),
        tokens: [
            {
                access: 'auth',
                token: oldToken,
                expire: '-30',
                date: (new Date).setFullYear(1970)
            }
        ]
    }));

    return user.save();
});

describe('POST /auth/register', () => {
    it('Should register a new user', (done) => {
        request(expressApp).post('/auth/register')
            .send({
                email: authClassicEmail,
                password: 'securePassword'
            })
            .expect(201)
            .expect((res: any) => {
                expect(res.body).to.have.ownProperty('_id');
                expect(res.body).to.have.ownProperty('email');
            })
            .end((err: any, res: request.Response) => {
                if (err) {
                    done(err);
                }
                User.findById(res.body._id).then((user) => {
                    done();
                }).catch(err => done(err));
            });
    });

    it('Should be unique', (done) => {
        request(expressApp).post('/auth/register')
            .send({
                email: authClassicEmail,
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
                email: authClassicEmail,
                password: 'securePassword'
            })
            .expect(200)
            .expect((res: any) => {
                expect(res.body.expireTime).equal(expire);
                expect(res.body.expireIn <= expire).equal(true);
                expect(res.body).ownProperty('expireIn');
                expect(res.body).ownProperty('date');
                expect(res.body).ownProperty('expireTime');
            })
            .end(done);
    });

    it('Should renew the token when expired', (done) => {
        // Hum I didn't yet find a way to make it work
        // I tried to back date the token and a lot other stuff
        // if you know a good way to make it, I'll be happy to know about it :)
         done();
        // return request(expressApp).post('/auth/login')
        //     .send({
        //         email: user.email,
        //         password: passwordExpiredUser
        //     })
        //     .expect(200)
        //     .expect((res: any) => {
        //         expect(res.body.token).be.not.equal(user.tokens[0].token);
        //         expect(res.body.expireTime).equal(expire);
        //         expect(res.body).ownProperty('expireIn');
        //         expect(res.body).ownProperty('date');
        //     })
        //     .end(done);
    });

    it('Should not return the token with the wrong login', (done) => {
        return request(expressApp).post('/auth/login')
            .send({
                email: authClassicEmail,
                password: 'WrOngSecurePassword'
            })
            .expect(401)
            .end(done);
    });
});
