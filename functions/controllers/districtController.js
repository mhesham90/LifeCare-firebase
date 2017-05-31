"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const express_1 = require("express");
const districtRouter = express_1.Router();
districtRouter.get('/', function (req, res, next) {
    index_1.districtDAO.getAll()
        .then((data) => {
        res.status(200).send(data);
    }).catch((error) => {
        res.status(503).send("Server Error: " + error);
    });
});
districtRouter.get('/:long/:lat', function (req, res, next) {
    let long = Number(req.params.long);
    let lat = Number(req.params.lat);
    index_1.districtDAO.getByCoords(long, lat)
        .then((district) => {
        res.status(200).send(district);
    }).catch(() => {
        res.status(404).send("error");
    });
});
exports.default = districtRouter;
