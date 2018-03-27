import * as fs from 'fs';
import * as firebase from 'firebase';
import * as firebaseAdmin from 'firebase-admin';

import { FirebaseInterface } from './firebaseInterface';

export class Firebase implements FirebaseInterface {
    private database: firebaseAdmin.database.Database;

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
    initialize(): void {
        if (!fs.existsSync(this.serviceAccount) && this.serviceAccount) {
            this.serviceAccount = JSON.parse(this.serviceAccount);
        }
        firebaseAdmin.initializeApp(this.getConfig());
        firebaseAdmin.auth();
        this.database = firebaseAdmin.database();
    }

    getConfig(): Object {
        return {
            credential: firebaseAdmin.credential.cert(this.serviceAccount),
            databaseURL: this.url
        };
    }

    /**
     * Get ref
     * @returns {firebase.database.Reference}
     */
    getDatabase(): firebaseAdmin.database.Database {
        return this.database;
    }
}
