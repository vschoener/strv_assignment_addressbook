import * as mongoose from "mongoose";
import { expect } from "chai";

import app from "./../bootstrap";
import Mongo from "./mongo";

describe("Test Database connection", function() {
    it("should be connected", (done) => {
        const mongo: Mongo = app.getMongo();

        mongo.connect().then(() => {
            expect(mongoose.connection.readyState).to.be.equal(1);
            mongo.disconnect();
            done();
        });
    });
});
