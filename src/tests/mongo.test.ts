import { expect } from 'chai';

import { mongo } from '../bootstrap';

describe('Test Database connection', function () {
    it('should be connected', async () => {
        await mongo.connect();
        expect(mongo.connection.readyState).to.be.equal(1);
    });
});
