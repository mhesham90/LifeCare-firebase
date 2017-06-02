"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = require("../ORM/firebase");
class AbstractDAO {
    constructor() {
        this.db = new firebase_1.default();
    }
    serialize(data) {
        return Object.assign({}, data);
    }
    getById(id) {
        let query = this.db.query({ path: '/' + this.entity + '/' + id });
        return new Promise((resolve, reject) => {
            this.db.executeOne(query).then((data) => {
                let obj = this.deserialize(data);
                resolve(obj);
            }).catch((error) => { reject(error); });
        });
    }
    getAll() {
        let query = this.db.query({ path: '/' + this.entity });
        return new Promise((resolve, reject) => {
            this.db.executeAll(query).then((data) => {
                let arr = data.map(this.deserialize);
                resolve(arr);
            }).catch((error) => { reject(error); });
        });
    }
    insertOne(ref, data) {
        let d = this.serialize(data);
        this.db.insertOne(ref, d);
    }
    insertMany(ref, objects) {
        let data = objects.map(this.serialize);
        this.db.insertMany(ref, data);
    }
    insertManyInOne(ref, objects) {
        let data = objects.map(this.serialize);
        this.db.insertManyInOne(ref, data);
    }
}
exports.AbstractDAO = AbstractDAO;
