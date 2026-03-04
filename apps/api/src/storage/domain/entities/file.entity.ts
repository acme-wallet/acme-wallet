import { randomUUID } from 'crypto';

export class FileEntity {
  private constructor(
    private readonly _id: string,
    private _name: string,
    private _hash: string,
    private _extension: string,
    private _size: number,
    private readonly _createdAt: Date,
  ) {}

  static create(name: string, hash: string, extension: string, size: number) {
    const id = randomUUID();
    const createdAt = new Date();
    return new FileEntity(id, name, hash, extension, size, createdAt);
  }

  static restore(
    id: string,
    name: string,
    hash: string,
    extension: string,
    size: number,
    createdAt: Date,
  ): FileEntity {
    return new FileEntity(id, name, hash, extension, size, createdAt);
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get hash() {
    return this._hash;
  }

  get extension() {
    return this._extension;
  }

  get size() {
    return this._size;
  }

  get createdAt() {
    return this._createdAt;
  }
}
