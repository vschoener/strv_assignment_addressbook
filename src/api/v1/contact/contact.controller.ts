import { Router, Response } from 'express';

import { IRequest } from '../../../http/request';
import { Contact } from './contact.model';
import FirebaseContact from './contact.firebase';

const router = Router();

router.post('/', (req: IRequest, res: Response, next: any) => {
    const contact: Contact = Contact.decode(req.body);

    const firebaseContact: FirebaseContact = new FirebaseContact(req.context.firebase);
    firebaseContact.addNewToUser(req.user, contact).then(url => {
        res.status(201).json(contact);
    }).catch(err => next(err));
});

export const ContactController: Router = router;
