"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pharmacyRouter = express_1.Router();
pharmacyRouter.get('/', function (req, res, next) {
    res.status(200).send('pharmacyURL');
});
exports.default = pharmacyRouter;
