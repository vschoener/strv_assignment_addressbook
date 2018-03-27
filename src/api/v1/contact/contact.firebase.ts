import { IUserDocument } from '../user/user.model';
import { IContact } from './contact.model';
import { FirebaseInterface } from '../../../firebase/firebaseInterface';

export default class FirebaseContact {
    static ref = '/AddressBooks';
    private refContact: firebase.database.Reference;

    constructor(private firebase: FirebaseInterface) {
        this.refContact = firebase.getDatabase().ref(FirebaseContact.ref);
    }

    async addNewToUser(user: IUserDocument, contact: IContact) {
        contact.userId = user._id.toHexString();

        return this.refContact.push(contact);
    }
}
