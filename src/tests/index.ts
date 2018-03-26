import { mongo, expressApp } from '../bootstrap';

import { MongooseTest } from './mongo.test';
import { ServerTest } from './server.test';
import { HomeTest } from './api/home.test';
import { AuthTest } from './api/auth.test';
import { ContactTest } from './api/contact.test';

beforeAll((done) => {
    mongo.connect();
    mongo.connection.on('connected', () => {
        mongo.connection.db.dropDatabase(() => {
            done();
        });
    });
});

MongooseTest(expressApp);
ServerTest(expressApp);
HomeTest(expressApp);
AuthTest(expressApp);

// Didn't find a good way to test firebase with mock
// Never mock this kind of service before and even on Node :(
// So I would like to know if it becomes to my implementation (to hard to test it ?)
// Or something else ? :)
//ContactTest(expressApp);
