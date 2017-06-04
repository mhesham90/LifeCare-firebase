"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pharmacy_1 = require("../DAO/pharmacy");
const result_1 = require("../DAO/result");
const district_1 = require("../DAO/district");
const express_1 = require("express");
const pharmacyRouter = express_1.Router();
pharmacyRouter.get('/medicine/:id', function (req, res, next) {
    let medicine_id = req.params.id;
    let district_id = req.query.district;
    let gpslong = req.query.gpslong;
    let gpslat = req.query.gpslat;
    let limit = Number(req.query.limit) || 10;
    let searchkey = req.query.searchkey;
    let lastkey = req.query.lastkey;
    let current_district;
    var nextPharKeys = new Promise(() => { });
    if (searchkey && lastkey) {
        nextPharKeys = result_1.resultDAO.getNextKeys(searchkey, lastkey, limit);
    }
    else if (district_id || (gpslong && gpslat)) {
        nextPharKeys = new Promise((resolve, reject) => {
            district_1.districtDAO.findDistrict(district_id, gpslong, gpslat)
                .then((dist_id) => {
                if (!dist_id) {
                    res.status(404).send("Not found district");
                }
                else {
                    current_district = dist_id;
                    pharmacy_1.pharmacyDAO.getByMedicineAndDistrict(medicine_id, dist_id, 5).then((data) => {
                        let now = Date.now();
                        searchkey = result_1.resultDAO.insertOne({ timestamp: now });
                        result_1.resultDAO.insertMany(data, '/' + searchkey + '/data');
                        let pharkeys = data.slice(0, limit);
                        resolve(pharkeys);
                    }).catch((err) => {
                        reject(err);
                    });
                }
            }).catch(err => {
                res.status(503).send("get district error: " + err);
            });
        });
    }
    else {
        res.status(404).send("query params error");
    }
    nextPharKeys.then((pharkeys) => {
        let resArray = pharkeys.map((phar) => { return pharmacy_1.pharmacyDAO.getById(phar.id); });
        let pharmacies = [];
        Promise.all(resArray).then((phars) => {
            for (let key in phars) {
                let p = phars[key];
                p.deliverabilty = pharkeys[key]['delivery'];
                pharmacies.push(p);
            }
            res.status(200).send({ pharmacies: pharmacies, district: current_district, searchkey: searchkey });
        }).catch((err) => {
            res.status(503).send(err);
        });
    }).catch((error) => { res.status(503).send(error); });
});
exports.default = pharmacyRouter;
