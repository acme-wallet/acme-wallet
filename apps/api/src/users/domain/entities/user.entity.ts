export class User {
    private _id: string;
    private _name: string;
    private _email: string;

    constructor(name: string, email: string, id?: string) {
        this._id = id || 'abc';
        this._name = name;
        this._email = email;
    }

    get id () { return this._id };
    get name () { return this._name };
    get email () { return this._email };
}
