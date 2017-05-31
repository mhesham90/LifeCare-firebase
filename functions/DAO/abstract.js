"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = require("../ORM/firebase");
class AbstractDAO {
    constructor() {
        this.db = new firebase_1.default();
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
}
exports.AbstractDAO = AbstractDAO;
