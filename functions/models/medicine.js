"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Medicine {
    constructor() {
    }
    get(data) {
        this.uid = data.uid;
        this.name = data.name;
        this.imageURL = data.imageURL;
        this.category = data.category;
        this.type = data.type;
        this.unit_no = data.unit_no;
        this.unit_price = data.unit_price;
        this.pharmacies = data.pharmacies;
    }
}
exports.default = Medicine;
