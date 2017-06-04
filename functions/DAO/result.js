"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_1 = require("./abstract");
class ResultDAO extends abstract_1.AbstractDAO {
    constructor() {
        super();
        this.entity = 'result';
    }
    deserialize(data) {
    }
    getSome(searchkey, lastkey, limit) {
        let cursorQuery = this.db.query({ path: this.entity + '/' + searchkey + '/data', where: 'id', equal: lastkey });
        return new Promise((resolve, reject) => {
            this.db.executeOne(cursorQuery)
                .then((data) => {
                if (!data) {
                    reject('search key or last key not found');
                }
                delete (data['uid']);
                let start = Object.keys(data)[0];
                let nextKeysQuery = this.db.query({ path: this.entity + '/' + searchkey + '/data', where: { by: 'key' }, start: start, limit: limit + 1 });
                this.db.executeAll(nextKeysQuery)
                    .then((keys) => {
                    keys.shift();
                    resolve(keys);
                }).catch((error) => { reject('keys error'); });
            }).catch((error) => { reject('cursor error'); });
        });
    }
}
exports.ResultDAO = ResultDAO;
exports.resultDAO = new ResultDAO();
