"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Pharmacy {
    constructor() {
    }
    set(data) {
        this.uid = data.uid;
        this.name = data.name;
        this.imageUrl = data.imageUrl;
        this.telephone = data.telephone;
        this.location = data.location;
        this.district = data.district;
        this.medicine = data.medicine;
        this.delivery_start_time = data.delivery_start_time;
        this.delivery_end_time = data.delivery_end_time;
    }
}
exports.default = Pharmacy;
