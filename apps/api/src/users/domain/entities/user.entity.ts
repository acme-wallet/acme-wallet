import { randomUUID } from 'crypto';

export class User {
  private constructor(
    private readonly _id: string,
    private _name: string,
    private _email: string,
    private readonly _createdAt: Date,
  ) {}

  static create(name: string, email: string) {
    const id = randomUUID();
    const createdAt = new Date();
    return new User(id, name, email, createdAt);
  }

  static restore(
    id: string,
    name: string,
    email: string,
    createdAt: Date,
  ): User {
    return new User(id, name, email, createdAt);
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get email() {
    return this._email;
  }

  get createdAt() {
    return this._createdAt;
  }
}
