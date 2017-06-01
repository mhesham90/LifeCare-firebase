"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const medicine_1 = require("../DAO/medicine");
const express_1 = require("express");
const medicineRouter = express_1.Router();
medicineRouter.get('/search', function (req, res, next) {
    let text = (req.query.text || '').toLowerCase();
    medicine_1.medicineDAO.searchByName(text)
        .then((medicines) => {
        res.status(200).send(medicines);
    }).catch((err) => {
        res.status(404).send(err);
    });
});
medicineRouter.get('/:id', function (req, res, next) {
    medicine_1.medicineDAO.getById(req.params.id)
        .then((data) => {
        res.status(200).send(data);
    }).catch((err) => {
        res.status(404).send("not found " + err);
    });
});
exports.default = medicineRouter;
