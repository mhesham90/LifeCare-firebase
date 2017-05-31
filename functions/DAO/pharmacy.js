"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_1 = require("./abstract");
const pharmacy_1 = require("../models/pharmacy");
class PharmacyDAO extends abstract_1.AbstractDAO {
    constructor() {
        super();
        this.entity = 'district';
    }
    deserialize(data) {
        let pharmacy = new pharmacy_1.default();
        pharmacy.get(data);
        return pharmacy;
    }
}
exports.default = PharmacyDAO;
