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
    if (searchkey && lastkey) {
    }
    else if (district_id || (gpslong && gpslat)) {
        district_1.districtDAO.findDistrict(district_id, gpslong, gpslat)
            .then((dist_id) => {
            if (!dist_id) {
                res.status(404).send("Not found district");
            }
            else {
                pharmacy_1.pharmacyDAO.getByMedicineAndDistrict(medicine_id, dist_id)
                    .then((data) => {
                    res.status(200).send(data);
                }).catch((err) => {
                    res.status(503).send("get By Medicine And District :" + err);
                });
            }
        }).catch((err) => {
            res.status(503).send("get district error: " + err);
        });
    }
    else {
        res.status(404).send("query params error");
    }
});
exports.default = pharmacyRouter;
