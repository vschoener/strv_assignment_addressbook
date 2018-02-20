import app from "../../../bootstrap";
import * as request from "supertest";
import { expect } from "chai";

import Mongo from "./../../../database/mongo";
import { User } from "../user/user.model";

const appExpress = app.getAppExpress();
let token;

beforeAll((done) => {
    const mongo = new Mongo(process.env.MONGODB_URI);

    mongo.connect().then(() => {
        User.remove({}).then(() => {
            done();
        });
    });
});

describe("POST /auth/register", () => {
    it("Should register a new user", (done) => {
        return request(appExpress).post("/auth/register")
            .send({
                email: "john.doe@gmail.com",
                password: "securePassword"
            })
            .expect(201)
            .expect((res) => {
                expect(res.headers["x-auth"]).not.equal(undefined);
                token = res.headers["x-auth"];
            })
            .end(done);
    });

    it("Should be unique", (done) => {
        return request(appExpress).post("/auth/register")
            .send({
                email: "john.doe@gmail.com",
                password: "securePassword"
            })
            .expect(422)
            .end(done);
    });
});

describe("GET /auth/login", () => {
    it("Should return the token with the right credential", (done) => {
        return request(appExpress).post("/auth/login")
            .send({
                email: "john.doe@gmail.com",
                password: "securePassword"
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.token).not.equal(undefined);
                expect(res.body.token).equal(token);
            })
            .end(done);
    });

    it("Should not return the token with the wrong login", (done) => {
        return request(appExpress).post("/auth/login")
            .send({
                email: "john.doe@gmail.com",
                password: "WrOngSecurePassword"
            })
            .expect(401)
            .end(done);
    });
});
