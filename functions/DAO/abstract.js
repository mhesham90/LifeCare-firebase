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
    insertOne(data, ref = '') {
        let d = this.serialize(data);
        return this.db.insertOne(d, this.entity + ref);
    }
    insertMany(objects, ref = '') {
        let data = objects.map(this.serialize);
        this.db.insertMany(data, this.entity + ref);
    }
    insertManyInOne(objects, ref = '') {
        let data = objects.map(this.serialize);
        this.db.insertManyInOne(data, this.entity + ref);
    }
    remove(id, ref = '') {
        this.db.remove(id, this.entity + ref);
    }
}
exports.AbstractDAO = AbstractDAO;
