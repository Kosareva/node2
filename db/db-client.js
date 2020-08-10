import fs from "fs";

const pathToDb = 'db/db.json';

class Collection {
    _name;
    _data;

    constructor(name, data = []) {
        this._name = name;
        this._data = this._read()[this._name] || [];
    }

    get(id) {
        const found = this._data.find((el) => el.id === id);
        return found ? {...found} : null;
    }

    getAll(options = {}) {
        const {substr, limit, sortBy, searchBy} = options;
        let copy = [...this._data];
        if (substr && searchBy) {
            copy = copy.filter(el => el[searchBy].includes(substr));
        }
        if (sortBy) {
            copy.sort((a, b) => a[sortBy].toLowerCase().localeCompare(b[sortBy].toLowerCase()));
        }
        if (limit) {
            copy = copy.slice(0, +limit);
        }
        return copy;
    }

    add(element) {
        this._data.push(element);
        this._write();
        return {...element};
    }

    remove(id) {
        const found = this._data.find((el) => el.id === id) || null;
        if (found) {
            found.isDeleted = true;
            this._write();
        }
        return found;
    }

    update(id, element = {}) {
        const foundIndex = this._data.findIndex((el) => el.id === id);
        let found = null;
        if (foundIndex !== -1) {
            this._data[foundIndex] = {
                ...this._data[foundIndex],
                ...element
            };
            found = {...this._data[foundIndex]};
            this._write();
        }
        return found;
    }

    _read() {
        const db = fs.readFileSync(pathToDb);
        const buffer = Buffer.isBuffer(db) ? db.toString() : null;
        return buffer ? JSON.parse(buffer) : {};
    }

    _write() {
        const dbJson = this._read();
        const updatedDb = {
            ...dbJson,
            [this._name]: this._data
        };
        fs.writeFileSync(pathToDb, JSON.stringify(updatedDb, null, 2))
    }
}

function collection(name) {
    return new Collection(name);
}

function clear() {
    fs.writeFileSync(pathToDb, '');
}

export default {collection, clear};
