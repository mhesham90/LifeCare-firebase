"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_1 = require("./abstract");
const district_1 = require("../models/district");
var inside = require('point-in-polygon');
class DistrictDAO extends abstract_1.AbstractDAO {
    constructor() {
        super();
        this.entity = 'district';
    }
    deserialize(data) {
        let district = new district_1.default();
        district.set(data);
        return district;
    }
    getByCoords(long, lat) {
        return this.getAll()
            .then((districts) => {
            return new Promise((resolve, reject) => {
                districts.forEach((dist) => {
                    let pointsList = this.getPointsList(dist);
                    if (inside([long, lat], pointsList)) {
                        resolve(dist);
                    }
                });
                resolve(new district_1.default());
            });
        }).catch((err) => {
            return Promise.reject(err);
        });
    }
    getPointsList(dist) {
        let pointsString = dist.points || "";
        let myPoints = pointsString.split(",");
        let pointsList = [];
        for (var i = 0; i < myPoints.length; i += 2)
            pointsList.push(myPoints.slice(i, i + 2));
        pointsList = pointsList.map((arr) => arr.map(Number));
        return pointsList;
    }
    findDistrict(district_id, gpslong, gpslat) {
        return new Promise((resolve, reject) => {
            if (district_id !== "" && district_id !== undefined) {
                this.getById(district_id)
                    .then((dis) => {
                    resolve(dis.uid);
                }).catch((err) => {
                    reject(err);
                });
            }
            else {
                this.getByCoords(gpslong, gpslat)
                    .then((dis) => {
                    resolve(dis.uid);
                }).catch((err) => {
                    reject(err);
                });
            }
        });
    }
}
exports.districtDAO = new DistrictDAO();
