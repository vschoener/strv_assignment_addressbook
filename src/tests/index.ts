import { mongo, expressApp, firebase } from '../bootstrap';

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
ContactTest(expressApp, firebase);
