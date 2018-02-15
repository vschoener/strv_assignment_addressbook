import * as request from "supertest";
import { assert, expect } from "chai";
import app from "../../../bootstrap";

const appExpress = app.getAppExpress();

describe("Test GET /", () => {
    it("Should response with return 200 OK with json content api version", (done) => {
        return  request(appExpress).get("/")
            .expect("Content-Type", /json/)
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
