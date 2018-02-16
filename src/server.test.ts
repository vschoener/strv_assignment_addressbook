import * as request from "supertest";
import { assert, expect } from "chai";
import app from "./bootstrap";

const appExpress = app.getAppExpress();

describe("Test 404", () => {
    it("Should return 404, Resource not found", (done) => {
        return request(appExpress).get("/42")
            .expect("Content-Type", /json/)
            .expect(404)
            .expect((res: request.Response) => {
                expect(res.body.error.message).to.be.equal("Resource not found");
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                return done();
            });
    });
});
