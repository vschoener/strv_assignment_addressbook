export interface IContact {
    lastName: string;
    firstName: string;
    address: string;
    addressComplementary: string;
    zipCode: number;
    country: string;
    userId: string;
}

export class Contact implements IContact {
    lastName: string;
    firstName: string;
    address: string;
    addressComplementary: string;
    zipCode: number;
    country: string;
    userId: string;

    // These methods below could be extracted in a global service and use for any
    // others transformation needs.
    encode(): Contact {
        return Object.assign({}, this);
    }

    static decode(json: IContact): Contact {
        const contact: Contact = new Contact();

        return Object.assign(contact, json);
    }
}
