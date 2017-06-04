"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const result_1 = require("../DAO/result");
exports.resultListener = (event) => {
    result_1.resultDAO.removeExpired(15);
};
