"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
class FirebaseORM {
    constructor() {
        this.db = admin.database();
    }
    query(params) {
        let rootRef = this.db.ref(params.path);
        let q = rootRef;
        if (params.where) {
            if (typeof params.where == 'string') {
                q = q.orderByChild(params.where);
            }
            if (typeof params.where == 'object') {
                switch (params.where.by) {
                    case 'child':
                        q = q.orderByChild(params.where.value);
                        break;
                    case 'key':
                        q = q.orderByKey();
                        break;
                    case 'value':
                        q = q.orderByValue();
                        break;
                }
            }
        }
        if (params.equal) {
            q = q.equalTo(params.equal);
        }
        if (params.start) {
            q = q.startAt(params.start);
        }
        if (params.end) {
            q = q.endAt(params.end);
        }
        if (params.limit && (!params.to || params.to === 'first')) {
            q = q.limitToFirst(params.limit);
        }
        if (params.limit && params.to === 'last') {
            q = q.limitToLast(params.limit);
        }
        return q;
    }
    executeAll(query) {
        return new Promise((resolve, reject) => {
            query.once('value').then((snapshots) => {
                let result = [];
                snapshots.forEach((snap) => {
                    let obj = snap.val();
                    obj.uid = snap.key;
                    result.push(obj);
                });
                resolve(result);
            }).catch((error) => reject(error));
        });
    }
    executeOne(query) {
        return new Promise((resolve, reject) => {
            query.once('value').then((snapshot) => {
                let result = {};
                if (snapshot.exists()) {
                    result = snapshot.val();
                    result.uid = snapshot.key;
                }
                resolve(result);
            }).catch((error) => reject(error));
        });
    }
    insertOne(data, ref) {
        if (data.uid) {
            let dataToInsert = {};
            let key = data.uid;
            delete data['uid'];
            dataToInsert[key] = data;
            this.db.ref(ref + '/').update(dataToInsert);
            return key;
        }
        else {
            return this.db.ref(ref + '/').push(data).key;
        }
    }
    insertMany(data, ref) {
        data.forEach((d) => {
            if (d.uid) {
                let dataToInsert = {};
                let key = d.uid;
                delete d['uid'];
                dataToInsert[key] = d;
                this.db.ref(ref + '/').update(dataToInsert);
            }
            else {
                this.db.ref(ref + '/').push(d);
            }
        });
    }
    insertManyInOne(data, ref) {
        let newKey = this.db.ref(ref + '/').push().key;
        data.forEach((d) => {
            if (d.uid) {
                let dataToInsert = {};
                let key = d.uid;
                delete d['uid'];
                dataToInsert[key] = d;
                this.db.ref(ref + '/' + newKey).update(dataToInsert);
            }
            else {
                this.db.ref(ref + '/' + newKey).push(d);
            }
        });
    }
}
exports.default = FirebaseORM;
