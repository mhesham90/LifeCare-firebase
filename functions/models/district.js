"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class District {
    constructor() {
    }
    set(data) {
        this.uid = data.uid;
        this.name = data.name;
        this.points = data.points;
    }
}
exports.default = District;
