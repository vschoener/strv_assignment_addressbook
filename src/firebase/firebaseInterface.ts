import * as firebaseAdmin from 'firebase-admin';

export interface FirebaseInterface {
    initialize(): void;
    getDatabase(): firebaseAdmin.database.Database;
}
