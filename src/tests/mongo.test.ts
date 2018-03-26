import * as mongoose from 'mongoose';
import { expect } from 'chai';
import * as express from 'express';


export const MongooseTest = (expressApp: express.Application) => {
    describe('Test Database connection', function () {
        it('should be connected', () => {
            expect(mongoose.connection.readyState).to.be.equal(1);
        });
    });
}
