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
        pharmacy.set(data);
        return pharmacy;
    }
    getByMedicineAndDistrict(id, district, quantity) {
        let query = this.db.query({ path: '/medicine/' + id + '/pharmacies' });
        let pharmacies = [];
        return new Promise((resolve, reject) => {
            this.db.executeAll(query).then((data) => {
                let pharmsFilteredByQuantity = this.filterAvailableQuantity(data, quantity);
                let pharmsOrderedByDiliveribility = this.orderByDeliverablePharms(pharmsFilteredByQuantity, district);
                resolve(pharmsOrderedByDiliveribility);
            }).catch((err) => {
                reject(err);
            });
        });
    }
    filterAvailableQuantity(arr, quantity) {
        return arr.filter((e) => { return e.quantity > quantity; });
    }
    orderByDeliverablePharms(data, district) {
        let result = [];
        data.forEach((e) => {
            if (e.delivery_areas[district]) {
                result.unshift({ 'id': e.uid, 'delivery': 1 });
            }
            else {
                result.push({ 'id': e.uid, 'delivery': 0 });
            }
        });
        return result;
    }
}
exports.pharmacyDAO = new PharmacyDAO();
