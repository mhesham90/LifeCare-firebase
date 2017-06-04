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
    getNextKeys(searchkey, lastkey, limit) {
        let cursorQuery = this.db.query({ path: this.entity + '/' + searchkey + '/data', where: 'id', equal: lastkey });
        return new Promise((resolve, reject) => {
            this.db.executeOne(cursorQuery)
                .then((data) => {
                if (Object.keys(data).length === 0) {
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
    removeExpired(min = 15) {
        let now = Date.now();
        let cutoff = now - min * 60 * 1000;
        let query = this.db.query({ path: 'result/', where: 'timestamp', end: cutoff });
        this.db.executeAll(query).then((snapshots) => {
            snapshots.forEach((result) => {
                console.log(result);
                this.remove(result.uid);
            });
        });
    }
}
exports.ResultDAO = ResultDAO;
exports.resultDAO = new ResultDAO();
