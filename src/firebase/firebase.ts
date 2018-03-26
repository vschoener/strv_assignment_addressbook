import * as fs from 'fs';
import * as firebase from 'firebase';
import * as firebaseAdmin from 'firebase-admin';

import { FirebaseInterface } from './firebaseInterface';

export default class Firebase implements FirebaseInterface {
    private ref: firebase.database.Reference;

    /**
     * Constructor
     * @param {string} serviceAccount
     * @param {string} url
     */
    constructor(private serviceAccount: string, private url: string) {}

    /**
     * Initialize connection
     * @returns {firebase.database.Reference}
     */
    initialize(): firebase.database.Reference {
        if (!fs.existsSync(this.serviceAccount)) {
            process.exit(1);
        }

        firebaseAdmin.initializeApp({
            credential: firebaseAdmin.credential.cert(this.serviceAccount),
            databaseURL: this.url
        });
        firebaseAdmin.auth();
        firebaseAdmin.database.enableLogging(true);
        this.ref = firebaseAdmin.database().ref('AddressBooks');

        return this.ref;
    }

    /**
     * Get ref
     * @returns {firebase.database.Reference}
     */
    getRef(): firebase.database.Reference {
        return this.ref;
    }
}
