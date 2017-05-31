"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_1 = require("./abstract");
const medicine_1 = require("../models/medicine");
class MedicineDAO extends abstract_1.AbstractDAO {
    constructor() {
        super();
        this.entity = 'medicine';
    }
    deserialize(data) {
        let medicine = new medicine_1.default();
        medicine.get(data);
        return medicine;
    }
    searchByName(name) {
        let query = this.db.query({ path: '/' + this.entity, where: 'LCaseName', start: name, end: name + "\uf8ff" });
        return new Promise((resolve, reject) => {
            this.db.executeAll(query).then((data) => {
                let arr = data.map(this.deserialize);
                resolve(arr);
            }).catch((error) => { reject(error); });
        });
    }
}
exports.default = MedicineDAO;
