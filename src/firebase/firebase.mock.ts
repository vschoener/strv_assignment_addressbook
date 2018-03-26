import * as firebase from 'firebase';

import { FirebaseInterface } from './firebaseInterface';

const firebaseMock = require('firebase-mock');
const mockDatabase = new firebaseMock.MockFirebase();
const mockAuth = new firebaseMock.MockFirebase();
const mocksdk = new firebaseMock.MockFirebaseSdk((path: any) => {
    return path ? mockDatabase.child(path) : mockDatabase;
}, () => {
    return mockAuth;
});

export default class FirebaseMock implements FirebaseInterface {

    private ref: firebase.database.Reference;

    /**
     * Constructor
     * @param {string} serviceAccountFile
     * @param {string} url
     */
    constructor(private serviceAccountFile: string, private url: string) {}

    /**
     * Initialize connection
     * @returns {firebase.database.Reference}
     */
    initialize(): firebase.database.Reference {

        mocksdk.initializeApp();
        this.ref = mocksdk.database().ref('AddressBooks');

        return this.ref;
    }

    /**
     * Return current ref
     * @returns {firebase.database.Reference}
     */
    getRef(): firebase.database.Reference {
        return this.ref;
    }
}
