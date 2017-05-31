"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Pharmacy {
    constructor() {
    }
    get(data) {
        this.uid = data.uid;
        this.name = data.name;
        this.imageURL = data.imageURL;
        this.telephone = data.telephone;
        this.loaction = data.loaction;
        this.district = data.district;
        this.medicine = data.medicine;
        this.delivery_start_time = data.delivery_start_time;
        this.delivery_end_time = data.delivery_end_time;
    }
}
exports.default = Pharmacy;
