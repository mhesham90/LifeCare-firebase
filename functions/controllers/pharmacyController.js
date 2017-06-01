"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pharmacy_1 = require("../DAO/pharmacy");
const district_1 = require("../DAO/district");
const express_1 = require("express");
const pharmacyRouter = express_1.Router();
pharmacyRouter.get('/medicine/:id', function (req, res, next) {
    let medicine_id = req.params.id;
    let getDistrict = new Promise((resolve, reject) => {
        if (req.query.district !== "" && req.query.district !== undefined) {
            resolve(req.query.district);
        }
        else {
            district_1.districtDAO.getByCoords(req.query.gpslong, req.query.gpslat)
                .then((dis) => {
                resolve(dis.uid);
            });
        }
    });
    getDistrict.then((district) => {
        pharmacy_1.pharmacyDAO.getByMedicineAndDistrict(medicine_id, district).then((data) => {
            res.status(200).send(data);
        }).catch((err) => {
            res.status(503).send(err);
        });
    });
});
exports.default = pharmacyRouter;
