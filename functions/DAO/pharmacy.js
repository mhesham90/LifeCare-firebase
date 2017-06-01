"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_1 = require("./abstract");
const pharmacy_1 = require("../models/pharmacy");
class PharmacyDAO extends abstract_1.AbstractDAO {
    constructor() {
        super();
        this.entity = 'pharmacy';
    }
    deserialize(data) {
        let pharmacy = new pharmacy_1.default();
        pharmacy.get(data);
        return pharmacy;
    }
    getByMedicineAndDistrict(id, district) {
        let query = this.db.query({ path: '/medicine/' + id + '/pharmacies', where: 'district', equal: district });
        let pharmacies = [];
        return new Promise((resolve, reject) => {
            this.db.executeAll(query).then((data) => {
                let availablePharms = data.filter((e) => { return e.quantity > 5; });
                let pharmsPromises = availablePharms.map((e) => { return exports.pharmacyDAO.getById(e.uid); });
                Promise.all(pharmsPromises).then((pharms) => {
                    resolve(pharms);
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
}
exports.pharmacyDAO = new PharmacyDAO();
