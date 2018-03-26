import * as firebase from 'firebase';

export interface FirebaseInterface {
    initialize(): firebase.database.Reference;
    getRef(): firebase.database.Reference;
}
