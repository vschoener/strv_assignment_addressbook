import FirebaseMock from './firebase.mock';
import Firebase from './firebase';
import { FirebaseInterface } from './firebaseInterface';

export class FirebaseFactory {

    /**
     * Return a Firebase instance depending of the env
     * @param {string} env
     * @returns {FirebaseInterface}
     */
    static getInstance(env: string): FirebaseInterface {
        if (env == 'test') {
            return new FirebaseMock('', process.env.FIREBASE_URL);
        }

        console.log('ok');

        return new Firebase(process.env.FIREBASE_SERVICE_ACCOUNT_FILE, process.env.FIREBASE_URL);
    }
}
