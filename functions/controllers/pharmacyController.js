"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pharmacy_1 = require("../DAO/pharmacy");
const district_1 = require("../DAO/district");
const express_1 = require("express");
const pharmacyRouter = express_1.Router();
pharmacyRouter.get('/medicine/:id', function (req, res, next) {
    let medicine_id = req.params.id;
    let district_id = req.query.district;
    let gpslong = req.query.gpslong;
    let gpslat = req.query.gpslat;
    let limit = req.query.limit || 10;
    let searchkey = req.query.searchkey;
    let lastkey = req.query.lastkey;
    let getDistrict = new Promise((resolve, reject) => {
        if (district_id !== "" && district_id !== undefined) {
            resolve(district_id);
        }
        else {
            district_1.districtDAO.getByCoords(gpslong, gpslat)
                .then((dis) => {
                resolve(dis.uid);
            });
        }
    });
    getDistrict.then((dist_id) => {
        if (!dist_id) {
            res.status(404).send("Not found district");
        }
        else {
            pharmacy_1.pharmacyDAO.getByMedicineAndDistrict(medicine_id, dist_id, 5).then((data) => {
                pharmacy_1.pharmacyDAO.insertManyInOne('result', data);
                res.status(200).send(data);
            }).catch((err) => {
                res.status(503).send(err);
            });
        }
    });
});
exports.default = pharmacyRouter;
